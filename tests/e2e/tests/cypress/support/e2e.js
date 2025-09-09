// Support file for Cypress E2E tests — accessibility helpers (JS version)
require('cypress-axe')

Cypress.Commands.add('checkA11yFailOnHigh', (context) => {
  // inject axe into the page
  cy.injectAxe()
  cy.checkA11y(context, null, (violations) => {
    // send whole report to task so CI can save a structured file
    cy.task('saveAxeReport', { filename: `axe-report-${Date.now()}.json`, report: { url: Cypress.config('baseUrl'), violations } }, { log: false })
    const high = violations.filter(v => v.impact === 'serious' || v.impact === 'critical')
    if (high.length > 0) {
      const lines = high.map(v => `${v.id} [${v.impact}] - ${v.nodes.length} nodes`).join('\n')
      throw new Error(`Accessibility violations (serious/critical):\n${lines}`)
    }
  })
})
