# Release Scripts

TypeScript scripts for automating package versioning, releases, and GitHub release creation in this monorepo.

## Scripts Overview

| Script                | Purpose                                           | Input                    | Output                 |
| --------------------- | ------------------------------------------------- | ------------------------ | ---------------------- |
| `detect-published.ts` | Detects published packages from CHANGELOG changes | Git diff                 | JSON array of packages |
| `bump-monorepo.ts`    | Bumps monorepo version based on package changes   | Published packages JSON  | Git tag, version bump  |
| `create-releases.ts`  | Creates GitHub releases from changelogs           | Package info, repository | GitHub releases        |
| `generate-summary.ts` | Generates AI-powered release summaries            | Package info, bump type  | Release notes text     |

## Testing

### Running Tests

```bash
# Run all tests
pnpm test:scripts

# Run with coverage
pnpm test:scripts:coverage

# Watch mode (TDD)
pnpm test:scripts:watch
```

### Test Structure

Each script has a corresponding `.test.ts` file:

- `detect-published.test.ts` - 19 tests
- `create-releases.test.ts` - 23 tests
- `bump-monorepo.test.ts` - 20 tests
- `generate-summary.test.ts` - 28 tests

**Total: 90 tests** covering pure functions and business logic.

### Coverage

Coverage is focused on the `.github/scripts` directory only:

```bash
pnpm test:scripts:coverage
```

Reports are generated in `.github/scripts/coverage/` (excluded from git).

### Test Philosophy

Tests focus on **pure functions** extracted from each script:

1. **Separation of Concerns**: Logic separated from I/O operations
2. **Dependency Injection**: File system operations passed as parameters
3. **Import Guards**: Scripts don't execute on import (`import.meta.url` check)
4. **Fast Execution**: All 90 tests complete in <20ms

### Example Test Pattern

```typescript
// Script exports testable function
export function determineBumpType(
  currentVersion: SemverParts,
  prevVersion: SemverParts,
): BumpType {
  if (currentVersion.major > prevVersion.major) {
    return "major";
  }
  // ... logic
}

// Test file
import { describe, it, expect } from "vitest";
import { determineBumpType } from "./bump-monorepo";

describe("determineBumpType", () => {
  it("returns major for major version bump", () => {
    const current = { major: 2, minor: 0, patch: 0 };
    const prev = { major: 1, minor: 5, patch: 3 };

    const result = determineBumpType(current, prev);

    expect(result).toBe("major");
  });
});
```

## VS Code Debugging

A debug configuration is available for testing scripts. See `.vscode/launch.json`:

### Debug Single Test File

1. Open a test file (e.g., `bump-monorepo.test.ts`)
2. Press `F5` or use "Run > Start Debugging"
3. Select "Debug Current Test File"

### Debug All Tests

1. Press `F5`
2. Select "Debug All Scripts Tests"

### Breakpoints

- Set breakpoints in either test files or source scripts
- Use "Debug Console" to inspect variables
- Step through with `F10` (step over) or `F11` (step into)

## Development Workflow

### Test-Driven Development (TDD)

```bash
# Start watch mode
pnpm test:scripts:watch

# Edit test file to add failing test
# Edit source file to make test pass
# Refactor with confidence
```

### Adding New Scripts

1. Create script file (e.g., `new-script.ts`)
2. Add import execution guard:
   ```typescript
   if (import.meta.url === `file://${process.argv[1]}`) {
     main().catch((error) => {
       console.error("Error:", error);
       process.exit(1);
     });
   }
   ```
3. Extract pure functions with `export`
4. Create test file (`new-script.test.ts`)
5. Write tests for pure functions
6. Run tests: `pnpm test:scripts`

## Architecture

### Pure Functions vs I/O

```typescript
// ✅ Pure function - testable
export function calculateNewVersion(
  currentVersion: string,
  bumpType: BumpType,
): string {
  const { major, minor, patch } = parseSemver(currentVersion);
  switch (bumpType) {
    case "major":
      return `${major + 1}.0.0`;
    case "minor":
      return `${major}.${minor + 1}.0.0`;
    case "patch":
      return `${major}.${minor}.${patch + 1}`;
  }
}

// ❌ I/O operation - not directly tested (tested via integration)
function updatePackageJson(newVersion: string): void {
  const packageJson = JSON.parse(readFileSync("package.json", "utf8"));
  packageJson.version = newVersion;
  writeFileSync("package.json", JSON.stringify(packageJson, null, 2));
}
```

### Dependency Injection Pattern

```typescript
// Type alias for mockability
export type ReadFileFn = (path: string) => string;
export type FileExistsFn = (path: string) => boolean;

