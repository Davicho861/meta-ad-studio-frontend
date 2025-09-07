describe('Roadmap Page', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/roadmap');
  });

  it('should display the roadmap view', () => {
    cy.get('h2').contains('Roadmap').should('be.visible');
    // Add assertions to verify the timeline or Gantt chart is rendered
  });
});
