import { type Locator, type Page } from '@playwright/test';

export default class ComputershareHomePage {
    
    private page: Page;
    private loginBtn: Locator;

    public constructor(page: Page) {
        this.page = page;
        this.loginBtn = page.getByRole('button').getByText('Login');
    }


    public async goto(URL: string) {
        await this.page.goto(URL);
    }


    public async clickLogin() {
        await this.loginBtn.click();
    }
}
