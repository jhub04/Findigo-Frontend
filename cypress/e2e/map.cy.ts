describe('Kartkomponent', () => {
  beforeEach(() => {
    cy.resetDatabase();
    cy.initializeTestData();
    cy.visit('http://localhost:5173/register');
    cy.get('input[name="username"]').type('testuser2');
    cy.get('input[name="password"]').type('1234');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/login');
    cy.get('input[name="username"]').type('testuser2');
    cy.get('input[name="password"]').type('1234');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/home');
    cy.visit('http://localhost:5173/map');
  });

  it('shows markers based on listings', () => {
    cy.get('.google-map').should('exist');
    cy.get('[data-testid="map-marker"]',
      { timeout: 10000 }).should('have.length.greaterThan', 0);
  });

  it('updates markers based on query (query)', () => {
    cy.visit('http://localhost:5173/map?q=test');
    cy.get('.google-map').should('exist');
    cy.get('[data-testid="map-marker"]',
      { timeout: 10000 }).should('have.length.greaterThan', 0);
  });

  it('shows no markers with low max price', () => {
    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.get('input[placeholder="min"]').clear();
    cy.get('input[placeholder="max"]').clear().type('100');
    cy.contains('button', 'Search').click();

    cy.get('[data-testid="map-marker"]',
      { timeout: 10000 }).should('have.length', 0);
  });

  it('shows no markers with too high min price', () => {
    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.get('input[placeholder="min"]').clear().type('10000000');
    cy.get('input[placeholder="max"]').clear();
    cy.contains('button', 'Search').click();

    cy.get('[data-testid="map-marker"]',
      { timeout: 10000 }).should('have.length', 0);
  });

  it('sidebar search updates URL', () => {
    cy.viewport(375, 667); // må være før visit

    cy.visit('http://localhost:5173/map');
    cy.get('button[aria-label="Open filters"]').click();
    cy.get('input[placeholder="Search for listing ..."]').type('testbil{enter}');
    cy.url().should('include', 'q=testbil');
  });
});
