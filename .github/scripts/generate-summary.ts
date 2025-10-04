#!/usr/bin/env tsx
/**
 * generate-summary.ts
 *
 * Generates AI-powered release summaries using GitHub Models API.
 * Reads published package information and creates contextual release notes
 * with varying levels of detail based on release significance.
 *
 * Usage:
 *   tsx generate-summary.ts
 *
 * Input (reads from /tmp):
 *   /tmp/published-packages.json: Array of {name, version} objects
 *   /tmp/bump-type.txt: Version bump type (major/minor/patch)
 *   /tmp/package-count.txt: Number of packages published
 *   /tmp/new-version.txt: New monorepo version
 *
 * Output (writes to /tmp for next step):
 *   /tmp/release-summary.txt: Generated release notes
 *   /tmp/used-ai.txt: "true" if AI generated, "false" if template fallback
 *
 * Environment variables:
 *   GITHUB_TOKEN: Required for GitHub Models API authentication
 *
 * Exit codes:
 *   0: Success (AI or fallback summary generated)
 *   1: Error (missing input files, invalid data, etc.)
 */

import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

export interface Package {
  name: string;
  version: string;
}

export type SummaryDepth = 'brief' | 'detailed' | 'comprehensive';
export type BumpType = 'major' | 'minor' | 'patch';

interface AIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

/**
 * Determines summary depth based on release significance
 * Pure function - easily testable
 */
export function determineSummaryDepth(
  bumpType: BumpType,
  packageCount: number
): SummaryDepth {
  // Major milestone with multiple packages
  if (bumpType === 'major' && packageCount >= 2) {
    return 'comprehensive';
  }

  // Multiple packages or major bump
  if (bumpType === 'major' || packageCount >= 3) {
    return 'detailed';
  }

  // Default for single package, patch/minor
  return 'brief';
}

/**
 * Formats packages for display in summary
 * Pure function - easily testable
 */
export function formatPackageSummary(packages: Package[]): string {
  return packages.map(pkg => `${pkg.name}@${pkg.version}`).join('\n');
}

/**
 * Generates fallback template summary when AI is unavailable
 * Pure function - easily testable
 */
export function generateFallbackSummary(packages: Package[]): string {
  let summary = `## Workspace Updates\n\n`;
  for (const pkg of packages) {
    summary += `* ${pkg.name}@${pkg.version}\n`;
  }
  summary += `\n_AI summary unavailable - see individual package changelogs for detailed changes._`;
  return summary;
}

/**
 * Validates AI response content
 * Pure function - easily testable
 */
export function validateAIResponse(content: unknown): string {
  if (!content || typeof content !== 'string') {
    throw new Error('AI response is empty or not a string');
  }
  if (content.length < 10) {
    throw new Error(`AI response too short: ${content.length} characters`);
  }
  if (content.length > 5000) {
    throw new Error(`AI response too long: ${content.length} characters`);
  }
  return content;
}

/**
 * Main function - generates release summary
 */
