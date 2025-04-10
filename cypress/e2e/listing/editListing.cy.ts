describe('Edit Listing', () => {
  beforeEach(() => {
    cy.resetDatabase()
    cy.initializeTestData()
    cy.visit('http://localhost:5173/login')
    cy.get('input[name="username"]').type('testuser')
    cy.get('input[name="password"]').type('1234')
    cy.get('.submit-btn').click()
    cy.url().should('include', '/home')

    cy.visit('http://localhost:5173/home')
    cy.visit('http://localhost:5173/profile/listings')
    cy.get('.listing-card').first().click()
    cy.get('button').contains('Edit Listing').click()
  })

  it('displays all input fields', () => {
    cy.get('input[placeholder="Listing title"]').should('exist')
    cy.get('textarea[placeholder="Description"]').should('exist')
    cy.get('input[placeholder="Street address"]').should('exist')
    cy.get('input[placeholder="Postal code"]').should('exist')
    cy.get('input[placeholder="Price"]').should('exist')
    cy.get('select').should('exist')
  })

  it('Can not submit when fields are missing', () => {
    cy.get('input[placeholder="Listing title"]').clear()
    cy.get('textarea[placeholder="Description"]').clear()
    cy.get('input[placeholder="Street address"]').clear()
    cy.get('input[placeholder="Postal code"]').clear()
    cy.get('input[placeholder="Price"]').clear()
    cy.get('button.save-button[type="submit"]').click({ force: true })
    cy.get('.error-message', { timeout: 10000 }).should(
      'contain',
      'All fields including address and price are required',
    )
  })

  it('Displays success after valid edit', () => {
    cy.get('input[placeholder="Listing title"]').clear().type('Ny tittel')
    cy.get('textarea[placeholder="Description"]').clear().type('Ny beskrivelse')
    cy.get('input[placeholder="Street address"]').clear().type('Testveien 1')
    cy.get('input[placeholder="Postal code"]').clear().type('1234')
    cy.get('input[placeholder="Price"]').clear().type('500')

    cy.get('select')
      .first()
      .find('option')
      .then((options) => {
        const validOption = [...options].find((opt) => opt.value && opt.value !== '')
        if (validOption) {
          cy.get('select').first().select(String(validOption.value))
        }
      })

    cy.get('button.save-button[type="submit"]').click()
    cy.url().should('include', '/edit-my-listing')
  })

  it('Cancels edit and returns to my listing', () => {
    cy.get('button.cancel-button').click()
    cy.url().should('not.include', '/edit-my-listing')
  })
})
