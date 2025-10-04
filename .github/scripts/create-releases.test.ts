import { describe, it, expect, vi } from 'vitest';
import {
  getChangelogPaths,
  findChangelogPath,
  extractChangelogContent,
  SEMVER_REGEX,
  PACKAGE_NAME_REGEX,
  type FileExistsFn
} from './create-releases';

describe('getChangelogPaths', () => {
  it('returns infrastructure path for infrastructure package', () => {
    const result = getChangelogPaths('@robeasthope/infrastructure');

    expect(result).toEqual(['infrastructure/CHANGELOG.md']);
  });

  it('returns apps and packages paths for regular package', () => {
    const result = getChangelogPaths('@robeasthope/markdown');

    expect(result).toEqual([
      'apps/markdown/CHANGELOG.md',
      'packages/markdown/CHANGELOG.md'
    ]);
  });

  it('handles package with hyphens', () => {
    const result = getChangelogPaths('@robeasthope/my-package');

    expect(result).toEqual([
      'apps/my-package/CHANGELOG.md',
      'packages/my-package/CHANGELOG.md'
    ]);
  });
});

describe('findChangelogPath', () => {
  it('returns first existing path', () => {
    const mockExists: FileExistsFn = vi.fn((path: string) =>
      path === 'apps/markdown/CHANGELOG.md'
    );

    const result = findChangelogPath('@robeasthope/markdown', mockExists);

    expect(result).toBe('apps/markdown/CHANGELOG.md');
    expect(mockExists).toHaveBeenCalledWith('apps/markdown/CHANGELOG.md');
  });

  it('returns second path if first does not exist', () => {
    const mockExists: FileExistsFn = vi.fn((path: string) =>
      path === 'packages/ui/CHANGELOG.md'
    );

    const result = findChangelogPath('@robeasthope/ui', mockExists);

    expect(result).toBe('packages/ui/CHANGELOG.md');
    expect(mockExists).toHaveBeenCalledTimes(2);
  });

  it('returns null if no paths exist', () => {
    const mockExists: FileExistsFn = vi.fn(() => false);

    const result = findChangelogPath('@robeasthope/nonexistent', mockExists);

    expect(result).toBeNull();
  });

  it('handles infrastructure package', () => {
    const mockExists: FileExistsFn = vi.fn(() => true);

    const result = findChangelogPath('@robeasthope/infrastructure', mockExists);

    expect(result).toBe('infrastructure/CHANGELOG.md');
    expect(mockExists).toHaveBeenCalledWith('infrastructure/CHANGELOG.md');
  });
});

