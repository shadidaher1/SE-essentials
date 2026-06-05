import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',                    // Specifies that we are using ts-jest for TypeScript
  testEnvironment: 'node',              // Specifies the test environment (e.g., jsdom or node)
  roots: ['<rootDir>'],                 // Specifies the root directory for Jest to look for test files
  testMatch: ['<rootDir>/tests/**/*.ts', '<rootDir>/src/tests/**/*.ts'],
  testPathIgnorePatterns:["/node_modules/", "<rootDir>/tests/app.test.ts"], 
  verbose: true,                        // Enables verbose output during testing
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'], // Specifies the files to collect coverage from
  collectCoverage: true,                // Enables code coverage collection
  coverageDirectory: 'coverage',        // Specifies the directory to output coverage files
  // Regression-guard floor reflecting current coverage with the DB-integration
  // tests skipped (the CI scenario, where no Postgres is available). Raise these
  // as more unit tests are added.
  coverageThreshold: {
    global: {
      functions: 22,
      statements: 25
    }
  }
};
export default config;