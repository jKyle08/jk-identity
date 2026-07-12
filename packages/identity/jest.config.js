/** @type {import('jest').Config} */
module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: 'tests/.*\\.(spec|test)\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/index.ts',
  ],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@apxon-jk/identity-memory$': '<rootDir>/../../examples/memory/src/index.ts',
    '^@apxon-jk/identity$': '<rootDir>/src/index.ts',
    '^@apxon-jk/identity/(.*)$': '<rootDir>/src/$1',
  },
};
