/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      resetDatabase(): Chainable<void>;
      seedTestUser(): Chainable<void>;
      initializeTestData(): Chainable<void>;
    }
  }
}

export {}; // gjør fila til et modul-scope
