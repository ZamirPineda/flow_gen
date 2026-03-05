from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto("http://localhost:4173/flow_gen/")

        # Wait for the app to load
        page.wait_for_selector(".react-flow", timeout=10000)

        # Inject some malicious payload into localStorage to see if it's caught
        malicious_data = '{"nodes":[{"id":"test","position":{"x":0,"y":0},"data":{"label":"Malicious Node","polluted":"yes"}}],"edges":[]}'
        page.evaluate(f'localStorage.setItem("flowgen-diagram-state-v5", `{malicious_data}`);')

        # Reload to trigger the load mechanism
        page.reload()
        page.wait_for_selector(".react-flow", timeout=10000)

        # Take a screenshot
        page.screenshot(path="app_screenshot.png")
        browser.close()

if __name__ == "__main__":
    run()
