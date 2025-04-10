describe('Login og registrering', () => {
  before(() => {
    cy.resetDatabase()
    cy.visit('http://localhost:5173/login')
  })

  it('skal registrere en ny bruker', () => {
    cy.get('.register-link > a').click()
    cy.get('input[name="username"]').type('testuser2')
    cy.get('input[name="password"]').type('1234')
    cy.get('.submit-btn').click()
  })
})
