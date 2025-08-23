describe('Dashboard Navigation and Core UI', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/');
  });

  it('should display the main dashboard heading', () => {
    cy.get('h1').contains('Dashboard').should('be.visible');
  });

  it('should have navigation links for all modules', () => {
    cy.contains('Projects').should('be.visible');
    cy.contains('Dashboards').should('be.visible');
    cy.contains('Apps').should('be.visible');
    cy.contains('Kanban').should('be.visible');
    cy.contains('Backlog').should('be.visible');
    cy.contains('Issues').should('be.visible');
    cy.contains('Roadmap').should('be.visible');
    cy.contains('Reports').should('be.visible');
  });

  it('should navigate to the Projects page', () => {
    cy.contains('Projects').click();
    cy.url().should('include', '/projects');
    cy.get('h2').contains('Projects').should('be.visible');
  });

  it('should navigate to the Dashboards page', () => {
    cy.contains('Dashboards').click();
    cy.url().should('include', '/dashboards');
    cy.get('h2').contains('Dashboards').should('be.visible');
  });

  it('should navigate to the Apps page', () => {
    cy.contains('Apps').click();
    cy.url().should('include', '/apps');
    cy.get('h2').contains('Apps').should('be.visible');
  });

  it('should navigate to the Kanban board', () => {
    cy.contains('Kanban').click();
    cy.url().should('include', '/kanban');
    cy.get('h2').contains('Kanban Board').should('be.visible');
  });

  it('should navigate to the Issues page', () => {
    cy.contains('Issues').click();
    cy.url().should('include', '/issues');
    cy.get('h2').contains('Issues').should('be.visible');
  });

  it('should have a functional search bar', () => {
    cy.get('input[placeholder="Search..."]').should('be.visible').type('search query');
  });

  it('should display quick filters', () => {
    cy.contains("Assigned to me").should('be.visible');
    cy.contains("My team's work").should('be.visible');
    cy.contains("Due this week").should('be.visible');
  });

  it('should create a new project', () => {
    cy.contains('Projects').click();
    cy.url().should('include', '/projects');
    cy.get('button').contains('Add Project').click();
    cy.get('#projectName').type('Test Project');
    cy.get('#projectDescription').type('Test Description');
    cy.get('button').contains('Create').click();
    cy.contains('Test Project').should('be.visible');
  });
});

describe('Dashboard', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/');
  });

  it('displays IssuesByStatus correctly', () => {
    cy.get('[data-testid="issues-by-status"]').should('contain', 'Issues by Status');
    cy.get('[data-testid="issues-to-do"]').should('contain', '0');
    cy.get('[data-testid="issues-done"]').should('contain', '0');
  });

  it('displays the username after login', () => {
    cy.get('[data-testid="username"]').should('contain', 'testuser');
  });
});
