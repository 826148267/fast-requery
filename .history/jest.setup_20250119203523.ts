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

  namespace NodeJS {
    interface Global {
      chrome: {
        tabs: Chrome.Tabs;
        storage: Chrome.Storage;
      };
    }
  }
}

// Mock chrome API with type assertions
global.chrome = {
  tabs: {
    query: jest.fn().mockImplementation((queryInfo: Chrome.QueryInfo) => 
      Promise.resolve<Chrome.Tab[]>([])
    ),
    update: jest.fn().mockImplementation((tabId: number | undefined, props: Chrome.UpdateProperties) => 
      Promise.resolve<Chrome.Tab>({})
    )
  },
  storage: {
    sync: {
      get: jest.fn().mockImplementation((keys: string | string[] | null) => 
        Promise.resolve<{ [key: string]: unknown }>({})
      ),
      set: jest.fn().mockImplementation((items: { [key: string]: unknown }) => 
        Promise.resolve()
      )
    }
  }
} as unknown as typeof chrome;
