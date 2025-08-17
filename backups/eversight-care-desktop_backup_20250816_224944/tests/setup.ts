/// <reference types="jest" />
/// <reference types="node" />

// Import Jest DOM matchers
import '@testing-library/jest-dom';

// Declare Jest globals for TypeScript
declare global {
    var describe: jest.Describe;
    var it: jest.It;
    var test: jest.It;
    var beforeAll: jest.Lifecycle;
    var afterAll: jest.Lifecycle;
    var beforeEach: jest.Lifecycle;
    var afterEach: jest.Lifecycle;
    // Removed global jest declaration as it's not needed and causes type errors
}

// Set test environment
process.env.NODE_ENV = 'test';

// Global test setup
beforeAll(() => {
    console.log('🧪 Test environment initialized');
});