describe('Backlog Page', () => {
  beforeEach(() => {
    cy.request({
      method: 'POST',
      url: '/api/auth/login',
      body: { username: 'testuser', password: 'testpass' },
      failOnStatusCode: false,
    }).then((response) => {
      console.log('Login Response status:', response.status);
      console.log('Login Response body:', response.body);
      if (response.body && response.body.token) {
        window.localStorage.setItem('jwt_token', response.body.token);
        console.log('JWT token set in localStorage:', response.body.token);
      } else {
        console.error('JWT token not found in response body');
      }
      cy.visit('/backlog');
    });
  });

  it('should display the backlog list', () => {
    cy.get('h2').contains('Backlog').should('be.visible');
    cy.get('.backlog-item').should('have.length.greaterThan', 0);
  });

  it('should allow sorting and filtering', () => {
    // Add tests for sorting and filtering
  });
});
