import '@testing-library/jest-dom';
import { jest } from '@jest/globals';

declare global {
  namespace Chrome {
    interface Tab {
      id?: number;
      url?: string;
    }

    interface QueryInfo {
      active?: boolean;
      currentWindow?: boolean;
    }

    interface UpdateProperties {
      url?: string;
    }

    interface Tabs {
      query: jest.Mock<Promise<Tab[]>, [QueryInfo]>;
      update: jest.Mock<Promise<Tab>, [number | undefined, UpdateProperties]>;
    }

    interface Storage {
      sync: {
        get: jest.Mock<Promise<{ [key: string]: unknown }>, [string | string[] | null]>;
        set: jest.Mock<Promise<void>, [{ [key: string]: unknown }]>;
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