describe('extractChangelogContent', () => {
  it('extracts content for specific version', () => {
    const content = `## 1.2.0

- Feature A
- Feature B

## 1.1.0

- Old feature`;

    const result = extractChangelogContent(content, '1.2.0');

    expect(result).toBe('- Feature A\n- Feature B');
  });

  it('extracts last version (no next header)', () => {
    const content = `## 2.0.0

- Breaking change

## 1.0.0

- Initial release`;

    const result = extractChangelogContent(content, '1.0.0');

    expect(result).toBe('- Initial release');
  });

  it('returns empty string for missing version', () => {
    const content = `## 1.0.0

- Initial release`;

    const result = extractChangelogContent(content, '2.0.0');

    expect(result).toBe('');
  });

  it('handles pre-release versions', () => {
    const content = `## 1.0.0-beta.1

- Beta features

## 1.0.0-alpha.1

- Alpha features`;

    const result = extractChangelogContent(content, '1.0.0-beta.1');

    expect(result).toBe('- Beta features');
  });

  it('handles versions with special regex characters', () => {
    const content = `## 1.0.0+build.123

- Build metadata

## 1.0.0

- Release`;

    const result = extractChangelogContent(content, '1.0.0+build.123');

    expect(result).toBe('- Build metadata');
  });

  it('trims whitespace from extracted content', () => {
    const content = `## 1.0.0


- Feature with extra whitespace


## 0.9.0`;

    const result = extractChangelogContent(content, '1.0.0');

    expect(result).toBe('- Feature with extra whitespace');
  });

  it('handles empty changelog section', () => {
    const content = `## 1.0.0

## 0.9.0

- Previous version`;

    const result = extractChangelogContent(content, '1.0.0');

    expect(result).toBe('');
  });

  it('handles multiline changelog entries', () => {
    const content = `## 2.1.0

### Major Changes

- Feature 1
  - Sub-feature A
  - Sub-feature B

### Minor Changes

- Feature 2

## 2.0.0`;

    const result = extractChangelogContent(content, '2.1.0');

    expect(result).toContain('### Major Changes');
    expect(result).toContain('Feature 1');
    expect(result).toContain('Sub-feature A');
    expect(result).toContain('### Minor Changes');
  });

  it('stops at next semver header and ignores other headers', () => {
    const content = `## 1.2.0

- Feature A
- Feature B

## Unreleased

- Work in progress

## 1.1.0

- Old feature`;

    const result = extractChangelogContent(content, '1.2.0');

    // Should include "Unreleased" section since it's not a semver header
    expect(result).toContain('- Feature A');
    expect(result).toContain('- Feature B');
    expect(result).toContain('## Unreleased');
    expect(result).toContain('- Work in progress');
    // Should stop at the next semver header (1.1.0)
    expect(result).not.toContain('## 1.1.0');
    expect(result).not.toContain('- Old feature');
  });
});

describe('SEMVER_REGEX', () => {
  it('matches standard semver', () => {
    expect(SEMVER_REGEX.test('1.0.0')).toBe(true);
    expect(SEMVER_REGEX.test('10.20.30')).toBe(true);
  });

  it('matches pre-release versions', () => {
    expect(SEMVER_REGEX.test('1.0.0-alpha')).toBe(true);
    expect(SEMVER_REGEX.test('1.0.0-beta.1')).toBe(true);
    expect(SEMVER_REGEX.test('1.0.0-rc.2')).toBe(true);
  });

  it('matches build metadata', () => {
    expect(SEMVER_REGEX.test('1.0.0+build')).toBe(true);
    expect(SEMVER_REGEX.test('1.0.0+20130313144700')).toBe(true);
  });

  it('matches pre-release with build metadata', () => {
    expect(SEMVER_REGEX.test('1.0.0-beta.1+build.123')).toBe(true);
  });

  it('rejects invalid versions', () => {
    expect(SEMVER_REGEX.test('1.0')).toBe(false);
    expect(SEMVER_REGEX.test('1')).toBe(false);
    expect(SEMVER_REGEX.test('v1.0.0')).toBe(false);
    expect(SEMVER_REGEX.test('1.0.0.0')).toBe(false);
  });
});

describe('PACKAGE_NAME_REGEX', () => {
  it('matches valid scoped packages', () => {
    expect(PACKAGE_NAME_REGEX.test('@robeasthope/markdown')).toBe(true);
    expect(PACKAGE_NAME_REGEX.test('@robeasthope/ui')).toBe(true);
    expect(PACKAGE_NAME_REGEX.test('@robeasthope/my-package')).toBe(true);
  });

  it('rejects invalid package names', () => {
    expect(PACKAGE_NAME_REGEX.test('protomolecule/markdown')).toBe(false); // No @
    expect(PACKAGE_NAME_REGEX.test('@robeasthope')).toBe(false); // No package name
    expect(PACKAGE_NAME_REGEX.test('@Hecate/markdown')).toBe(false); // Uppercase
    expect(PACKAGE_NAME_REGEX.test('@robeasthope/Mark_down')).toBe(false); // Underscore
    expect(PACKAGE_NAME_REGEX.test('@robeasthope/mark down')).toBe(false); // Space
  });
});
