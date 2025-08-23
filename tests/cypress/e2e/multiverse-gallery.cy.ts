describe('Multiverse Gallery E2E Tests', () => {
  beforeEach(() => {
    // Mocking the API response for the gallery
    cy.intercept('GET', '/api/multiverse/videos', {
      statusCode: 200,
      body: [
        { id: 'e2e-1', url: '/vid/e2e-video1.mp4', caption: 'E2E Video 1' },
        { id: 'e2e-2', url: '/vid/e2e-video2.mp4', caption: 'E2E Video 2' },
      ],
    }).as('getVideos');

    cy.visit('/');
  });

  it('should display the multiverse video gallery', () => {
    cy.get('h2').contains('Multiverse Video Gallery').should('be.visible');
  });

  it('should display videos fetched from the API', () => {
    cy.wait('@getVideos');
    cy.get('.video-item').should('have.length', 2);
    cy.get('.video-item').eq(0).find('video').should('have.attr', 'src', '/vid/e2e-video1.mp4');
    cy.get('.video-item').eq(0).find('p').should('contain', 'E2E Video 1');
    cy.get('.video-item').eq(1).find('video').should('have.attr', 'src', '/vid/e2e-video2.mp4');
    cy.get('.video-item').eq(1).find('p').should('contain', 'E2E Video 2');
  });

  it('should display a message when no videos are found', () => {
    cy.intercept('GET', '/api/multiverse/videos', {
      statusCode: 200,
      body: [],
    }).as('getVideosEmpty');
    cy.visit('/'); // Re-visit to trigger the empty state
    cy.wait('@getVideosEmpty');
    cy.contains('No videos found in the gallery.').should('be.visible');
  });

  it('should display an error message if fetching videos fails', () => {
    cy.intercept('GET', '/api/multiverse/videos', {
      statusCode: 500,
      body: { message: 'Internal Server Error' },
    }).as('getVideosError');
    cy.visit('/'); // Re-visit to trigger the error state
    cy.wait('@getVideosError');
    cy.contains('Error loading gallery: Internal Server Error').should('be.visible');
  });
});
