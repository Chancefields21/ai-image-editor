from playwright.sync_api import sync_playwright

import time

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Give the server a moment to start
    time.sleep(10)

    page.goto("http://localhost:4200/")

    # Close the welcome modal
    page.locator("app-welcome-modal .close-button").click()

    # Take a screenshot of the initial editor
    page.screenshot(path="jules-scratch/verification/01_editor_view.png")

    # Draw a selection
    selection_canvas = page.locator(".selection-canvas")
    selection_canvas.hover()
    page.mouse.down()
    page.mouse.move(250, 250)
    page.mouse.up()

    # Take a screenshot of the selection
    page.screenshot(path="jules-scratch/verification/02_selection_drawn.png")

    # Click the grab button
    page.locator("app-move-tool-panel button").click()

    # Take a screenshot of the result
    page.screenshot(path="jules-scratch/verification/03_grabber_result.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)