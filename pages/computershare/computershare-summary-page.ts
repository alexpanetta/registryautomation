import { type Locator, type Page } from '@playwright/test';

export default class ComputershareSummaryPage {

    readonly docLink: Locator;
    private logoutBtn: Locator;
    private logoutCnfBtn: Locator;

    public constructor(page: Page) {
        this.docLink = page.locator('a[href="#Documents"]');
        this.logoutBtn = page.locator('#logout');
        this.logoutCnfBtn = page.locator('#logoutModal');
    }


    public async clickDocuments() {
        await this.docLink.click();
    }


    public async logout() {
        await this.logoutBtn.click();
        await this.logoutCnfBtn.click();
    }
}
