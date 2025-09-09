const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      const fs = require('fs')
      const path = require('path')
      on('task', {
        saveAxeReport({ filename = 'axe-report.json', report }) {
          try {
            const outDir = path.resolve(process.cwd(), 'tests/e2e/cypress/results')
            fs.mkdirSync(outDir, { recursive: true })
            const outPath = path.join(outDir, filename)
            fs.writeFileSync(outPath, JSON.stringify(report, null, 2))
            return null
          } catch (err) {
            console.error('Failed to write axe report', err)
            return null
          }
        }
      })
      return config
    },
  supportFile: 'tests/cypress/support/e2e.js',
  baseUrl: 'http://localhost:5173/', // Adjust if your app runs on a different port
  specPattern: 'tests/cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
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
