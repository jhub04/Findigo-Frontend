describe('Messages', () => {
  beforeEach(() => {
    cy.resetDatabase()
    cy.initializeTestData()
    cy.visit('http://localhost:5173/login')

    cy.url().should('include', '/login')
    cy.contains('Register').click()
    cy.get('input[name="username"]').type('testuser9')
    cy.get('input[name="password"]').type('1234')
    cy.get('.submit-btn').click()

    cy.url().should('include', '/register')
    cy.contains('Login').click()
    cy.get('input[name="username"]').type('testuser9')
    cy.get('input[name="password"]').type('1234')
    cy.get('.submit-btn').click()
  })

  it('Should be able to send message to seller of a listing', () => {
    cy.visit('http://localhost:5173/home')
    cy.url().should('include', '/home')
    cy.get(':nth-child(1) > .listing-info > .content-wrapper > h3').click()
    cy.get('.send-message-button').click()
    cy.get('textarea').type('Hei')
    cy.get('.message-input > button').click()
  })

  it('Should mark received message as read from inbox', () => {
    cy.visit('http://localhost:5173/home')
    cy.url().should('include', '/home')
    cy.get(':nth-child(1) > .listing-info > .content-wrapper > h3').click()
    cy.get('.send-message-button').click()
    cy.get('textarea').type('Hei')
    cy.get('.message-input > button').click()

    cy.visit('http://localhost:5173/profile')
    cy.url().should('include', '/profile')
    cy.get('.logout-button').click()
    cy.visit('http://localhost:5173/login')
    cy.get('input[name="username"]').type('testuser')
    cy.get('input[name="password"]').type('1234')
    cy.get('.submit-btn').click()
    cy.visit('http://localhost:5173/messages')
    cy.get('.participants').should('have.text', 'testuser3')
    cy.get('.message-body').should('have.text', 'Hei')
    cy.get('.message-preview').first().should('have.class', 'unread-message')
  })

  it('Should mark received message as unread after visting messagethread', () => {
    cy.visit('http://localhost:5173/home')
    cy.url().should('include', '/home')
    cy.get(':nth-child(1) > .listing-info > .content-wrapper > h3').click()
    cy.get('.send-message-button').click()
    cy.get('textarea').type('Hei')
    cy.get('.message-input > button').click()

    // Log out and see message in inbox from the other user
    cy.visit('http://localhost:5173/profile')
    cy.url().should('include', '/profile')
    cy.get('.logout-button').click()
    cy.visit('http://localhost:5173/login')

    cy.get('input[name="username"]').type('testuser')
    cy.get('input[name="password"]').type('1234')
    cy.get('.submit-btn').click()
    cy.visit('http://localhost:5173/messages')
    cy.get('.participants').should('have.text', 'testuser3')
    cy.get('.message-body').should('have.text', 'Hei')
    cy.get('.message-preview').first().should('have.class', 'unread-message')

    cy.get('.message-preview').click()
    cy.visit('http://localhost:5173/messages')
    cy.get('.message-preview').first().should('not.have.class', 'unread-message')
  })

  it('Should not mark own message as unread', () => {
    cy.visit('http://localhost:5173/home')
    cy.url().should('include', '/home')
    cy.get(':nth-child(1) > .listing-info > .content-wrapper > h3').click()
    cy.get('.send-message-button').click()
    cy.get('textarea').type('Hei')
    cy.get('.message-input > button').click()

    cy.visit('http://localhost:5173/messages')
    cy.get('.message-preview').first().should('not.have.class', 'unread-message')
  })
})
