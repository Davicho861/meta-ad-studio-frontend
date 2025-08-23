module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/server/src/$1',
  },
  testMatch: ['<rootDir>/server/src/__tests__/**/*.ts?(x)', '<rootDir>/server/src/?(*.)+(spec|test).ts?(x)'],
};