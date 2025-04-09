describe('View Listing', () => {
  beforeEach(() => {
    cy.resetDatabase()
    cy.initializeTestData()
    cy.visit('http://localhost:5173/login')
    cy.get('input[name="username"]').type('testuser')
    cy.get('input[name="password"]').type('1234')
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/home')

    cy.visit('http://localhost:5173/home')
    cy.visit('http://localhost:5173/profile/listings')
    cy.get('.listing-card').first().click()
  })

  it('View Listing button works and redirects to http://localhost:5173/listing/:listingId', () => {
    cy.get('button').contains('View Listing').click()
    cy.url().should('match', /\/listing\/\d+$/)
  })

  it('Edit Listing works and redirects to http://localhost:5173/edit-my-listing/:listingId', () => {
    cy.get('button').contains('Edit Listing').click()
    cy.url().should('match', /\/edit-my-listing\/\d+$/)
  })

  it("Delete listing works, and redirection to /home works, and alert: alert('Listing deleted!')\n", () => {
    cy.get('button').contains('Delete Listing').click()
    cy.get('button').contains('Yes, delete').click()
    cy.url().should('include', '/home')
    cy.on('window:alert', (str) => {
      expect(str).to.equal('Listing deleted!')
    })
  })

  it('Archiving a listing makes it archived, activating makes it Active', () => {
    cy.intercept('PUT', '**/listings/archive/*').as('archive')

    cy.get('button').contains('Archive').click()

    cy.wait('@archive')

    cy.intercept('PUT', '**/listings/activate/*').as('activate')
    cy.get('button').contains('Publish').click()
    cy.wait('@activate')
  })

  it('Marking a listing as sold makes it sold', () => {
    cy.intercept('PUT', '**/listings/sell/*').as('sell')

    cy.get('button').contains('Mark as Sold').click()

    cy.wait('@sell')
  })

  it('Shows a confirm pop up when Delete Listing is clicked', () => {
    cy.get('button').contains('Delete Listing').click()
    cy.get('.confirm-overlay').should('be.visible')
  })
})
