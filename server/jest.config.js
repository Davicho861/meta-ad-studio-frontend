/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  globals: {
    TextEncoder: require('util').TextEncoder,
  },
  preset: 'ts-jest',
  testEnvironment: 'node',
};
