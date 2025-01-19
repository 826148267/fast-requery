import '@testing-library/jest-dom';
import type { Tab, UpdateProperties } from '@types/chrome';
import { jest } from '@jest/globals';

declare global {
  namespace Chrome {
    interface Tabs {
      query: jest.Mock;
      update: jest.Mock;
    }
    interface Storage {
      sync: {
        get: jest.Mock;
        set: jest.Mock;
      };
    }
  }

  var chrome: {
    tabs: Chrome.Tabs;
    storage: Chrome.Storage;
  };
}

// Mock chrome API
global.chrome = {
  tabs: {
    query: jest.fn().mockImplementation(() => Promise.resolve([])),
    update: jest.fn().mockImplementation(() => Promise.resolve({}))
  },
  storage: {
    sync: {
      get: jest.fn().mockImplementation(() => Promise.resolve({})),
      set: jest.fn().mockImplementation(() => Promise.resolve())
    }
  }
} as unknown as typeof chrome;
