const {Given, When, Then, DataTable} = require("@badeball/cypress-cucumber-preprocessor")
let paymentFields = [];
let invoiceAmount = 0;
let invoiceID

after(() => {
    cy.get('[data-cy="user-menu"]').click();
    cy.get('[data-cy="logout"]').click();
})
Given(/^the user visits ([^"]*)$/, (url) => {
    cy.visit(url);
});
Given(/^the user logs in to the site$/, () => {
    cy.get('[data-cy="username"]').type('qa@aiwyn.ai');
    cy.get('[data-cy="password"]').type('password1');
    cy.get('[data-cy="user-login"]').click();
});
Given(/^the user selects two unpaid invoices$/, () => {
    cy.wait(10000)
    cy.get('[data-cy="select-all-invoices"]').uncheck({timeout: 5000});
    cy.get('[data-cy="select-invoice"]').first().check()
    cy.get('tbody > :nth-child(1) > .cdk-column-amount').invoke('text').then((text) => {
        invoiceAmount = text.trim(); //saving the invoice amount for final assertion
    });
    cy.get(':nth-child(1) > [data-cy="invoice-number"]').invoke('text').then((text) => {
        invoiceID = text.trim(); //Saving the invoice ID for final assertion
    });
});
Given(/^the user clicks on the 'Pay for additional service\(s\)'$/, () => {
    cy.get('[data-cy="add-on-button"]').click();
});
Given(/^the user completes the form with the following data$/, function (datatable) {
    paymentFields = datatable.hashes().pop();
    cy.get('.form-select').select(paymentFields.account);
    cy.get('.mat-radio-label').contains(paymentFields.typeOfAddOn).click();
    cy.get('.form-input.mb--050').type(paymentFields.additionalDescription);
    cy.get('[data-cy="payment-amount"]').type(paymentFields.paymentAmount);

});
Given(/^the user Adds the Payment$/, () => {
    cy.get('[data-cy="add-to-payment-button"]').click();
    cy.get('app-add-on.mt-2')
        .should('contain.text', paymentFields.additionalDescription)
        .and('contain.text', paymentFields.paymentAmount);

});
Given(/^the user Adds a new Payment method$/, () => {
    cy.get('[data-cy="new-payment-method-type-option-us_bank_account"]').click();
    cy.wait(7000);
    //fill the first stripe form
    cy.get('iframe').then($iframe => {
        const doc = $iframe.contents();
        let input = doc.find('input')[0];
        cy.wrap(input).type("andres");
        input = doc.find('input')[1];
        cy.wrap(input).type('TestBank');
        let button = doc.find('.p-BankButtonText')[0];
        cy.wrap(button).click();
    });
    cy.wait(7000);
    //Agree terms and conditions
    cy.get('iframe').then($iframe => {
        const doc = $iframe.contents();
        let button = doc.find('[data-testid="agree-button"]');
        cy.wrap(button).click();
        cy.wait(13000);
    });
    //Select the card
    cy.get('iframe').then($iframe => {
        const doc = $iframe.contents();
        let success = doc.find('[data-testid="success"]');
        cy.wrap(success).click();
        let button = doc.find('[data-testid="select-button"]');
        cy.wrap(button).click();
        cy.wait(6000);
    });
    //confirm payment method
    cy.get('iframe').then($iframe => {
        const doc = $iframe.contents();
        let back = doc.find('[data-testid="done-button"]');
        cy.wrap(back).click();
        cy.wait(3000);
    });
    cy.get('[data-cy="create-payment-method-button"]').click()

    //Validating de Duplicated Payment method error message
    cy.get('[data-cy="new-payment-method-validation-error-message"]')
        .should('be.visible',{timeout: 10000})
        .and('contain.text', 'Duplicate payment method')

    // I cancel adding the new payment method and I select the saved ones.
    cy.get('.me-auto > .button').click();
    cy.get('.mat-select-placeholder').click();
    cy.contains('Stripe Test Bank').click();


    const invoiceAmountNoSign = invoiceAmount.replace(/[$,]/g, '');
    const invoiceAmountNro = parseFloat(invoiceAmountNoSign); //convert amount to a number
    const subtotal = invoiceAmountNro + 100 //adding $100 from the additional services

    //Getting the text from the element and converting it to a number, so it can be compared
    cy.get('[data-cy="side-bar-subtotal-amount"]').invoke('text').then((subtotalText) => {
        const subtotalWithDollarSign = subtotalText.trim();
        const subtotalWithoutDollarSignAndCommas = subtotalWithDollarSign.replace(/[$,]/g, '');
        const subtotalLabel = parseFloat(subtotalWithoutDollarSignAndCommas);

        expect(subtotalLabel).to.equal(subtotal) //validating that the subtotal corresponds with the invoice price and the additional service price
    });

    cy.wait(3000)
    const finalPrice = parseFloat((subtotal * 1.035).toFixed(2)); //adding the taxes to the final price
    //Getting the text from the element and converting it to a number, so it can be compared
    cy.get('[data-cy="side-bar-total-amount"]').invoke('text').then((totalText) => {
        const totalWithDollarSign = totalText.trim();
        const totalWithoutDollarSign = totalWithDollarSign.replace(/[$,]/g, '');
        const totalLabel = parseFloat(totalWithoutDollarSign);

        expect(totalLabel).to.equal(finalPrice); //validating that the total corresponds with the invoice price and the additional service price plus taxes
    });

});