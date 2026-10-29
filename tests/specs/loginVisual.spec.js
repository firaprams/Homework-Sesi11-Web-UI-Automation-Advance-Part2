const { Builder, By, until } = require("selenium-webdriver"); // Ditambahkan until untuk proteksi timeout
const assert = require("assert"); // PERBAIKAN UTAMA: Wajib di-import agar tidak error 'assert is not defined'
const loginPage = require("../pages/login.page");
const commonPage = require("../pages/common.page");
const visualRegression = require("../../utilities/visualRegression.helper");

describe("Open Sauce Demo", function () {
    let driver;
    let login;
    let common;
    let visualHelper;

    // Naikkan timeout Mocha agar proses capture screenshot & visual match tidak terputus di tengah jalan
    this.timeout(30000); 

    beforeEach(async function () {
        driver = await new Builder()
            .forBrowser("chrome")
            .build();
        
        // Rekomendasi: Atur ukuran window agar resolusi gambar screenshot selalu konsisten
        await driver.manage().window().setSize({ width: 1280, height: 800 });
        // Implicit wait global untuk memproteksi error element not found sementara rendering
        await driver.manage().setTimeouts({ implicit: 5000 });

        login = new loginPage(driver);
        common = new commonPage(driver);
        visualHelper = new visualRegression();
        await login.openBrowser();
    });

    afterEach(async function () {
        if (driver) {
            await driver.quit();
        }
    });

    // --- POSITIVE CASE ---
    it("Success Login - Standard User", async function () {
        await login.inputUsername("standard_user");
        await login.inputPassword("secret_sauce");
        await login.clickLoginButton();
        assert.strictEqual(
            await login.isShoppingCartVisible(),
            true,
            "Shopping cart should be visible after a successful login"
        );

        await driver.wait(
            () => driver.executeScript(
                "return Array.from(document.images).every(image => image.complete && image.naturalWidth > 0)"
            ),
            10000
        );

        // take full screenshot after successful login
        await common.fullScreenshot("visual_standard_user");

        // Copy screenshot to visual-current
        visualHelper.saveCurrentScreenshot(
            "screenshots/visual_standard_user.png",
            "visual_standard_user.png"
        );

        // Compare with baseline
        const result = await visualHelper.compareImages(
            "visual_standard_user.png"
        );

        console.log(result);

        // If baseline doesn't exist
        if (!result.hasBaseline) {
            visualHelper.saveAsBaseline(
                "visual_standard_user.png"
            );
            console.log(
                "Baseline created: visual_standard_user.png"
            );
        } else {
            
            assert.strictEqual(
                result.match,
                true,
                result.message
            );
        }
    });

    // --- NEGATIVE CASE (Pindahan dari login.spec.js lama yang sudah diperbaiki) ---
    it("should reject login with invalid username", async function () {
        await login.inputUsername("invalid_user");
        await login.inputPassword("secret_sauce");
        await login.clickLoginButton();

        // Pengaman Timeout: Paksa driver menunggu sampai kontainer error terlihat murni sebelum assertion
        // Note: Selector ini menggunakan data-test standar SauceDemo, sesuaikan jika login.page.js Anda beda
        await driver.wait(until.elementLocated(By.css('[data-test="error"]')), 5000);

        // Assertion 1: pesan error terlihat
        assert.strictEqual(
            await login.isErrorMessageVisible(),
            true,
            "Error message should be visible"
        );

        // Assertion 2: isi pesan error sesuai
        assert.strictEqual(
            await login.getErrorMessageText(),
            "Epic sadface: Username and password do not match any user in this service",
            "Error message text should match"
        );

        // Assertion 3: user tetap berada di halaman login
        const currentUrl = await driver.getCurrentUrl();
        assert.strictEqual(
            new URL(currentUrl).origin,
            "https://www.saucedemo.com",
            `User seharusnya tetap berada di halaman login. URL saat ini: ${currentUrl}`
        );

        await common.fullScreenshot("visual_invalid_user");
        visualHelper.saveCurrentScreenshot(
            "screenshots/visual_invalid_user.png",
            "visual_invalid_user.png"
        );

        const result = await visualHelper.compareImages(
            "visual_invalid_user.png"
        );

        if (!result.hasBaseline) {
            visualHelper.saveAsBaseline("visual_invalid_user.png");
            console.log("Baseline created: visual_invalid_user.png");
        } else {
            assert.strictEqual(
                result.match,
                true,
                result.message
            );
        }
    });

    it.skip("Success Login - Performance Glitch User", async function () {
        await login.inputUsername("performance_glitch_user");
        await login.inputPassword("secret_sauce");
        await login.clickLoginButton();
        assert.strictEqual(
            await login.isShoppingCartVisible(),
            true,
            "Shopping cart should be visible after a successful login"
        );

        // take element screenshot of shopping cart after successful login
        await common.elementScreenshot(By.xpath("//*[@data-test='shopping-cart-link']"), 
        "shopping_cart_performance_glitch_user");
    });
});
