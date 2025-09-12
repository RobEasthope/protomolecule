import { exec } from "child_process";
import fs from "fs/promises";
import os from "os";
import path from "path";
import { promisify } from "util";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

const execAsync = promisify(exec);

describe("pre-commit hook", () => {
  let testDir: string;
  let originalPath: string;
  const hookPath = path.resolve(process.cwd(), ".husky/pre-commit");

  beforeEach(async () => {
    // Create a temporary test directory
    testDir = await fs.mkdtemp(path.join(os.tmpdir(), "pre-commit-test-"));
    originalPath = process.env.PATH || "";

    // Initialize git repo in test directory
    await execAsync("git init", { cwd: testDir });
    await execAsync('git config user.email "test@example.com"', {
      cwd: testDir,
    });
    await execAsync('git config user.name "Test User"', { cwd: testDir });

    // Copy the pre-commit hook to test directory
    await fs.mkdir(path.join(testDir, ".husky"), { recursive: true });
    await fs.copyFile(hookPath, path.join(testDir, ".husky/pre-commit"));
    await fs.chmod(path.join(testDir, ".husky/pre-commit"), 0o755);

    // Create a package.json with lint-staged configuration
    const packageJson = {
      "lint-staged": {
        "**/*": "prettier --write --ignore-unknown",
      },
      name: "test-repo",
      version: "1.0.0",
    };
    await fs.writeFile(
      path.join(testDir, "package.json"),
      JSON.stringify(packageJson, null, 2),
    );

    // Create a mock prettier command
    const mockPrettier = `#!/bin/bash
# Mock prettier that formats .js and .ts files
if [[ "$1" == "--write" ]]; then
    shift # Remove --write
    shift # Remove --ignore-unknown
    for file in "$@"; do
        if [[ -f "$file" ]] && [[ "$file" == *.js || "$file" == *.ts ]]; then
            # Add a comment to simulate formatting
            echo "// formatted" | cat - "$file" > temp && mv temp "$file"
        fi
    done
fi
`;
    await fs.writeFile(path.join(testDir, "prettier"), mockPrettier);
    await fs.chmod(path.join(testDir, "prettier"), 0o755);

    // Create a mock pnpm format command
    const mockPnpm = `#!/bin/bash
# Mock pnpm that only formats .js and .ts files
if [ "$1" = "format" ]; then
    # Use find with -print0 and while read to handle spaces
    find . \\( -name "*.js" -o -name "*.ts" \\) -type f -print0 2>/dev/null | while IFS= read -r -d '' file; do
        if [ -f "$file" ]; then
            # Add a comment to simulate formatting
            echo "// formatted" | cat - "$file" > temp && mv temp "$file"
        fi
    done
fi
`;
    await fs.writeFile(path.join(testDir, "pnpm"), mockPnpm);
    await fs.chmod(path.join(testDir, "pnpm"), 0o755);

    // Add test directory to PATH
    process.env.PATH = `${testDir}:${originalPath}`;
  });

  afterEach(async () => {
    // Restore original PATH
    process.env.PATH = originalPath;

    // Clean up test directory
    await fs.rm(testDir, { force: true, recursive: true });
  });

  it("should format staged JavaScript files", async () => {
    // Create a test file
    const testFile = path.join(testDir, "test.js");
    await fs.writeFile(testFile, "console.log('test')");

    // Stage the file
    await execAsync("git add test.js", { cwd: testDir });

    // Run the pre-commit hook
    const { stdout } = await execAsync(".husky/pre-commit", { cwd: testDir });

    // Check that the file was formatted
    const content = await fs.readFile(testFile, "utf8");
    expect(content).toContain("// formatted");
    // Check for successful completion in lint-staged output
    expect(stdout).toMatch(/COMPLETED.*Running tasks for staged files/);
  });

  it("should handle files with spaces in names", async () => {
    // Create files with spaces
    const file1 = path.join(testDir, "test file.js");
    const file2 = path.join(testDir, "another file.js");
    await fs.writeFile(file1, "console.log('test')");
    await fs.writeFile(file2, "console.log('another')");

    // Stage the files - need to escape for shell
    await execAsync('git add "test file.js"', { cwd: testDir });
    await execAsync('git add "another file.js"', { cwd: testDir });

    // Run the pre-commit hook
    const { stdout } = await execAsync(".husky/pre-commit", { cwd: testDir });

    // Check that both files were formatted
    const content1 = await fs.readFile(file1, "utf8");
    const content2 = await fs.readFile(file2, "utf8");
    expect(content1).toContain("// formatted");
    expect(content2).toContain("// formatted");
    // Check for successful completion in lint-staged output
    expect(stdout).toMatch(/COMPLETED.*Running tasks for staged files/);
  });

  it("should handle deleted files correctly", async () => {
    // Create and commit initial files
    const keepFile = path.join(testDir, "keep.js");
    const deleteFile = path.join(testDir, "delete.js");
    await fs.writeFile(keepFile, "console.log('keep')");
    await fs.writeFile(deleteFile, "console.log('delete')");
    await execAsync("git add .", { cwd: testDir });
    await execAsync('git commit -m "Initial commit"', { cwd: testDir });

    // Stage deletion of one file and modification of another
    await execAsync("git rm delete.js", { cwd: testDir });
    await fs.writeFile(keepFile, "console.log('modified')");
    await execAsync("git add keep.js", { cwd: testDir });

    // Run the pre-commit hook
    await execAsync(".husky/pre-commit", { cwd: testDir });

    // Check that only the existing file was formatted
    const content = await fs.readFile(keepFile, "utf8");
    expect(content).toContain("// formatted");

    // Verify delete.js doesn't exist
    await expect(fs.access(deleteFile)).rejects.toThrow();
  });

  it("should report when code is already formatted", async () => {
    // Create a pre-formatted file
    const testFile = path.join(testDir, "test.js");
    await fs.writeFile(testFile, "// formatted\nconsole.log('test')");

    // Update mock pnpm to not re-format already formatted files
    const mockPnpm = `#!/bin/bash
if [ "$1" = "format" ]; then
    # Use find with -print0 and while read to handle spaces
    find . \\( -name "*.js" -o -name "*.ts" \\) -type f -print0 2>/dev/null | while IFS= read -r -d '' file; do
        if [ -f "$file" ] && ! grep -q "^// formatted" "$file"; then
            echo "// formatted" | cat - "$file" > temp && mv temp "$file"
        fi
    done
fi
`;
    await fs.writeFile(path.join(testDir, "pnpm"), mockPnpm);

    // Stage the file
    await execAsync("git add test.js", { cwd: testDir });

    // Run the pre-commit hook
    const { stdout } = await execAsync(".husky/pre-commit", { cwd: testDir });

    // Check for successful completion in lint-staged output
    // The file should remain unchanged since it's already formatted
    expect(stdout).toMatch(/COMPLETED.*Running tasks for staged files/);
  });

  it("should handle empty staging area", async () => {
    // Run the pre-commit hook with no staged files
    const { stdout } = await execAsync(".husky/pre-commit", { cwd: testDir });

    // Check output message - no files to process
    expect(stdout).toMatch(/No staged files/);
  });

  it("should only format JavaScript and TypeScript files", async () => {
    // Create different file types
    const jsFile = path.join(testDir, "test.js");
    const mdFile = path.join(testDir, "README.md");
    const cssFile = path.join(testDir, "style.css");

    await fs.writeFile(jsFile, "console.log('test')");
    await fs.writeFile(mdFile, "# README");
    await fs.writeFile(cssFile, "body { color: red; }");

    // Stage all files
    await execAsync("git add .", { cwd: testDir });

    // Run the pre-commit hook
    await execAsync(".husky/pre-commit", { cwd: testDir });

    // Check that only JS file was formatted
    const jsContent = await fs.readFile(jsFile, "utf8");
    const mdContent = await fs.readFile(mdFile, "utf8");
    const cssContent = await fs.readFile(cssFile, "utf8");

    expect(jsContent).toContain("// formatted");
    expect(mdContent).toBe("# README");
    expect(cssContent).toBe("body { color: red; }");
  });

  it("should handle special characters in filenames", async () => {
    // Create files with special characters
    const file1 = path.join(testDir, "test$file.js");
    const file2 = path.join(testDir, "test'file.js");

    await fs.writeFile(file1, "console.log('test')");
    await fs.writeFile(file2, "console.log('test')");

    // Stage the files separately to avoid shell escaping issues
    await execAsync('git add "test\\$file.js"', { cwd: testDir });
    await execAsync('git add "test\'file.js"', { cwd: testDir });

    // Run the pre-commit hook
    const { stdout } = await execAsync(".husky/pre-commit", { cwd: testDir });

    // Check that files were formatted
    const content1 = await fs.readFile(file1, "utf8");
    const content2 = await fs.readFile(file2, "utf8");

    expect(content1).toContain("// formatted");
    expect(content2).toContain("// formatted");
    // Check for successful completion in lint-staged output
    expect(stdout).toMatch(/COMPLETED.*Running tasks for staged files/);
  });

  it("should use unique temporary files to avoid race conditions", async () => {
    // Create test files
    const file1 = path.join(testDir, "test1.js");
    const file2 = path.join(testDir, "test2.js");
    await fs.writeFile(file1, "console.log('test1')");
    await fs.writeFile(file2, "console.log('test2')");

    // Stage files
    await execAsync("git add test1.js test2.js", { cwd: testDir });

    // Run the hook and check that temp files are cleaned up
    await execAsync(".husky/pre-commit", { cwd: testDir });

    // List all files in /tmp that match our pattern
    const { stdout } = await execAsync(
      "ls -la /tmp/staged_files_* 2>/dev/null || echo 'No temp files found'",
    );

    // Verify no leftover temp files
    expect(stdout).toContain("No temp files found");
  });
});
