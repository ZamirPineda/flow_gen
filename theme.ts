

export const THEME = {
  // LAYOUT DIMENSIONS
  dimensions: {
    nodeWidth: 240,
    nodeHeight: 200,
    iconSize: 48,
    sequenceActorSpacing: 180, 
    sequenceStepHeight: 50,    
  },
  
  // Z-INDEX LAYERS
  layers: {
    nodes: 2000,
    edges: 0,
    labels: 2001,
  },

  // COLORS - Multi-Theme Palettes
  colors: {
    background: '#0f172a', 
    text: '#f8fafc',
    primary: '#6366f1',
    
    // 1. DATA ENGINEERING (Neon/Dark Mode Vibes)
    dataEngineering: {
      compute: '#f97316',   // Orange (Spark)
      storage: '#06b6d4',   // Cyan (Delta Lake)
      stream: '#d946ef',    // Fuchsia (Kafka)
      ingestion: '#10b981', // Emerald
      orchestration: '#6366f1', // Indigo
      default: '#64748b'
    },

    // 2. CLOUD ARCHITECTURE (Professional AWS/Azure Blues)
    cloud: {
      compute: '#3b82f6',   // Blue
      database: '#6366f1',  // Indigo
      network: '#8b5cf6',   // Violet
      security: '#ef4444',  // Red
      storage: '#0ea5e9',   // Sky
      default: '#475569'
    },

    // 3. AI & ML (Futuristic Purple/Teal)
    ai: {
      model: '#a855f7',     // Purple
      data: '#14b8a6',      // Teal
      infrastructure: '#334155', // Slate
      output: '#f43f5e',    // Rose
      default: '#64748b'
    },

    // 4. SECURITY (High Alert Red/Amber)
    security: {
      policy: '#ef4444',    // Red
      firewall: '#f59e0b',  // Amber
      asset: '#3b82f6',     // Blue
      user: '#10b981',      // Green
      default: '#64748b'
    },

    // 5. HEXAGONAL / BACKEND (Strict User Rules)
    hexagonal: {
      inbound: '#22c55e',   // Green (Driving Adapters)
      application: '#3b82f6', // Blue (Application Layer)
      domain: '#a855f7',    // Purple (Domain Layer)
      port: '#fbbf24',      // Yellow/Amber (Ports/Interfaces)
      adapter: '#f97316',   // Orange (Driven Adapters)
      infrastructure: '#172554', // Dark Blue (DB/Infra)
      external: '#ec4899',  // Pink (Fallback)
    },
    
    // 6. STANDARD FALLBACK
    standard: {
      client: '#10b981',    
      service: '#64748b',   
      database: '#0ea5e9',  
      queue: '#f472b6',     
      cloud: '#8b5cf6',     
      security: '#ef4444',  
      ai: '#d946ef',        
      file: '#94a3b8',
      table: '#3b82f6',     
    },

    // 7. DEVICES & NETWORK
    network: {
      router: '#8b5cf6',      // Violet
      loadBalancer: '#3b82f6',// Blue
      gateway: '#d946ef',     // Magenta
      firewall: '#ef4444',    // Red
      iot: '#10b981',         // Emerald
      mobile: '#f59e0b',      // Amber
      browser: '#0ea5e9',     // Sky
      dashboard: '#14b8a6'    // Teal
    },
    
    // 8. BIG DATA & DISTRIBUTED
    bigData: {
        cluster: '#6366f1',     // Indigo
        job: '#f59e0b',         // Amber
        lake: '#06b6d4',        // Cyan
        warehouse: '#64748b',   // Slate
        stream: '#d946ef',      // Fuchsia
        machine: '#a855f7'      // Purple
    },

    // SEQUENCE SPECIFIC
    sequence: {
      actor: '#60a5fa',     
      participant: '#34d399',      
      database: '#facc15',       
    }
  }
};