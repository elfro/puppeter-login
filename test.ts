import * as puppeteer from 'puppeteer';

(async () => {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    await page.setViewport({width: 1280, height: 800});
    await page.setCookie({
        name: 'cookie_consent_user_accepted',
        value: 'true',
        domain: 'development-app.renaizant.com'
    });
    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.113 Safari/537.36');

    await page.goto('https://development-app.renaizant.com/');
    const navigationPromise = page.waitForNavigation();

    // login page
    await page.waitForSelector('.btn-holder:nth-child(2)');
    await page.click('.btn-holder:nth-child(2)');


    // email form
    await navigationPromise;
    await page.waitForSelector('input[type="email"]');
    await page.type('input[type="email"]', process.env.EMAIL_G);
    await page.screenshot({path: 'email.png', fullPage: true});  // ToDo 1 email

    const selector = '#identifierNext';
    await page.keyboard.press('Enter');
    await page.waitForSelector(selector, {hidden: true});
    // password form
    await page.waitForSelector('#password', {visible: true});

    await page.type('#password', process.env.PASSWORD_G);
    await page.screenshot({path: 'password.png', fullPage: true}); // ToDo 2 password

    await page.waitForSelector('#passwordNext', {visible: true});

    await page.keyboard.press('Enter');
    await page.screenshot({path: 'click_pwd.png', fullPage: true}); // ToDo 3 password clicked
    await navigationPromise;

    if (await page.$('submit_approve_access') !== null) {
        console.log(1111);
        await page.click('#submit_approve_access');
        await page.waitForSelector('#submit_approve_access', {hidden: true});
        await page.screenshot({path: 'click_access_control.png', fullPage: true}); // ToDo 4 access clicked
    }

    await page.waitForSelector('.onboarding-form', {visible: true});
    await page.screenshot({path: 'org.png', fullPage: true}); // ToDo 4 org form

    await browser.close();
})();
