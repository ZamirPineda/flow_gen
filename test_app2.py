from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto("http://localhost:4173/flow_gen/")

        # Wait for the app to load
        page.wait_for_selector(".react-flow", timeout=10000)

        # Inject an INVALID payload to see if Zod rejects it
        # Missing position (which is required in the Zod schema)
        malicious_data = '{"nodes":[{"id":"test","data":{"label":"Malicious Node"}}],"edges":[]}'
        page.evaluate(f'localStorage.setItem("flowgen-diagram-state-v5", `{malicious_data}`);')

        # Reload to trigger the load mechanism
        page.reload()
        page.wait_for_selector(".react-flow", timeout=10000)

        # Wait for toast to appear
        page.wait_for_timeout(1000)

        # Take a screenshot
        page.screenshot(path="app_screenshot_rejected.png")
        browser.close()

if __name__ == "__main__":
    run()
