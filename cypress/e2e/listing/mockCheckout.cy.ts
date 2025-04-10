describe('Buy Now', () => {
  beforeEach(() => {
    cy.resetDatabase()
    cy.initializeTestData()
    cy.visit('http://localhost:5173/register')
    cy.get('input[name="username"]').type('testuser2')
    cy.get('input[name="password"]').type('1234')
    cy.get('.submit-btn').click()

    cy.wait(1200)
    cy.get('input[name="username"]').type('testuser2')
    cy.get('input[name="password"]').type('1234')
    cy.get('.submit-btn').click()

    cy.get('.listing-grid > :nth-child(1)').click()
    cy.get('.buy-button').click()
  })

  it('Buy Now button works and redirects to http://localhost:5173/checkout/:listingId', () => {
    cy.url().should('match', /\/listing\/\d+\/checkout$/)
  })

  it('shows error msg if fields are empty', () => {
    cy.get(':nth-child(7) > button').click()
    cy.get('.error-message', { timeout: 10000 }).should(
      'contain',
      'Please fill all required fields.',
    )
  })

  it('goes through with purchase and shows info', () => {
    cy.intercept('PUT', '**/listings/sell/*', {
      statusCode: 200,
      body: {
        salePrice: 999,
        saleDate: new Date().toISOString(),
      },
    }).as('sell')

    cy.get('#fullName').type('Ola Nordmann')
    cy.get('#phoneNumber').type('12345678')
    cy.get('#visaCardNumber').type('4111111111111111')
    cy.get('#expiryDate').type('12/25')
    cy.get('#cvv').type('123')
    cy.get('#deliveryAddress').type('Karl Johans gate 1')
    cy.get('#deliveryInstructions').type('Ring på døra')

    cy.get(':nth-child(7) > button').click()
    cy.wait('@sell')

    cy.contains('Purchase successful!').should('exist')
  })

  it('shows error message when api call fails', () => {
    cy.intercept('PUT', '**/listings/sell/*', {
      statusCode: 500,
      body: {},
    }).as('sell')

    cy.get('#fullName').type('Ola Nordmann')
    cy.get('#phoneNumber').type('12345678')
    cy.get('#visaCardNumber').type('4111111111111111')
    cy.get('#expiryDate').type('12/25')
    cy.get('#cvv').type('123')
    cy.get('#deliveryAddress').type('Karl Johans gate 1')

    cy.get(':nth-child(7) > button').click()
    cy.wait('@sell')

    cy.get('.error-message').should('exist')
  })

  it('returns to home when return home is clicked', () => {
    cy.intercept('PUT', '**/listings/sell/*', {
      statusCode: 200,
      body: {
        salePrice: 999,
        saleDate: new Date().toISOString(),
      },
    })

    cy.get('#fullName').type('Ola Nordmann')
    cy.get('#phoneNumber').type('12345678')
    cy.get('#visaCardNumber').type('4111111111111111')
    cy.get('#expiryDate').type('12/25')
    cy.get('#cvv').type('123')
    cy.get('#deliveryAddress').type('Karl Johans gate 1')

    cy.get(':nth-child(7) > button').click()

    cy.contains('Return Home').click()
    cy.url().should('eq', 'http://localhost:5173/home')
  })
})
