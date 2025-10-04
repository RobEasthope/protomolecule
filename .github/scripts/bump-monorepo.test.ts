import { describe, it, expect } from 'vitest';
import {
  parseSemver,
  calculateNewVersion,
  type BumpType
} from './bump-monorepo';

describe('parseSemver', () => {
  it('parses standard semver', () => {
    const result = parseSemver('1.2.3');

    expect(result).toEqual({ major: 1, minor: 2, patch: 3 });
  });

  it('parses version with leading zeros', () => {
    const result = parseSemver('0.0.1');

    expect(result).toEqual({ major: 0, minor: 0, patch: 1 });
  });

  it('parses large version numbers', () => {
    const result = parseSemver('10.20.30');

    expect(result).toEqual({ major: 10, minor: 20, patch: 30 });
  });

  it('parses pre-release versions', () => {
    const result = parseSemver('1.0.0-beta.1');

    expect(result).toEqual({ major: 1, minor: 0, patch: 0 });
  });

  it('parses pre-release with multiple hyphens', () => {
    const result = parseSemver('2.1.0-rc.1-alpha');

    expect(result).toEqual({ major: 2, minor: 1, patch: 0 });
  });

  it('throws on empty string', () => {
    expect(() => parseSemver('')).toThrow(
      'Invalid version: expected string, got string'
    );
  });

  it('throws on non-string input', () => {
    expect(() => parseSemver(123 as any)).toThrow(
      'Invalid version: expected string, got number'
    );
  });

  it('throws on invalid format (missing parts)', () => {
    expect(() => parseSemver('1.2')).toThrow(
      'Invalid semver format: 1.2 (expected major.minor.patch)'
    );
  });

  it('throws on invalid format (single number)', () => {
    expect(() => parseSemver('1')).toThrow(
      'Invalid semver format: 1 (expected major.minor.patch)'
    );
  });

  it('throws on non-numeric parts', () => {
    expect(() => parseSemver('1.x.3')).toThrow(
      'Invalid semver components in: 1.x.3'
    );
  });

  it('throws on negative version numbers', () => {
    expect(() => parseSemver('-1.0.0')).toThrow(
      'Invalid semver: negative values not allowed in -1.0.0'
    );
  });

  it('throws on negative minor version', () => {
    expect(() => parseSemver('1.-2.0')).toThrow(
      'Invalid semver: negative values not allowed in 1.-2.0'
    );
  });
});

describe('calculateNewVersion', () => {
  it('calculates major bump from 1.2.3', () => {
    const result = calculateNewVersion('1.2.3', 'major');

    expect(result).toBe('2.0.0');
  });

  it('calculates minor bump from 1.2.3', () => {
    const result = calculateNewVersion('1.2.3', 'minor');

    expect(result).toBe('1.3.0');
  });

  it('calculates patch bump from 1.2.3', () => {
    const result = calculateNewVersion('1.2.3', 'patch');

    expect(result).toBe('1.2.4');
  });

  it('calculates major bump from 0.1.0', () => {
    const result = calculateNewVersion('0.1.0', 'major');

    expect(result).toBe('1.0.0');
  });

  it('calculates minor bump resets patch to 0', () => {
    const result = calculateNewVersion('1.5.9', 'minor');

    expect(result).toBe('1.6.0');
  });

  it('calculates major bump resets minor and patch to 0', () => {
    const result = calculateNewVersion('1.5.9', 'major');

    expect(result).toBe('2.0.0');
  });

  it('handles version 0.0.0', () => {
    const result = calculateNewVersion('0.0.0', 'patch');

    expect(result).toBe('0.0.1');
  });

  it('handles large version numbers', () => {
    const result = calculateNewVersion('10.20.30', 'minor');

    expect(result).toBe('10.21.0');
  });
});
