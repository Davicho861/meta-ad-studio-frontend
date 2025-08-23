Cypress.Commands.add('mockApi', (url: string, response: any) => {
  cy.intercept(url, response).as('mockedApi');
});

Cypress.Commands.add('login', () => {
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
  });
});

// Example usage:
// cy.mockApi('/api/projects', { fixture: 'projects.json' });

//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
