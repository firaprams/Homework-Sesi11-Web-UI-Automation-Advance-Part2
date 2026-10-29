
const { Builder } = require("selenium-webdriver");
const assert = require("assert");
const LoginPage = require("../pages/login.page");

describe("Negative Test - Login SauceDemo", function () {
    let driver;
    let loginPage;

    beforeEach(async function () {
        driver = await new Builder()
            .forBrowser("chrome")
            .build();

        loginPage = new LoginPage(driver);
    });

    afterEach(async function () {
        if (driver) {
            await driver.quit();
        }
    });

    
    it("should reject login with invalid username", async function () {
        await loginPage.openBrowser();

        await loginPage.inputUsername("invalid_user");
        await loginPage.inputPassword("secret_sauce");
        await loginPage.clickLoginButton();

        assert.strictEqual(
            await loginPage.isErrorMessageVisible(),
            true,
            "Error message should be visible"
        );

        assert.strictEqual(
            await loginPage.getErrorMessageText(),
            "Epic sadface: Username and password do not match any user in this service",
            "Error message text should match"
        );

        assert.strictEqual(
            await driver.getCurrentUrl(),
            "https://www.saucedemo.com/"
        );
    });
});