async function generateSummary(): Promise<void> {
  // Validate required input files exist
  const requiredFiles = [
    '/tmp/published-packages.json',
    '/tmp/bump-type.txt',
    '/tmp/package-count.txt',
    '/tmp/new-version.txt'
  ];

  for (const file of requiredFiles) {
    if (!existsSync(file)) {
      console.error(`❌ ERROR: Required file not found: ${file}`);
      process.exit(1);
    }
  }

  // Read data from previous step
  const publishedPackages = JSON.parse(
    readFileSync('/tmp/published-packages.json', 'utf8')
  ) as Package[];
  const bumpType = readFileSync('/tmp/bump-type.txt', 'utf8').trim() as BumpType;
  const packageCount = Number.parseInt(
    readFileSync('/tmp/package-count.txt', 'utf8').trim(),
    10
  );
  const newVersion = readFileSync('/tmp/new-version.txt', 'utf8').trim();

  const depth = determineSummaryDepth(bumpType, packageCount);

  console.log(`Summary depth: ${depth} (bump: ${bumpType}, packages: ${packageCount})`);

  // Build package summary for AI
  const packageSummary = formatPackageSummary(publishedPackages);

  // Read changesets for context
  let changesetContext = '';
  try {
    // Get the changesets that were just consumed
    const changesetFiles = execSync('git diff HEAD~1 HEAD --name-only .changeset/*.md', { encoding: 'utf8' });
    console.log('Changeset files changed:', changesetFiles);

    // For now, use package names as context
    changesetContext = publishedPackages.map(pkg => pkg.name).join(', ');
  } catch (error) {
    // No changesets found or git command failed - use package names as fallback
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log('Could not read changesets:', errorMessage);
    console.log('Using package names as context instead');
    changesetContext = publishedPackages.map(pkg => pkg.name).join(', ');
  }

  // Prepare AI prompt based on depth
  const systemPrompt = 'You are generating release notes for a portfolio website monorepo.\n\n' +
    'Context:\n' +
    '* This is a multi-app monorepo tracking overall project progress\n' +
    '* Audience: developers, potential employers, collaborators\n' +
    '* Tone: Professional but approachable, user-friendly\n' +
    '* Focus: Impact and benefits, not technical jargon\n\n' +
    `Generate a ${depth} summary.`;

  let userPrompt = '';
  if (depth === 'brief') {
    userPrompt = 'Create a brief one-sentence summary for this release.\n\n' +
      `Packages published:\n${packageSummary}\n\n` +
      'Format:\nOne sentence describing the update, then list the packages.';
  } else if (depth === 'detailed') {
    userPrompt = 'Create a detailed release summary.\n\n' +
      `Packages published:\n${packageSummary}\n\n` +
      `Bump type: ${bumpType}\n\n` +
      'Format:\n## Summary\nOne paragraph (2-3 sentences) focusing on impact.\n\n' +
      '## Workspace Updates\n* List each package with brief description\n\n' +
      '## Highlights\n* 3-5 bullet points with emojis\n* Focus on user-facing value\n\n' +
      'Use emojis: ✨ 🎨 ⚡ 🧩 📦 🔧 🔄';
  } else {
    userPrompt = 'Create a comprehensive release summary for a major milestone.\n\n' +
      `Packages published:\n${packageSummary}\n\n` +
      `Bump type: ${bumpType}\n\n` +
      'This is a significant update. Format:\n## Summary\nTwo paragraphs explaining significance and impact.\n\n' +
      '## Workspace Updates\nOrganized list with NEW/UPDATED flags where relevant.\n\n' +
      '## Highlights\n* 5-7 bullet points with emojis covering all aspects\n* Show how pieces fit together\n\n' +
      "## What's Next\nBrief forward-looking statement (optional).\n\n" +
      'Use emojis: ✨ 🎨 ⚡ 🧩 📦 🔧 🔄';
  }

  // Call GitHub Models API
  // Rate limits: gpt-4o-mini = 150 requests/day, gpt-4o = 50 requests/day
  // Token limits: GitHub enforces ~8k input / 4k output per request
  // On rate limit (429), the script falls back to template (no retry needed for releases)
  let aiSummary = '';
  let usedAI = false;

  try {
    console.log('Calling GitHub Models API...');

    const response = await fetch('https://models.inference.ai.azure.com/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN || ''}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`GitHub Models API error: ${response.status} - ${errorText}`);
    }

    const data = (await response.json()) as AIResponse;
    const rawContent = data.choices[0].message.content;

    // Validate AI output using extracted function
    aiSummary = validateAIResponse(rawContent);

    console.log('✅ AI summary generated successfully');
    console.log('Summary preview:', aiSummary.substring(0, 200) + '...');
    usedAI = true;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log('⚠️ AI generation failed:', errorMessage);
    console.log('Falling back to template...');

    // Fallback to template using extracted function
    aiSummary = generateFallbackSummary(publishedPackages);
    usedAI = false;
  }

  // Write outputs to /tmp
  writeFileSync('/tmp/release-summary.txt', aiSummary, 'utf8');
  writeFileSync('/tmp/used-ai.txt', usedAI ? 'true' : 'false', 'utf8');

  console.log('✅ Release summary generated');
  console.log(`   AI used: ${usedAI}`);
}

// Run the script only if executed directly (not imported)
if (import.meta.url === `file://${process.argv[1]}`) {
  generateSummary().catch((error) => {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ ERROR: Failed to generate summary:', errorMessage);
    process.exit(1);
  });
}
