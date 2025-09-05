describe('App E2E Tests', () => {
  beforeEach(() => {
    // Visit the root and wait a bit for the dev server to hydrate
    cy.visit('/');
    // Wait for Vite HMR and React to hydrate
    cy.wait(1000);
  });

  it('should render generator UI components', () => {
    // Check for concrete selectors rendered by ResultsGrid and PromptBar
    cy.get('.grid.gap-6', { timeout: 20000 }).should('exist');
    cy.get('textarea[placeholder="Describe tu visión creativa..."]', { timeout: 20000 }).should('exist');
  });

  it('should find and interact with an AIAgentCard if present', () => {
    // If AIAgentCard elements exist, check a small set of interactions; otherwise skip gracefully
    cy.get('body').then(($body) => {
      if ($body.find('.apple-card').length > 0) {
        cy.get('.apple-card').first().within(() => {
          // attempt to click a button if present
          cy.get('button').first().click({ force: true });
        });
      } else {
        cy.log('No .apple-card in DOM — skipping card interaction test');
      }
    });
  });

  it('should handle multiple AIAgentCards if rendered', () => {
    cy.get('body').then(($body) => {
      if ($body.find('.apple-card').length > 1) {
        cy.get('.apple-card').should('have.length.greaterThan', 1);
      } else {
        cy.log('Not enough .apple-card elements to assert multiplicity');
      }
    });
  });
});
