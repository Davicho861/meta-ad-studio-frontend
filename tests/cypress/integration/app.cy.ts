describe('App E2E Tests', () => {
  beforeEach(() => {
    // For simplicity, we'll visit the root page before each test.
    // In a real-world scenario, you might want to handle authentication here.
    cy.visit('/');
  });

  it('should display the main dashboard title', () => {
    cy.contains('h1', 'Visión General').should('be.visible');
  });

  it('should find and interact with an AIAgentCard', () => {
    // Check for the presence of the AIAgentCard by looking for a known element, e.g., its name.
    // We will use "Research" as it is present in the hardcoded data.
    cy.contains('h3', 'Research').should('be.visible');

    // Find the card and perform actions within its scope
    cy.contains('.apple-card', 'Research').within(() => {
      // Check status
      cy.contains('.text-xs', 'Activo').should('be.visible');

      // Click the details button and check for the toast notification
      cy.get('button').first().click(); // Using first() as there is no text
      cy.contains('Detalles del agente: Research').should('be.visible');

      // Click the pause/play button
      cy.get('button').find('svg[lucide="pause"]').click();
      cy.contains('.text-xs', 'Pausado').should('be.visible');

      // Click it again to resume
      cy.get('button').find('svg[lucide="play"]').click();
      cy.contains('.text-xs', 'Activo').should('be.visible');
    });
  });

  it('should handle multiple AIAgentCards', () => {
    // Verify that multiple agent cards are rendered if expected
    cy.get('.apple-card').should('have.length.greaterThan', 1);
  });
});
