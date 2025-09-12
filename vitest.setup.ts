// eslint-disable-next-line import/no-unassigned-import
import "@testing-library/jest-dom";

// Mock IntersectionObserver if needed for components
// @ts-expect-error - global type definitions
global.IntersectionObserver = class IntersectionObserver {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor() {}

  disconnect() {}

  observe() {}

  takeRecords() {
    return [];
  }

  unobserve() {}
};

// Mock window.matchMedia for responsive components
if (typeof window !== "undefined") {
  Object.defineProperty(window, "matchMedia", {
    value: vi.fn().mockImplementation((query) => ({
      addEventListener: vi.fn(),
      addListener: vi.fn(),
      dispatchEvent: vi.fn(),
      matches: false,
      media: query,
      onchange: null,
      removeEventListener: vi.fn(),
      removeListener: vi.fn(),
    })),
    writable: true,
  });
}

// Clean up after each test
afterEach(() => {
  vi.clearAllMocks();
});
