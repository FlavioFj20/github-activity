import { type GitHubEvent, type GitHubEventType } from './types.js';

type RepoCount = Record<string, number>;
type RepoKeyCount = Record<string, RepoCount>;

function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function countByRepo(events: GitHubEvent[], eventType: GitHubEventType): RepoCount {
  return events
    .filter((e) => e.type === eventType)
    .map((e) => e.repo.name)
    .reduce((acc, name) => {
      acc[name] = (acc[name] ?? 0) + 1;
      return acc;
    }, {} as RepoCount);
}

function countByRepoAndKey(
  events: GitHubEvent[],
  eventType: GitHubEventType,
  key: 'action' | 'ref_type'
): RepoKeyCount {
  return events
    .filter((e) => e.type === eventType)
    .reduce((acc, e) => {
      const repoName = e.repo.name;
      const subKey = e.payload[key] ?? 'unknown';
      const repo = acc[repoName] ?? {};
      repo[subKey] = (repo[subKey] ?? 0) + 1;
      acc[repoName] = repo;
      return acc;
    }, {} as RepoKeyCount);
}

function printRepoCounts(counts: RepoCount, format: (repo: string, count: number) => string): void {
  for (const [repo, count] of Object.entries(counts)) {
    console.log(format(repo, count));
  }
}

function printRepoKeyCounts(
  counts: RepoKeyCount,
  format: (repo: string, key: string, count: number) => string
): void {
  for (const [repo, byKey] of Object.entries(counts)) {
    for (const [key, count] of Object.entries(byKey)) {
      console.log(format(repo, key, count));
    }
  }
}

const ISSUE_PHRASES: Record<string, (count: number) => string> = {
  opened: (n) => (n === 1 ? 'a new issue' : `${n} new issues`),
  closed: (n) => (n === 1 ? 'an issue' : `${n} issues`),
  reopened: (n) => (n === 1 ? 'an issue' : `${n} issues`),
};

const PR_PHRASES: Record<string, (count: number) => string> = {
  opened: (n) => (n === 1 ? 'a pull request' : `${n} pull requests`),
  closed: (n) => (n === 1 ? 'a pull request' : `${n} pull requests`),
  merged: (n) => (n === 1 ? 'a pull request' : `${n} pull requests`),
  reopened: (n) => (n === 1 ? 'a pull request' : `${n} pull requests`),
};

const REF_TYPE_PHRASES: Record<string, (count: number) => string> = {
  branch: (n) => (n === 1 ? 'a branch' : `${n} branches`),
  tag: (n) => (n === 1 ? 'a tag' : `${n} tags`),
  repository: (n) => (n === 1 ? 'a repository' : `${n} repositories`),
};

function countGollumPages(events: GitHubEvent[]): RepoCount {
  return events
    .filter((e) => e.type === 'GollumEvent')
    .flatMap((e) => e.payload.pages ?? [])
    .reduce((acc, page) => {
      const action = page.action ?? 'unknown';
      acc[action] = (acc[action] ?? 0) + 1;
      return acc;
    }, {} as RepoCount);
}

export const processEvents = (events: GitHubEvent[]) => {
  printRepoCounts(countByRepo(events, 'PushEvent'), (repo, count) =>
    `- Pushed ${count} time${count === 1 ? '' : 's'} to ${repo}`
  );

  printRepoKeyCounts(countByRepoAndKey(events, 'IssuesEvent', 'action'), (repo, action, count) => {
    const phrase = ISSUE_PHRASES[action];
    if (phrase) {
      return `- ${capitalize(action)} ${phrase(count)} in ${repo}`;
    }
    return `- ${capitalize(action)} ${count} issue${count === 1 ? '' : 's'} in ${repo}`;
  });

  printRepoKeyCounts(countByRepoAndKey(events, 'PullRequestEvent', 'action'), (repo, action, count) => {
    const phrase = PR_PHRASES[action];
    if (phrase) {
      return `- ${capitalize(action)} ${phrase(count)} in ${repo}`;
    }
    return `- ${capitalize(action)} ${count} pull request${count === 1 ? '' : 's'} in ${repo}`;
  });

  printRepoCounts(countByRepo(events, 'IssueCommentEvent'), (repo, count) =>
    `- Commented on issues ${count} time${count === 1 ? '' : 's'} in ${repo}`
  );

  printRepoKeyCounts(countByRepoAndKey(events, 'CreateEvent', 'ref_type'), (repo, refType, count) => {
    const phrase = REF_TYPE_PHRASES[refType] ?? ((n: number) => `${n} ${refType}s`);
    return `- Created ${phrase(count)} in ${repo}`;
  });

  printRepoKeyCounts(countByRepoAndKey(events, 'DeleteEvent', 'ref_type'), (repo, refType, count) => {
    const phrase = REF_TYPE_PHRASES[refType] ?? ((n: number) => `${n} ${refType}s`);
    return `- Deleted ${phrase(count)} in ${repo}`;
  });

  printRepoCounts(countByRepo(events, 'ReleaseEvent'), (repo, count) =>
    `- Published ${count === 1 ? 'a release' : `${count} releases`} in ${repo}`
  );

  for (const e of events.filter((e) => e.type === 'WatchEvent')) {
    console.log(`- Starred ${e.repo.name}`);
  }

  const forks = events.filter((e) => e.type === 'ForkEvent').length;
  if (forks > 0) {
    console.log(`- Forked ${forks} repo${forks === 1 ? '' : 's'}`);
  }

  printRepoCounts(countByRepo(events, 'MemberEvent'), (repo, count) =>
    `- Added ${count === 1 ? 'a member' : `${count} members`} to ${repo}`
  );

  printRepoCounts(countByRepo(events, 'CommitCommentEvent'), (repo, count) =>
    `- Commented on commits ${count} time${count === 1 ? '' : 's'} in ${repo}`
  );

  printRepoKeyCounts(countByRepoAndKey(events, 'PullRequestReviewEvent', 'action'), (repo, action, count) => {
    const verb = action === 'submitted' ? 'Reviewed' : capitalize(action);
    return `- ${verb} ${count === 1 ? 'a pull request' : `${count} pull requests`} in ${repo}`;
  });

  printRepoCounts(countByRepo(events, 'PullRequestReviewCommentEvent'), (repo, count) =>
    count === 1
      ? `- Commented on a pull request review in ${repo}`
      : `- Commented on pull request reviews ${count} times in ${repo}`
  );

  const wikiPages = countGollumPages(events);
  for (const [action, count] of Object.entries(wikiPages)) {
    const verb = action === 'created' ? 'Created' : action === 'edited' ? 'Edited' : capitalize(action);
    console.log(`- ${verb} ${count === 1 ? 'a wiki page' : `${count} wiki pages`}`);
  }

  printRepoCounts(countByRepo(events, 'DiscussionEvent'), (repo, count) =>
    `- Started ${count === 1 ? 'a discussion' : `${count} discussions`} in ${repo}`
  );

  for (const e of events.filter((e) => e.type === 'PublicEvent')) {
    console.log(`- Made ${e.repo.name} public`);
  }
};
