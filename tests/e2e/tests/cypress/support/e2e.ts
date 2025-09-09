// Support file for Cypress E2E tests — accessibility helpers
import 'cypress-axe'

Cypress.Commands.add('checkA11yFailOnHigh', (context = undefined) => {
  // inject axe into the page
  cy.injectAxe()
  cy.checkA11y(context, null, (violations) => {
    const high = violations.filter(v => v.impact === 'serious' || v.impact === 'critical')
    if (high.length > 0) {
      // Format a readable error and fail the test
      const lines = high.map(v => `${v.id} [${v.impact}] - ${v.nodes.length} nodes`).join('\n')
      throw new Error(`Accessibility violations (serious/critical):\n${lines}`)
    }
  })
})
