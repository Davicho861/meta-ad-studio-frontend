describe('Projects Module', () => {
  beforeEach(() => {
    cy.visit('/projects'); // Assuming /projects is the correct route
    // Clear existing projects (replace with actual API call if needed)
    // cy.request('DELETE', '/api/projects');
  });

  it('should create a new project', () => {
    // Mock the API response
    cy.intercept('POST', '/api/projects', {
      statusCode: 201,
      body: {
        message: 'Project created successfully',
        project: {
          id: '123',
          name: 'Test Project',
          description: 'This is a test project description.',
          lead: 'John Doe',
        },
      },
    }).as('createProject');

    // Use data-testid attributes for more robust selectors
    cy.get('[data-testid="create-project-button"]').click();

    // Fill out the form
    cy.get('[data-testid="project-name-input"]').type('Test Project');
    cy.get('[data-testid="project-description-input"]').type('This is a test project description.');
    // Assuming there's a select for the project lead
    cy.get('[data-testid="project-lead-select"]').select('John Doe'); // Replace with a valid option

    // Submit the form
    cy.get('[data-testid="submit-project-button"]').click();

    // Assert that the project was created successfully
    cy.wait('@createProject').then((interception) => {
      expect(interception.response).to.not.be.undefined;
      expect(interception.response?.statusCode).to.equal(201);
    });
    cy.contains('Test Project').should('be.visible'); // Check if the project name is displayed
    cy.contains('This is a test project description.').should('be.visible'); // Check if the project description is displayed
  });

  it('should display the projects list', () => {
    cy.get('[data-testid="project-list"]').should('be.visible');
    cy.get('[data-testid="project-item"]').should('have.length.greaterThan', 0); // Assuming there are existing projects
  });
});