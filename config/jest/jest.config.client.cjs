module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  rootDir: '../../',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.ts?(x)',
    '<rootDir>/src/**/?(*.)+(spec|test).ts?(x)'
  ],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/config/tsconfig/tsconfig.app.json'
    }
  }
};