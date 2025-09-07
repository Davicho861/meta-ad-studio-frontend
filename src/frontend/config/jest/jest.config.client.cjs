module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  rootDir: '../../',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^components/(.*)$': '<rootDir>/src/components/$1',
    '^hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^lib/(.*)$': '<rootDir>/src/lib/$1',
    '^server/src/lib/prisma$': '<rootDir>/__mocks__/prisma.ts'
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.ts?(x)',
    '<rootDir>/src/**/?(*.)+(spec|test).ts?(x)'
  ],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  transformIgnorePatterns: [
    '/node_modules/(?!(@remix-run/router|react-router|react-router-dom)/)'
  ],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/config/tsconfig/tsconfig.app.json'
    }
  }
};
