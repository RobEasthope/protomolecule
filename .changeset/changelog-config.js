/**
 * Custom changelog generator for more descriptive PR titles
 * This extends the default changelog behavior to provide better PR naming
 */

import { getInfo, getInfoFromPullRequest } from "@changesets/get-github-info";

const changelogFunctions = {
  /**
   * Generate changelog line for dependency updates
   * @param {Array} changesets - Array of changesets that caused dependency updates
   * @param {Array} dependenciesUpdated - Array of updated dependencies
   * @returns {Promise<string>} Formatted dependency update line
   */
  getDependencyReleaseLine: async (changesets, dependenciesUpdated) => {
    if (dependenciesUpdated.length === 0) return "";
    
    const changesetLink = `- Updated dependencies [${(changesets.map(c => c.commit).filter(_ => _))}]:`;
    
    const updatedDependenciesList = dependenciesUpdated.map(
      dependency => `  - ${dependency.name}@${dependency.newVersion}`
    );
    
    return [changesetLink, ...updatedDependenciesList].join("\n");
  },
  
  /**
   * Generate a single release line for the changelog
   * @param {Object} changeset - The changeset object
   * @param {string} type - The type of change (major, minor, patch)
   * @returns {Promise<string>} Formatted release line with commit/PR links
   */
  getReleaseLine: async (changeset, type) => {
    const [firstLine, ...futureLines] = changeset.summary
      .split("\n")
      .map(l => l.trimRight());

    if (changeset.commit) {
      let { links } = await getInfo({
        repo: "RobEasthope/protomolecule",
        commit: changeset.commit
      });
      return `- ${links.commit}${links.pull === null ? "" : ` ${links.pull}`} - ${firstLine}\n${futureLines.map(l => `  ${l}`).join("\n")}`;
    } else {
      return `- ${firstLine}\n${futureLines.map(l => `  ${l}`).join("\n")}`;
    }
  }
};

/**
 * Get summary for PR title generation
 * This will be used by the GitHub Action to create descriptive PR titles
 * @param {Array} pendingChangesets - Array of changeset objects to analyze
 * @returns {Promise<string>} - Generated PR title
 */
changelogFunctions.generatePRTitle = async (pendingChangesets) => {
  if (!pendingChangesets || pendingChangesets.length === 0) {
    return "chore: version packages";
  }

  // Analyze changesets to determine what's being released
  const packages = new Map();
  const changeTypes = new Set();

  pendingChangesets.forEach(changeset => {
    // Track all packages being updated
    changeset.releases.forEach(release => {
      const pkgName = release.name.replace('@protomolecule/', '');
      if (!packages.has(pkgName)) {
        packages.set(pkgName, new Set());
      }
      packages.get(pkgName).add(release.type);
    });

    // Track change types from commit messages
    const summary = changeset.summary.toLowerCase();
    if (summary.includes('breaking') || summary.includes('!:')) {
      changeTypes.add('breaking');
    } else if (summary.startsWith('feat')) {
      changeTypes.add('feature');
    } else if (summary.startsWith('fix')) {
      changeTypes.add('fix');
    } else if (summary.startsWith('docs')) {
      changeTypes.add('docs');
    } else if (summary.startsWith('perf')) {
      changeTypes.add('perf');
    }
  });

  // Build descriptive title
  const packageList = Array.from(packages.keys());
  const hasBreaking = changeTypes.has('breaking');
  const hasFeatures = changeTypes.has('feature');
  const hasFixes = changeTypes.has('fix');

  // Priority: breaking > feature > fix > other
  let prefix = 'chore';
  let description = 'version packages';

  if (hasBreaking) {
    prefix = 'chore!';
    description = `breaking changes in ${packageList.join(', ')}`;
  } else if (hasFeatures && hasFixes) {
    description = `release ${packageList.join(', ')} with features and fixes`;
  } else if (hasFeatures) {
    description = `release ${packageList.join(', ')} with new features`;
  } else if (hasFixes) {
    description = `release ${packageList.join(', ')} with bug fixes`;
  } else if (packageList.length === 1) {
    description = `release ${packageList[0]}`;
  } else if (packageList.length <= 3) {
    description = `release ${packageList.join(', ')}`;
  } else {
    description = `release ${packageList.length} packages`;
  }

  return `${prefix}: ${description}`;
};

export default changelogFunctions;