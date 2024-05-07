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
