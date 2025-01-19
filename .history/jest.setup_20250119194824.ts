import '@testing-library/jest-dom';

// Mock chrome API
global.chrome = {
  tabs: {
    query: jest.fn(),
    update: jest.fn()
  },
  storage: {
    sync: {
      get: jest.fn(),
      set: jest.fn()
    }
  }
} as unknown as typeof chrome;
