module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '../../',
  moduleNameMapper: {
    '^server/src/lib/prisma$': '<rootDir>/../__mocks__/prisma.js',
    '^@/(.*)$': '<rootDir>/src/$1',
    '../../gcloud-key.json': '<rootDir>/../config/jest/dummy-gcloud-key.json',
  },
  testMatch: ['<rootDir>/server/src/__tests__/**/*.test.ts'],
  setupFilesAfterEnv: ['<rootDir>/config/jest/jest.setup.server.ts', '<rootDir>/server/jest.setup.ts'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/../config/tsconfig/tsconfig.node.json'
    }
  }
};
