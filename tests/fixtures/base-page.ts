import dotenv from 'dotenv';

import { test as base } from '@playwright/test';

import ComputershareHomePage from '../../pages/computershare/computershare-home-page';
import ComputershareLoginPage from '../../pages/computershare/computershare-login-page';
import ComputershareSummaryPage from '../../pages/computershare/computershare-summary-page';
import ComputershareDocumentsPage from '../../pages/computershare/computershare-documents-page';


type RegistryFixtures = {
    computershareHomePage: ComputershareHomePage;
    computershareLoginPage: ComputershareLoginPage;
    computershareSummaryPage: ComputershareSummaryPage;
    computershareDocumentsPage: ComputershareDocumentsPage;
    configDotEnv: any;
    closePage: any;
};


export const test = base.extend<RegistryFixtures>({
    computershareHomePage: async({ page }, use) => {
        await use(new ComputershareHomePage(page));
    },
    computershareLoginPage: async({ page }, use) => {
        await use(new ComputershareLoginPage(page));
    },
    computershareSummaryPage: async({ page }, use) => {
        await use(new ComputershareSummaryPage(page));
    },
    computershareDocumentsPage: async({ page }, use) => {
        await use(new ComputershareDocumentsPage(page, ));
    },
    configDotEnv: async({}, use) => {
        await use(dotenv.config({ path: './creds.env' }));
    },
    closePage: async({ page }, use) => {
        await use(page);
        await page.close();
    }
});


export const expect = base.expect;
exports.dotenv;
