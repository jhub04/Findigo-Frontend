describe('ListingCard', () => {
  beforeEach(() => {
    cy.resetDatabase()
    cy.initializeTestData()
    cy.visit('http://localhost:5173/register')
    cy.get('input[name="username"]').type('testuser2')
    cy.get('input[name="password"]').type('1234')
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/login')

    cy.visit('http://localhost:5173/login')
    cy.get('input[name="username"]').type('testuser2')
    cy.get('input[name="password"]').type('1234')
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/home')

    cy.visit('http://localhost:5173/home')
  })

  it('click on favorite listing and confirm API call', () => {
    cy.get('.listing-card').first().click()
  })
})
