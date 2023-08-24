import { test, expect } from './fixtures/base-page';

import dataJSON from '../test-data/data.json';


test('computershare', async({
    configDotEnv, 
    computershareHomePage, 
    computershareLoginPage, 
    computershareSummaryPage, 
    computershareDocumentsPage, 
    page, 
    closePage 
}) => {
    // Load page
    await computershareHomePage.goto(
        dataJSON['Computershare'].BaseURL 
        + dataJSON['Computershare-Home-Page'].URL
    );
    
    // Login
    await computershareHomePage.clickLogin();
    await expect(computershareLoginPage.userIdInput).toBeVisible();

    await computershareLoginPage.submitUserId(process.env.COMPUTERSHARE_USERID);
    await expect(computershareLoginPage.secAnsInput).toBeVisible();

    const secAnswers: string[][] = [
        [process.env.COMPUTERSHARE_SEC_QUE_0, process.env.COMPUTERSHARE_SEC_ANS_0],
        [process.env.COMPUTERSHARE_SEC_QUE_1, process.env.COMPUTERSHARE_SEC_ANS_1],
        [process.env.COMPUTERSHARE_SEC_QUE_2, process.env.COMPUTERSHARE_SEC_ANS_2]
    ];
    await computershareLoginPage.submitSecAns(secAnswers);
    await expect(computershareLoginPage.passInput).toBeVisible();

    await computershareLoginPage.submitPass(process.env.COMPUTERSHARE_PASS);
    await expect(computershareSummaryPage.docLink).toBeVisible();

    // Go to Documents
    await computershareSummaryPage.clickDocuments();
    await expect(computershareDocumentsPage.stocks).toBeVisible();

    // Hide stocks with zero balance
    await computershareDocumentsPage.clickHideZeroBalance();
    await expect(computershareDocumentsPage.showBalBtn).toBeVisible();

    computershareDocumentsPage.setDateRange(
        dataJSON['Computershare-Documents-Page'].DateFrom, 
        dataJSON['Computershare-Documents-Page'].DateTo
    );

    // Download each stock's documents within date range set above
    await computershareDocumentsPage.download(
        dataJSON['Computershare-Documents-Page'].DownloadFolder, 
        dataJSON['Computershare-Documents-Page'].RegistryName
    );

    // Logout
    await computershareSummaryPage.logout();
    await expect(page).toHaveURL('*' + dataJSON['Computershare-Home-Page'].URL);
});
