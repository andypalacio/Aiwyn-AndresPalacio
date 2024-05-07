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