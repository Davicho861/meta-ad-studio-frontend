const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    supportFile: 'tests/cypress/support/e2e.ts',
    baseUrl: 'http://localhost:5173/', // Adjust if your app runs on a different port
    specPattern: 'tests/cypress/integration/**/*.cy.{js,jsx,ts,tsx}',
    retries: {
      runMode: 2, // Retry failing tests twice in headless mode
      openMode: 0, // Do not retry in interactive mode
    },
    defaultCommandTimeout: 15000, // Increase default timeout to 15 seconds
    pageLoadTimeout: 60000, // Increase page load timeout to 60 seconds
  },
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite'
    }
  }
})
