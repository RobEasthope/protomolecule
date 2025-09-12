import * as matchers from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/react";

expect.extend(matchers);

// Cleanup after each test to ensure proper isolation
afterEach(() => {
  cleanup();
});
