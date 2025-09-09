PA11Y / Accessibility runtime checks
===================================

This project can be audited with pa11y (headless browser required). In CI or local environments without network access, Puppeteer may fail to download browsers.

Quick steps to run pa11y locally:

1. Ensure a headless Chromium is available on the system or allow Puppeteer to download one.

   - To let Puppeteer download browsers (requires network):

     ```bash
     cd meta-ad-studio
     npm install --no-audit --no-fund pa11y --save-dev
     npx pa11y http://localhost:3000/
     ```

   - To skip automatic download and rely on a system browser, set the environment variable:

     ```bash
     export PUPPETEER_SKIP_DOWNLOAD=true
     export PUPPETEER_EXECUTABLE_PATH=/path/to/chrome-or-chromium
     npm install --no-audit --no-fund pa11y --save-dev
     npx pa11y http://localhost:3000/
     ```

Notes
-----
- If `puppeteer` download fails (ETIMEDOUT) you can either provide a local Chrome/Chromium binary via `PUPPETEER_EXECUTABLE_PATH` or run scans inside a container/image that already includes headless Chrome.
- We also provide static checks via `eslint-plugin-jsx-a11y` (already configured). Run:

```bash
cd meta-ad-studio
npx eslint --config eslint.config.cjs --ext .js,.jsx src --rule "jsx-a11y/alt-text:warn"
```

If you need help setting up an environment for runtime audits, ask and I'll provide a Docker image or docker-compose snippet.
