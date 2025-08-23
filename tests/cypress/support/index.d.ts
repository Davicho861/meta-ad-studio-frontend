/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject = unknown> {
    mockApi(url: string, response: unknown): Chainable<null>;
    login(): Chainable<void>;
    waitUntil(
      condition: () => Chainable<boolean>,
      options?: {
        timeout?: number;
        interval?: number;
        errorMsg?: string;
      }
    ): Chainable<void>;
  }
}
