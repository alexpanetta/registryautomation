import { type Locator, type Page } from '@playwright/test';

export default class ComputershareLoginPage {

    readonly userIdInput: Locator;
    readonly passInput: Locator;
    private nextBtn: Locator;
    private secQues: Locator;
    readonly secAnsInput: Locator;

    public constructor(page: Page) {
        this.userIdInput = page.locator('#UserIdTextBox');
        this.passInput = page.locator('#PasswordTextBox');
        this.nextBtn = page.locator('#NextButton');
        this.secQues = page.locator('#AnswerLabel');
        this.secAnsInput = page.locator('#AnswerTextBox');
    }


    public async submitUserId(userId: string) {
        await this.userIdInput.fill(userId);
        await this.clickNext();
    }


    private async clickNext() {
        await this.nextBtn.click();
    }


    // Arguments passed in as array of [question, answer] arrays
    public async submitSecAns(secAnswers: string[][]) {
        var secAns: string = '';
        
        switch (await this.secQues.textContent()) {
            case secAnswers[0][0]:
                secAns = secAnswers[0][1];
                break;

            case secAnswers[1][0]:
                secAns = secAnswers[1][1];
                break;

            case secAnswers[2][0]:
                secAns = secAnswers[2][1];
                break;
        }

        await this.secAnsInput.fill(secAns);
        await this.clickNext();
    }


    public async submitPass(pass: string) {
        await this.passInput.fill(pass);
        await this.nextBtn.click();
    }
}
