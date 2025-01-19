import '@testing-library/jest-dom';
import { jest } from '@jest/globals';

// 使用接口替代命名空间
interface ChromeTab {
  id?: number;
  url?: string;
}

interface ChromeQueryInfo {
  active?: boolean;
  currentWindow?: boolean;
}

interface ChromeUpdateProperties {
  url?: string;
}

interface ChromeTabs {
  query: jest.Mock;
  update: jest.Mock;
}

interface ChromeStorage {
  sync: {
    get: jest.Mock;
    set: jest.Mock;
  };
}

interface ChromeAPI {
  tabs: ChromeTabs;
  storage: ChromeStorage;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      chrome: ChromeAPI;
    }
  }
}

global.chrome = {
  tabs: {
    query: jest.fn(() => Promise.resolve([])),
    update: jest.fn(() => Promise.resolve({}))
  },
  storage: {
    sync: {
      get: jest.fn(() => Promise.resolve({})),
      set: jest.fn(() => Promise.resolve())
    }
  }
} as unknown as typeof chrome;
