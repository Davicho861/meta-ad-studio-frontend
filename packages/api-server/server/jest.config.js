module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts', '<rootDir>/singleton.ts'],
  moduleNameMapper: {
    '^gcloud-key\\.json$': '<rootDir>/__mocks__/gcloud-key.json',
    '^\\.\\./gcloud-key\\.json$': '<rootDir>/__mocks__/gcloud-key.json',
    '\\.json$': '<rootDir>/__mocks__/fileMock.js'
  },
  moduleDirectories: ['node_modules', '<rootDir>'],
};
