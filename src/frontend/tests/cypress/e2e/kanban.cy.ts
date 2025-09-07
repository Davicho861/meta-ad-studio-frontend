describe('Kanban Board', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/kanban');
  });

  it('should display tasks in columns', () => {
    cy.get('.kanban-column').should('have.length.at.least', 3);
    cy.contains('To Do').should('be.visible');
    cy.contains('In Progress').should('be.visible');
    cy.contains('Done').should('be.visible');
  });

  it('should allow dragging tasks between columns', () => {
    cy.get('[data-rbd-draggable-id]').first().drag('[data-rbd-droppable-id="inProgress"]');
    cy.waitUntil(() => {
      return cy.contains('In Progress').find('[data-rbd-draggable-id]').should('have.length.greaterThan', 0).then(($elements) => {
        return $elements.length > 0;
      });
    }, {
      timeout: 10000,
      interval: 500,
    });
  });

  it('should update task status via API', () => {
    cy.intercept('PUT', '/api/tasks/*', {
      statusCode: 200,
      body: { message: 'Task updated successfully' },
    }).as('updateTask');

    cy.get('[data-rbd-draggable-id]').first().drag('[data-rbd-droppable-id="inProgress"]');
    cy.wait('@updateTask').then((interception) => {
      if (interception.response) {
        expect(interception.response.statusCode).to.equal(200);
        expect(interception.response.body.message).to.equal('Task updated successfully');
      } else {
        throw new Error('Response is undefined');
      }
    });
  });
});
