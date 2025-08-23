describe('Image to Video Conversion', () => {
  it('should convert an image to video on click and display the result', () => {
    cy.visit('/');

    // Select the first gallery card and click it
    cy.get('[data-cy="gallery-card"]').first().as('firstGalleryCard');
    cy.get('@firstGalleryCard').click();

    // Verify loading spinner is visible within the card
    cy.get('@firstGalleryCard').find('svg[data-lucide="loader2"]').should('be.visible');

    // Verify video appears and loading spinner is gone
    cy.get('@firstGalleryCard').find('video').should('be.visible');
    cy.get('@firstGalleryCard').find('svg[data-lucide="loader2"]').should('not.exist');

    // (Optional) Verify the src attribute of the video tag
    cy.get('@firstGalleryCard').find('video').should('have.attr', 'src').and('include', '/videos/placeholder.mp4');
  });
});