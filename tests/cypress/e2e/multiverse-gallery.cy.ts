describe('Multiverse Gallery E2E Tests', () => {
  beforeEach(() => {
    // Mocking the API response for the gallery
    cy.intercept('GET', '/api/multiverse/photos', {
      statusCode: 200,
      body: [
        { id: 'e2e-1', url: '/img/e2e-photo1.jpg', caption: 'E2E Photo 1' },
        { id: 'e2e-2', url: '/img/e2e-photo2.jpg', caption: 'E2E Photo 2' },
      ],
    }).as('getPhotos');

    // Assuming the gallery is accessible via a route like /gallery
    // If it's integrated into another dashboard, the navigation might be different.
    // For now, let's assume a direct route for testing purposes.
    cy.visit('/gallery'); // Adjust the route if necessary
  });

  it('should display the multiverse photo gallery', () => {
    cy.get('h2').contains('Multiverse Photo Gallery').should('be.visible');
  });

  it('should display photos fetched from the API', () => {
    cy.wait('@getPhotos');
    cy.get('.photo-item').should('have.length', 2);
    cy.get('.photo-item').eq(0).find('img').should('have.attr', 'src', '/img/e2e-photo1.jpg');
    cy.get('.photo-item').eq(0).find('p').should('contain', 'E2E Photo 1');
    cy.get('.photo-item').eq(1).find('img').should('have.attr', 'src', '/img/e2e-photo2.jpg');
    cy.get('.photo-item').eq(1).find('p').should('contain', 'E2E Photo 2');
  });

  it('should display a message when no photos are found', () => {
    cy.intercept('GET', '/api/multiverse/photos', {
      statusCode: 200,
      body: [],
    }).as('getPhotosEmpty');
    cy.visit('/gallery'); // Re-visit to trigger the empty state
    cy.wait('@getPhotosEmpty');
    cy.contains('No photos found in the gallery.').should('be.visible');
  });

  it('should display an error message if fetching photos fails', () => {
    cy.intercept('GET', '/api/multiverse/photos', {
      statusCode: 500,
      body: { message: 'Internal Server Error' },
    }).as('getPhotosError');
    cy.visit('/gallery'); // Re-visit to trigger the error state
    cy.wait('@getPhotosError');
    cy.contains('Error loading gallery: Internal Server Error').should('be.visible');
  });
});
