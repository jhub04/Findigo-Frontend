describe('Login og registrering', () => {


  before (() => {
    cy.resetDatabase();
    cy.visit('http://localhost:5173');
  });

  it('skal registrere en ny bruker', () => {
    cy.contains('Register').click();
    cy.url().should('include', '/register');
    cy.get('input[name="username"]').type('testuser2');
    cy.get('input[name="password"]').type('1234');
    cy.get('button[type="submit"]').click();
  });

});


