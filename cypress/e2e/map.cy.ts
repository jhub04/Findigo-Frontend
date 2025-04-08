// cypress/e2e/map.cy.ts

describe('Kartkomponent', () => {
  before(() => {
    cy.resetDatabase();
    cy.seedTestUser();

    cy.visit('http://localhost:5173/login');
    cy.get('input[name="username"]').type('testuser');
    cy.get('input[name="password"]').type('1234');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/home');
  });

  beforeEach(() => {
    cy.visit('http://localhost:5173/map');
  });

  it('viser markører basert på annonser', () => {
    cy.get('.google-map').should('exist');
    cy.window().then(win => {
      const markers = win.document.querySelectorAll('img[usemap]');
      expect(markers.length).to.be.greaterThan(0);
    });
  });

  it('åpner info-vindu ved klikking på markør', () => {
    cy.get('img[usemap]').first().click({ force: true });
    cy.get('.gm-style-iw').should('exist');
    cy.get('.gm-style-iw').contains(/Go to listing|Next/i).should('exist');
  });

  it('viser neste annonse i info-vindu om flere på samme posisjon', () => {
    cy.get('img[usemap]').first().click({ force: true });
    cy.get('button').contains('Next').click({ force: true });
    cy.get('.gm-style-iw').should('exist');
  });

  it('ruter korrekt ved trykk på Go to listing', () => {
    cy.get('img[usemap]').first().click({ force: true });
    cy.get('.gm-style-iw').contains('Go to listing').click({ force: true });
    cy.url().should('include', '/listing/');
  });

  it('oppdaterer markører ved filtrering (query)', () => {
    cy.visit('http://localhost:5173/map?q=test');
    cy.get('.google-map').should('exist');
    cy.window().then(win => {
      const markers = win.document.querySelectorAll('img[usemap]');
      expect(markers.length).to.be.greaterThan(0);
    });
  });
});
