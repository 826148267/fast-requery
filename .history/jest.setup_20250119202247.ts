import '@testing-library/jest-dom';
import { jest } from '@jest/globals';

declare global {
  let chrome: {
    tabs: {
      query: jest.Mock;
      update: jest.Mock;
    };
    storage: {
      sync: {
        get: jest.Mock;
        set: jest.Mock;
      };
    };
  };
}

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
};
