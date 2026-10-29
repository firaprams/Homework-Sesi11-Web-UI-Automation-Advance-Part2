
const { Builder, By } = require("selenium-webdriver");
const assert = require("assert");
const LoginPage = require("../pages/login.page");
const commonPage = require("../pages/common.page");

describe("Open Sauce Demo", function () {
    let driver;
    let login;
    let common;

    beforeEach(async function () {
        driver = await new Builder()
            .forBrowser("chrome")
            .build();
        login = new LoginPage(driver);
        common = new commonPage(driver);
        await login.openBrowser();
    });

    afterEach(async function () {
        await driver.quit();
    });

    it("Success Login - Standard User", async function () {
        await login.inputUsername("standard_user");
        await login.inputPassword("secret_sauce");
        await login.clickLoginButton();
        assert.strictEqual(
            await login.isShoppingCartVisible(),
            true,
            "Shopping cart should be visible after a successful login"
        );

        // take full screenshot after successful login
        await common.fullScreenshot("login_standard_user");
    });

    it("Success Login - Performance Glitch User", async function () {
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