/* eslint-disable canonical/filename-match-exported */
type ChangelogFunctions = {
  generatePRTitle?: (pendingChangesets: Array<{
    releases: Array<{ name: string; type: string }>;
    summary: string;
  }>) => Promise<string>;
  getDependencyReleaseLine: (
    changesets: Array<{ commit?: string }>,
    dependenciesUpdated: Array<{ name: string; newVersion: string }>
  ) => Promise<string>;
  getReleaseLine: (changeset: {
    commit?: string;
    summary: string;
  }) => Promise<string>;
};

declare const changelogFunctions: ChangelogFunctions;
export default changelogFunctions;
