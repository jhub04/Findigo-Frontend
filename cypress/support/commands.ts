Cypress.Commands.add('resetDatabase', () => {
    cy.request('POST', 'https://localhost:8080/api/test/reset');
  }
);

Cypress.Commands.add('seedTestUser', () => {
  cy.request('POST', 'https://localhost:8080/api/test/seed', {
    username: 'testuser',
    password: '1234',
  });
})

Cypress.Commands.add('initializeTestData', () => {
  cy.request('POST', 'https://localhost:8080/api/test/init');
});
