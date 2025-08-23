/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject = any> {
    mockApi(url: string, response: any): Chainable<null>;
    login(): Chainable<any>;
    waitUntil(
      condition: () => Chainable<boolean>,
      options?: {
        timeout?: number;
        interval?: number;
        errorMsg?: string;
      }
    ): Chainable<any>;
  }
}
