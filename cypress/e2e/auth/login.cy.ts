describe('Login', () => {


  before (() => {
    cy.resetDatabase();
    cy.initializeTestData();
    cy.visit('http://localhost:5173');
  });

  it('skal registrere en ny bruker', () => {
    cy.contains('Login').click();
    cy.url().should('include', '/login');
    cy.get('input[name="username"]').type('testuser');
    cy.get('input[name="password"]').type('1234');
    cy.get('button[type="submit"]').click();
  });

});
