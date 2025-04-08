Cypress.Commands.add('resetDatabase', () => {
  cy.request('POST', 'http://localhost:8080/api/test/reset');
});

Cypress.Commands.add('seedTestUser', () => {
  cy.request('POST', 'http://localhost:8080/api/test/seed', {
    username: 'testuser',
    password: '1234',
  });
})
