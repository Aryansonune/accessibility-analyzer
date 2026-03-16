# backend/selenium_fetch.py
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support.ui import WebDriverWait
import selenium.common.exceptions as sel_exc

def create_driver(headless=True):
    options = Options()
    if headless:
        # use the new headless mode if supported
        options.add_argument("--headless=new")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-gpu")
    options.add_argument("--window-size=1280,1024")
    options.add_argument("--disable-extensions")
    options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                         "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117 Safari/537.36")
    driver = webdriver.Chrome(
        service=Service(ChromeDriverManager().install()),
        options=options
    )
    return driver

def fetch_rendered_html(url, timeout=20):
    driver = create_driver(headless=True)
    try:
        driver.set_page_load_timeout(timeout)
        driver.get(url)
        wait = WebDriverWait(driver, timeout)
        # wait for full document load
        wait.until(lambda d: d.execute_script("return document.readyState") == "complete")
        return driver.page_source
    except sel_exc.TimeoutException:
        return driver.page_source
    finally:
        try:
            driver.quit()
        except Exception:
            pass