describe('ListingCard', () => {
  beforeEach(() => {
    cy.resetDatabase()
    cy.initializeTestData()
    cy.visit('http://localhost:5173/register')
    cy.get('#username').type('testuser2')
    cy.get('#password').type('1234')
    cy.get('.submit-btn').click()

    cy.visit('http://localhost:5173/login')
    cy.get('input[name="username"]').type('testuser2')
    cy.get('input[name="password"]').type('1234')
    cy.get('.submit-btn').click()
  })

  it('click on favorite listing and confirm API call', () => {
    cy.get('.listing-card').first().click()
  })
})
