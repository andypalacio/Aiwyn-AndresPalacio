Feature: As a QA, I want to validate I can successfully pay an invoice.

  Scenario: Successfully pay an invoice
    Given the user visits client-portal/main/invoices
    And the user logs in to the site
    And the user selects two unpaid invoices
    And the user clicks on the 'Pay for additional service(s)'
    And the user completes the form with the following data
      | account       | typeOfAddOn   | additionalDescription | paymentAmount |
      | Grady Company | Miscellaneous | Test Description      | 100.00           |
    And the user Adds the Payment
    And the user Adds a new Payment method
    When the user clicks on the 'Pay' button
    Then the user can see a confirmation banner
    And the user can see the payment on the Payments page
