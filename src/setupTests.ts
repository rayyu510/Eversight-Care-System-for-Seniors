import '@testing-library/jest-dom';

// Mock crypto for Node.js environment
const mockCrypto = {
    subtle: {
        generateKey: jest.fn().mockResolvedValue({}),
        encrypt: jest.fn().mockResolvedValue(new ArrayBuffer(0)),
        decrypt: jest.fn().mockResolvedValue(new ArrayBuffer(0)),
        digest: jest.fn().mockResolvedValue(new ArrayBuffer(0))
    },
    getRandomValues: jest.fn((arr: Uint8Array) => {
        for (let i = 0; i < arr.length; i++) {
            arr[i] = Math.floor(Math.random() * 256);
        }
        return arr;
    })
};

Object.defineProperty(global, 'crypto', {
    value: mockCrypto
});

// Mock localStorage
const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
    length: 0,
    key: jest.fn()
};

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
});

// Mock sessionStorage
const sessionStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
    length: 0,
    key: jest.fn()
};

Object.defineProperty(window, 'sessionStorage', {
    value: sessionStorageMock
});

// Mock fetch
global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: jest.fn().mockResolvedValue({}),
    text: jest.fn().mockResolvedValue(''),
    status: 200
});

// Reset all mocks before each test
beforeEach(() => {
    jest.clearAllMocks();
});

// Simple test to verify setup
describe('Test Setup', () => {
    test('should have working test environment', () => {
        expect(true).toBe(true);
    });
});