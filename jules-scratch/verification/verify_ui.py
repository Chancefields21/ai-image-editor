from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Listen for console events and print them
    page.on("console", lambda msg: print(f"Browser console: {msg.text}"))

    # Navigate to the app
    page.goto("http://localhost:4201/")

    # Take a screenshot of the welcome screen
    page.screenshot(path="jules-scratch/verification/welcome_screen.png")

    # Click the "New from File" button to dismiss the welcome screen
    page.get_by_role("button", name="New from File").click()

    # Wait for the welcome screen to disappear
    page.wait_for_selector('.app-container:not(.welcome-visible)')

    # Take a screenshot of the main UI
    page.screenshot(path="jules-scratch/verification/main_ui.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)