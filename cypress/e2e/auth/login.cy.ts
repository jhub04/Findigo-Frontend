describe('Login', () => {
  before(() => {
    cy.resetDatabase()
    cy.initializeTestData()
    cy.visit('http://localhost:5173/login')
  })

  it('skal registrere en ny bruker', () => {
    cy.get('input[name="username"]').type('testuser')
    cy.get('input[name="password"]').type('1234')
    cy.get('.submit-btn').click()
  })
})
