
import { isValidGitHubUrl } from '../utils/security';

export interface RepoInfo {
    owner: string;
    repo: string;
}

const RELEVANT_FILES = [
    // Infrastructure
    'docker-compose.yml', 'docker-compose.yaml',
    'Dockerfile',
    'serverless.yml', 'serverless.yaml',
    'fly.toml',
    
    // Kubernetes / Helm
    'Chart.yaml', 'values.yaml',
    'deployment.yaml', 'service.yaml', 'ingress.yaml',
    
    // Terraform
    '.tf',
    
    // CI/CD
    '.github/workflows', '.gitlab-ci.yml', 'circleci/config.yml',
    
    // Dependencies (to infer tech stack)
    'package.json', // Node
    'go.mod', // Go
    'pom.xml', 'build.gradle', // Java
    'requirements.txt', 'Pipfile', 'pyproject.toml', // Python
    'Gemfile', // Ruby
    'Cargo.toml', // Rust
    'composer.json', // PHP
    
    // Context
    'README.md'
];

export const parseRepoUrl = (url: string): RepoInfo | null => {
    try {
        // Security: Use centralized validation for protocol and domain
        if (!isValidGitHubUrl(url)) return null;

        // Security: Prevent directory traversal attempts in the raw URL
        if (url.includes('..')) return null;

        const urlObj = new URL(url);
        const pathParts = urlObj.pathname.split('/').filter(Boolean);
        if (pathParts.length >= 2) {
            const owner = pathParts[0];
            const repo = pathParts[1];

            // Security: Prevent directory traversal or injection via URL components
            // Allow alphanumeric, hyphens, underscores, and periods.
            const safePattern = /^[a-zA-Z0-9_.-]+$/;
            // Explicitly reject ".." or start/end with period to prevent traversal attempts
            if (!safePattern.test(owner) || !safePattern.test(repo) || owner.includes('..') || repo.includes('..')) {
                return null;
            }

            return { owner, repo };
        }
        return null;
    } catch (e) {
        return null;
    }
};

const getHeaders = (token?: string) => {
    const headers: HeadersInit = {
        'Accept': 'application/vnd.github.v3+json',
    };
    if (token) {
        headers['Authorization'] = `token ${token}`;
    }
    return headers;
};

export const scanRepository = async (
    url: string, 
    token?: string,
    onProgress?: (msg: string) => void
): Promise<string> => {
    const repoInfo = parseRepoUrl(url);
    if (!repoInfo) throw new Error("Invalid GitHub URL");

    const { owner, repo } = repoInfo;
    const baseUrl = `https://api.github.com/repos/${owner}/${repo}`;

    // 1. Get Default Branch
    if (onProgress) onProgress("Connecting to GitHub...");
    const repoDataRes = await fetch(baseUrl, { headers: getHeaders(token) });
    if (!repoDataRes.ok) {
        if (repoDataRes.status === 404) throw new Error("Repository not found. Is it private? Try adding a token.");
        if (repoDataRes.status === 403) throw new Error("API Rate Limit Exceeded. Try adding a token.");
        throw new Error("Failed to connect to repository.");
    }
    const repoData = await repoDataRes.json();
    const defaultBranch = repoData.default_branch || 'main';

    // 2. Get File Tree (Recursive)
    if (onProgress) onProgress(`Fetching file structure (${defaultBranch})...`);
    const treeUrl = `${baseUrl}/git/trees/${defaultBranch}?recursive=1`;
    const treeRes = await fetch(treeUrl, { headers: getHeaders(token) });
    if (!treeRes.ok) throw new Error("Failed to fetch file tree.");
    
    const treeData = await treeRes.json();
    const allFiles: any[] = treeData.tree || [];

    // 3. Filter Relevant Files
    if (onProgress) onProgress("Identifying architectural components...");
    const filesToFetch = allFiles.filter((file: any) => {
        if (file.type !== 'blob') return false; // Ignore directories, we want files
        
        const fileName = file.path.split('/').pop();
        const ext = fileName.includes('.') ? '.' + fileName.split('.').pop() : '';
        
        // Check exact match or extension match
        const isRelevant = RELEVANT_FILES.some(pattern => {
            if (pattern.startsWith('.')) return ext === pattern; // e.g. .tf
            if (file.path.includes(pattern)) return true; // Path match
            return fileName === pattern;
        });

        // Limit size to avoid massive files (skip > 100KB)
        const isSmallEnough = file.size < 100000; 

        return isRelevant && isSmallEnough;
    });

    if (filesToFetch.length === 0) {
        return `Repository ${owner}/${repo} scanned. No obvious infrastructure (Docker, K8s, Terraform) or dependency files found.`;
    }

    // 4. Fetch File Contents (In Parallel with limit)
    if (onProgress) onProgress(`Reading ${filesToFetch.length} config files...`);
    
    let combinedContent = `REPOSITORY CONTEXT: ${url}\n\n`;
    const MAX_FILES_TO_READ = 15; // Cap to prevent token overflow
    const selectedFiles = filesToFetch.slice(0, MAX_FILES_TO_READ);

    const promises = selectedFiles.map(async (file: any) => {
        try {
            // Using raw header to get content directly
            const rawUrl = `${baseUrl}/contents/${file.path}`;
            const headers = getHeaders(token);
            headers['Accept'] = 'application/vnd.github.v3.raw';
            
            const res = await fetch(rawUrl, { headers });
            if (res.ok) {
                const text = await res.text();
                return `--- FILE: ${file.path} ---\n${text}\n\n`;
            }
        } catch (e) {
            console.warn(`Failed to fetch ${file.path}`);
        }
        return "";
    });

    const contents = await Promise.all(promises);
    combinedContent += contents.join("");

    if (filesToFetch.length > MAX_FILES_TO_READ) {
        combinedContent += `\n... (and ${filesToFetch.length - MAX_FILES_TO_READ} more files omitted for brevity)`;
    }

    return combinedContent;
};
