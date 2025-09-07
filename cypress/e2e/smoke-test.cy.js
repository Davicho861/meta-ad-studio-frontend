// Cypress E2E smoke test for production UI verification
// Visit PRODUCTION_URL provided via CYPRESS_baseUrl or env var

describe('Smoke: Verificacion UI Produccion', () => {
  // Use baseUrl from CYPRESS_baseUrl or fallback to env var
  const base = Cypress.config('baseUrl') || Cypress.env('PRODUCTION_URL') || process.env.PRODUCTION_URL

  it('Carga la pagina principal y verifica elementos clave', () => {
    cy.visit(base)
    cy.title().should('eq', 'Meta-Ad Studio')

    // Prompt bar - attempt common selectors
    cy.get('input[placeholder*="prompt"], input[name*="prompt"], textarea[placeholder*="prompt"]').should('be.visible')

    // Canvas / output area - common selectors
    cy.get('#canvas, .canvas, .output, .preview, [data-testid="canvas"]').should('be.visible')

    // Take screenshot and save with deterministic filename
    cy.screenshot('verificacion-ui-produccion')
  })
})
