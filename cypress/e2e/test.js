const {Given, When, Then, DataTable} = require("@badeball/cypress-cucumber-preprocessor")

Given(/^the user visits google$/, () => {
    cy.visit('www.google.com')
});