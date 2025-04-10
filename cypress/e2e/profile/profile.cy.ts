describe('test my profile', () => {
  beforeEach(() => {
    cy.resetDatabase()
    cy.initializeTestData()
    cy.visit('http://localhost:5173/login')
    cy.get('input[name="username"]').type('testuser')
    cy.get('input[name="password"]').type('1234')
    cy.get('.submit-btn').click()
    cy.url().should('include', '/home')
    cy.visit('http://localhost:5173/profile')
    cy.contains('My Profile').click()
  })

  it('Edit username', () => {
    cy.contains('To profile').click()
    cy.get('.edit-icon').click()
    //Should be ready to edit
    cy.get('#username').clear().type('newName')
    cy.get('#password').type('12345')
    cy.get('#phoneNumber').clear().type('12345678'), cy.get('.edit-button').click()
    //Get logged out when editing profile, sleep here
    cy.url().should('include', '/login')
    cy.get('input[name="username"]').type('newName')
    cy.get('input[name="password"]').type('12345')
    cy.get('.submit-btn').click()
    cy.get('[href="/profile"]').click()
    cy.contains('My Profile').click()
    cy.contains('To profile').click()
    cy.get('#username').should('have.value', 'newName')
  })

  it('favorite listing', () => {
    cy.contains('Your Posted Listings').click()
    cy.contains('Et koselig testhus').click()
    cy.contains('View Listing').click()
    cy.get('.favorite-icon-wrapper').click()
    cy.contains('My Profile').click()
    cy.contains('Your Favorites').click()
    cy.contains('Et koselig testhus').should('exist')
  })

  it('archive listing', () => {
    cy.contains('Your Posted Listings').click()
    cy.contains('Et koselig testhus').click()
    cy.contains('Archive').click()
    cy.contains('My Profile').click()
    cy.contains('Your Archived Listings').click()
    cy.contains('Et koselig testhus').click()
    cy.contains('Publish').click()
    cy.contains('My Profile').click()
    cy.contains('Your Posted Listings').click()
    cy.contains('Et koselig testhus').should('exist')
  })

  it('sell listing', () => {
    cy.contains('Your Posted Listings').click()
    cy.contains('Et koselig testhus').click()
    cy.contains('Mark as Sold').click()
    cy.contains('My Profile').click()
    cy.contains('Your Sold Listings').click()
    cy.contains('Et koselig testhus').click()
    cy.contains('View Listing').click
  })
})
