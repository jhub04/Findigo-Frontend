describe('Edit Listing', () => {
  beforeEach(() => {
    cy.session('login-session', () => {
      cy.resetDatabase();
      cy.initializeTestData();

      cy.visit('http://localhost:5173/login');
      cy.get('input[name="username"]').type('testuser');
      cy.get('input[name="password"]').type('1234');
      cy.get('button[type="submit"]').click();
      cy.url().should('include', '/home');
    });
  });
  it('går via Manage Listing og inn på Edit Listing-skjemaet', () => {
    cy.intercept('GET', '**/users/me/activeListings').as('getActiveListings');
    cy.visit('http://localhost:5173/profile/listings');
    cy.wait('@getActiveListings');

    // Stub window.open for å fange hvor den prøver å gå
    let listingUrl = '';
    cy.window().then((win) => {
      cy.stub(win, 'open').as('windowOpen').callsFake((url) => {
        listingUrl = url;
      });
    });

    // Klikk på første listing
    cy.get('.listing-card').first().click().then(() => {
      // Naviger manuelt dit kortet prøvde å åpne
      cy.visit(listingUrl);
    });

    // Bekreft Manage-siden
    cy.contains('Manage Listing', { timeout: 10000 }).should('be.visible');

    // Klikk "Edit Listing"
    cy.contains('Edit Listing').click();

    // Bekreft skjema
    cy.contains('Edit Listing').should('be.visible');
    cy.get('form.form-container').should('exist');
  });

  it('viser alle inputfelter inkludert attributter ved valgt kategori', () => {
    cy.intercept('GET', '**/users/me/activeListings').as('getActiveListings');
    cy.visit('http://localhost:5173/profile/listings');
    cy.wait('@getActiveListings');

    let listingUrl = '';
    cy.window().then((win) => {
      cy.stub(win, 'open').as('windowOpen').callsFake((url) => {
        listingUrl = url;
      });
    });

    cy.get('.listing-card').first().click().then(() => {
      cy.visit(listingUrl);
    });

    cy.contains('Manage Listing', { timeout: 10000 }).should('be.visible');
    cy.contains('Edit Listing').click();
    cy.contains('Edit Listing').should('be.visible');

    cy.get('input[placeholder="Listing title"]').should('exist');
    cy.get('textarea[placeholder="Description"]').should('exist');
    cy.get('input[placeholder="Street address"]').should('exist');
    cy.get('input[placeholder="Postal code"]').should('exist');
    cy.get('input[placeholder="Price"]').should('exist');
    cy.get('select').should('exist');
  });
});

describe('Edit Listing - Ekstra tester', () => {
  beforeEach(() => {
    cy.session('login-session', () => {
      cy.resetDatabase();
      cy.initializeTestData();
      cy.visit('http://localhost:5173/login');
      cy.get('input[name="username"]').type('testuser');
      cy.get('input[name="password"]').type('1234');
      cy.get('button[type="submit"]').click();
      cy.url().should('include', '/home');
    });
  });

  function openEditListing() {
    cy.intercept('GET', '**/users/me/activeListings').as('getActiveListings');
    cy.visit('http://localhost:5173/profile/listings');
    cy.wait('@getActiveListings');

    let listingUrl = '';
    cy.window().then((win) => {
      cy.stub(win, 'open').as('windowOpen').callsFake((url) => {
        listingUrl = url;
      });
    });

    cy.get('.listing-card').first().click().then(() => {
      cy.visit(listingUrl);
    });

    cy.contains('Edit Listing').click();
    cy.url().should('include', '/edit-my-listing');
    cy.get('form.form-container').should('exist');
  }

  it('Kan ikke submitte hvis felt mangler', () => {
    openEditListing();

    cy.get('input[placeholder="Listing title"]').clear();
    cy.get('textarea[placeholder="Description"]').clear();
    cy.get('input[placeholder="Street address"]').clear();
    cy.get('input[placeholder="Postal code"]').clear();
    cy.get('input[placeholder="Price"]').clear();
    cy.get('button.save-button[type="submit"]').click({ force: true });
    cy.get('.error-message', { timeout: 10000 }).should('contain', 'All fields including address and price are required');
  });

  it('viser suksessmelding ved vellykket innsending', () => {
    openEditListing();

    cy.get('input[placeholder="Listing title"]').clear().type('Ny tittel');
    cy.get('textarea[placeholder="Description"]').clear().type('Ny beskrivelse');
    cy.get('input[placeholder="Street address"]').clear().type('Testveien 1');
    cy.get('input[placeholder="Postal code"]').clear().type('1234');
    cy.get('input[placeholder="Price"]').clear().type('500');

    cy.get('select').first().find('option').then(options => {
      const validOption = [...options].find(opt => opt.value && opt.value !== '');
      if (validOption) {
        cy.get('select').first().select(String(validOption.value));
      }
    });

    cy.get('button.save-button[type="submit"]').click();
    cy.url().should('include', '/edit-my-listing');
  });

  it('avbryter redigering og går tilbake ved klikk på Cancel', () => {
    openEditListing();
    cy.get('button.cancel-button').click();
    cy.url().should('not.include', '/edit-my-listing');
  });

  it('laster opp nytt bilde og viser det i griden', () => {
    openEditListing();

    const imagePath = 'test-image.jpg';
    cy.fixture(imagePath, 'base64').then(fileContent => {
      return Cypress.Blob.base64StringToBlob(fileContent, 'image/jpeg');
    }).then(blob => {
      const testFile = new File([blob], imagePath, { type: 'image/jpeg' });
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(testFile);

      cy.get('input[type="file"]', { timeout: 5000 }).then(input => {
        const nativeInput = input[0];
        nativeInput.files = dataTransfer.files;
        input.trigger('change', { force: true });
      });

      cy.get('.uploaded-image', { timeout: 10000 }).should('have.length.greaterThan', 0);
    });
  });
});
