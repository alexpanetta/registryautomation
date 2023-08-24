import { type Locator, type Page } from '@playwright/test';
import path from 'path';

export default class ComputershareDocumentsPage {

    private page: Page;
    private accountName: Locator;
    private zeroBalBtn: Locator;
    readonly showBalBtn: Locator;
    readonly stocks: Locator;
    private stockNameLocator: Locator;
    private fromDate: number;
    private toDate: number;

    public constructor(page: Page) {
        this.page = page;
        this.accountName = page.locator('span[data-bind="text: displayAccountName"]').nth(0);
        this.zeroBalBtn = page.locator('span:has-text("Hide Zero Balances")');
        this.showBalBtn = page.locator('span:has-text("Show Zero Balances")');
        this.stocks = page.locator('.panel-accordion');
        this.stockNameLocator = page.locator('span[data-bind="text: companyName"]');

        // Default date range is one year ago till today
        this.toDate = Date.now();
        this.fromDate = this.toDate - 31536000000;
    }


    public async clickHideZeroBalance() {
        if (await this.zeroBalBtn.count() == 1) {
            await this.zeroBalBtn.click();
        }
    }


    // Loop each stock listed in the table and loop through its documents and download if within the date range
    public async download(parentDownloadFolder: string, registryName: string) {
        var accountNameText: string = await this.accountName.innerText();
        
        var downloadPath: string = path.join(parentDownloadFolder, registryName, accountNameText);
        
        var stockCount: number = await this.stocks.count();
        

        for (let i = 0; i < stockCount; i++) {
            var stock: Locator = this.stocks.nth(i);
            var stockName: string = await stock.locator(this.stockNameLocator).innerText();

            var stockDownloadPath: string = path.join(downloadPath, stockName);

            // expand documents table for that stock
            await stock.click();

            // wait for table to load
            await stock.getByRole('table').waitFor({ state: "attached" });

            // get all rows for the stock
            var rows: Locator = stock.locator('tr');

            const rowsCount: number = await rows.count();

            if (rowsCount == 0) {
                continue;
            }

            // wait for first row in body to be visible
            await rows.nth(1).waitFor({ state: "visible" });

            // exclude header row, start from row(1)
            for (let i: number = 1; i < rowsCount; i++) {
                var row: Locator = rows.nth(i);

                var rowDateText: string = await row.getByRole('cell').first().innerText();

                var docDate: number = this.parseDate(rowDateText);

                if (docDate >= this.fromDate && docDate <= this.toDate) {
                    await this.clickDownload(row, stockDownloadPath);
                } else if (docDate < this.fromDate) {
                    break;
                }
            }
        }
    }


    // Setting dates outside of the constructor to avoid having test data coming from base-page.ts
    public setDateRange(to: string, from: string) {
        this.toDate = new Date(to).getTime();
        this.fromDate = new Date(from).getTime();
    }


    // Convert dd/MM/yyyy format to yyyy-MM-dd
    private parseDate(dateText: string): number {
        const [day, month, year]: string[] = dateText.split('/');

        const date: Date = new Date(Number(year), Number(month) - 1, Number(day));

        return date.getTime();
    }


    // Downloads the document and stores it in an organised folder structure
    private async clickDownload(row: Locator, downloadPath: string) {
        const popupEvent = this.page.waitForEvent('popup');
        const docDownloadEvent = this.page.waitForEvent('download');

        // download document
        await row.locator('a').click();

        // maybe don't need to detect popup
        const popupPage = await popupEvent;
        const docDownload = await docDownloadEvent;

        // wait for download
        await docDownload.path();

        const output: string = path.join(downloadPath, docDownload.suggestedFilename());
        
        // save a copy to new location
        await docDownload.saveAs(output);

        await popupPage.close();
    }
}