// Function accepts dependencies
export function parseChangelogs(
  changelogFiles: string[],
  readFile: ReadFileFn, // ← Injectable
  fileExists: FileExistsFn, // ← Injectable
): Package[] {
  // ... logic using readFile and fileExists
}

// Tests inject mocks
import { vi } from "vitest";

it("reads package.json", () => {
  const mockRead = vi.fn(() => '{"name": "test", "version": "1.0.0"}');
  const mockExists = vi.fn(() => true);

  const result = parseChangelogs(["CHANGELOG.md"], mockRead, mockExists);

  expect(mockRead).toHaveBeenCalledWith("package.json");
});
```

## Troubleshooting

### Tests Failing with "process.exit unexpectedly called"

**Cause**: Script executes on import instead of only when run directly.

**Fix**: Ensure import execution guard is present:

```typescript
if (import.meta.url === `file://${process.argv[1]}`) {
  // execution code here
}
```

### Coverage Including Wrong Files

**Cause**: Vitest config `root` or `include` patterns incorrect.

**Fix**: Check `vitest.config.ts`:

```typescript
export default defineConfig({
  root: resolve(__dirname), // Must be scripts directory
  test: {
    include: ["**/*.test.ts"],
    coverage: {
      include: ["*.ts"], // Relative to root
      exclude: ["*.test.ts", "vitest.config.ts"],
    },
  },
});
```

### Import Errors in Tests

**Cause**: Exported types/functions not available.

**Fix**: Ensure functions and types are exported:

```typescript
export function myFunction() {} // ← export keyword
export type MyType = {}; // ← export keyword
export interface MyInterface {} // ← export keyword
```

## ESLint Configuration

These scripts use a **separate ESLint configuration** (`.github/scripts/eslint.config.ts`) with rules appropriate for CI/CD automation:

### Why Separate Config?

1. **Console logging is essential** - Scripts output progress and errors to CI logs
2. **Abbreviated names are acceptable** - Common patterns like `pkg`, `dir`, `env` improve readability
3. **Different error handling** - Scripts may use `.then()` for clarity in error paths
4. **Test-friendly rules** - Allow `any` types and unused variables in test fixtures

### How It Works

- Root `eslint.config.ts` ignores `.github/scripts/` in the `ignores` array
- Scripts directory has its own `eslint.config.ts` with CI-appropriate rules
- Both configs work together without conflicts

### Linting Scripts

```bash
# Lint scripts with their specific config
cd .github/scripts
npx eslint .
```

## Error Handling

All scripts follow consistent error handling patterns:

### Exit Codes

- **0** - Success
- **1** - Error (parse failures, missing files, API errors, validation failures)

### Error Messages

Errors are written to `stderr` with structured format:

```typescript
console.error("❌ ERROR: Failed to parse CHANGELOG.md");
console.error("  File: packages/ui/CHANGELOG.md");
console.error("  Reason: Invalid markdown format");
process.exit(1);
```

### Error Context

Each error includes:

- ❌ Clear error indicator (emoji for visibility in CI logs)
- **Context** - Which file, operation, or step failed
- **Reason** - Why it failed
- **Action** - What to do next (when applicable)

### Graceful Degradation

Some scripts have fallback mechanisms:

- `generate-summary.ts` - Falls back to template if AI generation fails
- `create-releases.ts` - Skips releases that already exist
- `bump-monorepo.ts` - Validates version before committing

## CI/CD Integration

Tests run automatically in GitHub Actions on every pull request:

```yaml
# .github/workflows/test-release-scripts.yml
- name: Run unit tests
  run: pnpm test:scripts

- name: Check coverage
  run: pnpm test:scripts:coverage
```

Scripts are used in the release workflow:

```yaml
# .github/workflows/release.yml
- name: 📊 Detect Published Packages
  run: pnpm tsx .github/scripts/detect-published.ts

- name: 📝 Create Individual Package Releases
  run: pnpm tsx .github/scripts/create-releases.ts "${{ github.repository }}"
```

## Further Reading

- [Vitest Documentation](https://vitest.dev/)
- [Testing TypeScript](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
- [Dependency Injection in TypeScript](https://www.typescriptlang.org/docs/handbook/2/functions.html)
