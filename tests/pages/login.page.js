
const { until } = require("selenium-webdriver");
const loginLocator = require("../locators/login.locator");

class LoginPage {
    constructor(driver) {
        this.driver = driver;
    }

    async openBrowser() {
        await this.driver.get(loginLocator.url);

        await this.driver.wait(
            until.elementLocated(loginLocator.selectors.usernameInput),
            5000
        );
    }

    async inputUsername(username) {
        const inputUsername = await this.driver.findElement(
            loginLocator.selectors.usernameInput
        );

        await inputUsername.clear();
        await inputUsername.sendKeys(username);
    }

    async inputPassword(password) {
        const inputPassword = await this.driver.findElement(
            loginLocator.selectors.passwordInput
        );

        await inputPassword.clear();
        await inputPassword.sendKeys(password);
    }

    async clickLoginButton() {
        const loginButton = await this.driver.findElement(
            loginLocator.selectors.loginButton
        );

        await loginButton.click();
    }

    async isShoppingCartVisible() {
        const shoppingCart = await this.driver.findElement(
            loginLocator.selectors.shoppingCart
        );

        return await shoppingCart.isDisplayed();
    }

    async isErrorMessageVisible() {
        const errorMessage = await this.driver.wait(
            until.elementLocated(
                loginLocator.selectors.errorMessage
            ),
            10000
        );

        return await errorMessage.isDisplayed();
    }

    async getErrorMessageText() {
        const errorMessage = await this.driver.findElement(
            loginLocator.selectors.errorMessage
        );

        return await errorMessage.getText();
    }

}

module.exports = LoginPage;
