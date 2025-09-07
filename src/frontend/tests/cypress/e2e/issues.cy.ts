describe('Issues Page', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/issues');
  });

  it('should display the issues table', () => {
    cy.get('table').should('be.visible');
    cy.contains('th', 'Title').should('be.visible');
    cy.contains('th', 'Status').should('be.visible');
    cy.contains('th', 'Assignee').should('be.visible');
  });

  it('should allow searching for issues', () => {
    cy.get('input[placeholder="Search issues..."]').should('be.visible').type('bug');
  });

  it('should allow filtering by "Assigned to me"', () => {
    cy.contains('Assigned to me').click();
    // Add assertion to verify filtering
  });

  it('should allow filtering by "My team\'s work"', () => {
    cy.contains("My team's work").click();
    // Add assertion to verify filtering
  });

  it('should allow filtering by "Due this week"', () => {
    cy.contains('Due this week').click();
    // Add assertion to verify filtering
  });
});
