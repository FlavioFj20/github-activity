{
  id: '17489250498',
  type: 'PushEvent',
  actor: {
    id: 170270,
    login: 'sindresorhus',
    display_login: 'sindresorhus',
    gravatar_id: '',
    url: 'https://api.github.com/users/sindresorhus',
    avatar_url: 'https://avatars.githubusercontent.com/u/170270?'
  },
  repo: {
    id: 20451415,
    name: 'chalk/ansi-regex',
    url: 'https://api.github.com/repos/chalk/ansi-regex'
  },
  payload: {
    repository_id: 20451415,
    push_id: 39809321291,
    ref: 'refs/heads/main',
    head: '7cf0228990eb38c27f9897f4fb17d42d39075a20',
    before: 'ff3784580bc9c6b0f6ce4555f6d17d1dca6adc66'
  },
  public: true,
  created_at: '2026-08-12T14:30:20Z',
  org: {
    id: 13122722,
    login: 'chalk',
    gravatar_id: '',
    url: 'https://api.github.com/orgs/chalk',
    avatar_url: 'https://avatars.githubusercontent.com/u/13122722?'
  }
}
{
  id: '13166703667',
  type: 'PullRequestEvent',
  actor: {
    id: 170270,
    login: 'sindresorhus',
    display_login: 'sindresorhus',
    gravatar_id: '',
    url: 'https://api.github.com/users/sindresorhus',
    avatar_url: 'https://avatars.githubusercontent.com/u/170270?'
  },
  repo: {
    id: 72200120,
    name: 'sindresorhus/p-queue',
    url: 'https://api.github.com/repos/sindresorhus/p-queue'
  },
  payload: {
    action: 'closed',
    number: 252,
    pull_request: {
      url: 'https://api.github.com/repos/sindresorhus/p-queue/pulls/252',
      id: 4261762819,
      number: 252,
      head: [Object],
      base: [Object]
    }
  },
  public: true,
  created_at: '2026-08-12T11:28:28Z'
}
{
  id: '13166586314',
  type: 'IssueCommentEvent',
  actor: {
    id: 170270,
    login: 'sindresorhus',
    display_login: 'sindresorhus',
    gravatar_id: '',
    url: 'https://api.github.com/users/sindresorhus',
    avatar_url: 'https://avatars.githubusercontent.com/u/170270?'
  },
  repo: {
    id: 72200120,
    name: 'sindresorhus/p-queue',
    url: 'https://api.github.com/repos/sindresorhus/p-queue'
  },
  payload: {
    action: 'created',
    issue: {
      url: 'https://api.github.com/repos/sindresorhus/p-queue/issues/252',
      repository_url: 'https://api.github.com/repos/sindresorhus/p-queue',
      labels_url: 'https://api.github.com/repos/sindresorhus/p-queue/issues/252/labels{/name}',
      comments_url: 'https://api.github.com/repos/sindresorhus/p-queue/issues/252/comments',
      events_url: 'https://api.github.com/repos/sindresorhus/p-queue/issues/252/events',
      html_url: 'https://github.com/sindresorhus/p-queue/pull/252',
      id: 5130304404,
      node_id: 'PR_kwDOBE2vuM7-BVcD',
      number: 252,
      title: 'Allow changing intervalCap at runtime',
      user: [Object],
      labels: [],
      state: 'closed',
      locked: true,
      assignees: [],
      milestone: null,
      comments: 2,
      created_at: '2026-08-12T11:22:53Z',
      updated_at: '2026-08-12T12:47:11Z',
      closed_at: '2026-08-12T12:47:07Z',
      assignee: null,
      active_lock_reason: 'resolved',
      draft: false,
      pull_request: [Object],
      body: '## Summary\n' +
        '\n' +
        'Adds a `get`/`set` `intervalCap` accessor on `PQueue`, mirroring the existing `concurrency` accessor, so the rate limit can be adjusted after the queue has been created.\n' +
        '\n' +
        'Closes #177, which asks for exactly this ("The only thing required for this would be to control `#intervalCap` property of `PQueue` at runtime").\n' +
        '\n' +
        '## Changes\n' +
        '\n' +
        '- `#intervalCap` is no longer `readonly`; added `get intervalCap()` / `set intervalCap()` with the same validation the constructor already does (must be a number >= 1, and must stay finite when `strict` is enabled).\n' +
        "- `#isIntervalIgnored` (an internal flag derived from `intervalCap`/`interval`) is now recomputed via a small `#updateIsIntervalIgnored()` helper whenever `intervalCap` changes, so it doesn't go stale.\n" +
        '- Setting `intervalCap` calls the existing `#processQueue()`, so raising the cap immediately lets already-queued tasks start rather than waiting for the next interval tick (same behavior as the existing `concurrency` setter).\n' +
        '- README: documented that `intervalCap` can be changed at runtime, and added the `.intervalCap` entry to the properties list (same pattern as `.concurrency`).\n' +
        '\n' +
        '## Testing\n' +
        '\n' +
        '- Added `enforce number in queue.intervalCap` (mirrors the existing `enforce number in queue.concurrency` test).\n' +
        "- Added `queue.intervalCap requires a finite value when strict` (mirrors the constructor's equivalent guard).\n" +
        '- Added `queue.intervalCap can be changed at runtime`, which proves the behavior end-to-end: with `intervalCap: 1`, only 1 of 4 queued tasks starts; raising `intervalCap` to `3` immediately starts 2 more without waiting for an interval tick.\n' +
        '- Verified RED/GREEN: reverting just `source/index.ts` makes the three new tests fail (`intervalCap` is currently read-only), confirming they exercise the reported gap; with the fix applied, `node --import=tsx/esm --test test/*.ts` passes all 209 tests.\n' +
        '- `tsc` and `tsd` both pass clean with no errors.\n' +
        '- `xo` currently fails on this checkout with "was not found by the project service" parsing errors on `bench.ts` and everything under `test/`/`test-d/` — verified this is pre-existing and unrelated to this diff (same errors occur on a clean checkout of `main` with no changes applied), likely an environment/path quirk in this sandbox rather than a real lint issue.\n' +
        '\n' +
        '## Notes\n' +
        '\n' +
        "- `interval` itself is intentionally left read-only in this PR to keep the change small — it drives timer/window scheduling (`#intervalId`/`#timeoutId`) which needs more careful handling to change safely mid-window. Happy to follow up separately if that's wanted too.",
      reactions: [Object],
      timeline_url: 'https://api.github.com/repos/sindresorhus/p-queue/issues/252/timeline',
      performed_via_github_app: null,
      state_reason: null
    },
    comment: {
      url: 'https://api.github.com/repos/sindresorhus/p-queue/issues/comments/5267000764',
      html_url: 'https://github.com/sindresorhus/p-queue/pull/252#issuecomment-5267000764',
      issue_url: 'https://api.github.com/repos/sindresorhus/p-queue/issues/252',
      id: 5267000764,
      node_id: 'IC_kwDOBE2vuM8AAAABOfANvA',
      user: [Object],
      created_at: '2026-08-12T12:47:07Z',
      updated_at: '2026-08-12T12:47:07Z',
      body: "Thanks, but I'm not interested in reviewing fully AI generated PRs.",
      reactions: [Object],
      performed_via_github_app: null,
      minimized: null
    }
  },
  public: true,
  created_at: '2026-08-12T12:47:07Z'
}
{
  id: '13166387461',
  type: 'ReleaseEvent',
  actor: {
    id: 170270,
    login: 'sindresorhus',
    display_login: 'sindresorhus',
    gravatar_id: '',
    url: 'https://api.github.com/users/sindresorhus',
    avatar_url: 'https://avatars.githubusercontent.com/u/170270?'
  },
  repo: {
    id: 29850217,
    name: 'sindresorhus/macos-trash',
    url: 'https://api.github.com/repos/sindresorhus/macos-trash'
  },
  payload: {
    action: 'published',
    release: {
      url: 'https://api.github.com/repos/sindresorhus/macos-trash/releases/369230057',
      assets_url: 'https://api.github.com/repos/sindresorhus/macos-trash/releases/369230057/assets',
      upload_url: 'https://uploads.github.com/repos/sindresorhus/macos-trash/releases/369230057/assets{?name,label}',
      html_url: 'https://github.com/sindresorhus/macos-trash/releases/tag/v3.1.0',
      id: 369230057,
      author: [Object],
      node_id: 'RE_kwDOAcd6ac4WAgDp',
      tag_name: 'v3.1.0',
      target_commitish: 'main',
      name: '',
      draft: false,
      immutable: false,
      prerelease: false,
      created_at: '2026-08-12T12:37:57Z',
      updated_at: '2026-08-12T12:41:18Z',
      published_at: '2026-08-12T12:41:18Z',
      assets: [Array],
      tarball_url: 'https://api.github.com/repos/sindresorhus/macos-trash/tarball/v3.1.0',
      zipball_url: 'https://api.github.com/repos/sindresorhus/macos-trash/zipball/v3.1.0',
      body: '- Add `--empty` flag (#35)\r\n' +
        '\r\n' +
        '---\r\n' +
        '\r\n' +
        'https://github.com/sindresorhus/macos-trash/compare/v3.0.0...v3.1.0',
      short_description_html: '<ul>\n' +
        '<li>Add <code>--empty</code> flag (<a class="issue-link js-issue-link" data-error-text="Failed to load title" data-id="5120256880" data-permission-text="Title is private" data-url="https://github.com/sindresorhus/macos-trash/issues/35" data-hovercard-type="pull_request" data-hovercard-url="/sindresorhus/macos-trash/pull/35/hovercard" href="https://github.com/sindresorhus/macos-trash/pull/35">#35</a>)</li>\n' +
        '</ul>\n' +
        '<hr>\n' +
        '<p><a class="commit-link" href="https://github.com/sindresorhus/macos-trash/compare/v3.0.0...v3.1.0"><tt>v3.0.0...v3.1.0</tt></a></p>',
      is_short_description_html_truncated: false
    }
  },
  public: true,
  created_at: '2026-08-12T12:41:18Z'
}
{
  id: '17480951093',
  type: 'PushEvent',
  actor: {
    id: 170270,
    login: 'sindresorhus',
    display_login: 'sindresorhus',
    gravatar_id: '',
    url: 'https://api.github.com/users/sindresorhus',
    avatar_url: 'https://avatars.githubusercontent.com/u/170270?'
  },
  repo: {
    id: 29850217,
    name: 'sindresorhus/macos-trash',
    url: 'https://api.github.com/repos/sindresorhus/macos-trash'
  },
  payload: {
    repository_id: 29850217,
    push_id: 39801014755,
    ref: 'refs/heads/main',
    head: '033004b56b8dc30907fa25ec0b1a7a4b84173c3a',
    before: '44d65f5949368c351f82abeea38c72028385be9c'
  },
  public: true,
  created_at: '2026-08-12T12:38:00Z'
}
{
  id: '17480861206',
  type: 'PushEvent',
  actor: {
    id: 170270,
    login: 'sindresorhus',
    display_login: 'sindresorhus',
    gravatar_id: '',
    url: 'https://api.github.com/users/sindresorhus',
    avatar_url: 'https://avatars.githubusercontent.com/u/170270?'
  },
  repo: {
    id: 29850217,
    name: 'sindresorhus/macos-trash',
    url: 'https://api.github.com/repos/sindresorhus/macos-trash'
  },
  payload: {
    repository_id: 29850217,
    push_id: 39800925075,
    ref: 'refs/heads/main',
    head: '44d65f5949368c351f82abeea38c72028385be9c',
    before: '9358749ddd1bff42e2251168e35f2e11dbbb88db'
  },
  public: true,
  created_at: '2026-08-12T12:36:38Z'
}
{
  id: '13166050148',
  type: 'IssuesEvent',
  actor: {
    id: 170270,
    login: 'sindresorhus',
    display_login: 'sindresorhus',
    gravatar_id: '',
    url: 'https://api.github.com/users/sindresorhus',
    avatar_url: 'https://avatars.githubusercontent.com/u/170270?'
  },
  repo: {
    id: 29850217,
    name: 'sindresorhus/macos-trash',
    url: 'https://api.github.com/repos/sindresorhus/macos-trash'
  },
  payload: {
    action: 'closed',
    issue: {
      url: 'https://api.github.com/repos/sindresorhus/macos-trash/issues/28',
      repository_url: 'https://api.github.com/repos/sindresorhus/macos-trash',
      labels_url: 'https://api.github.com/repos/sindresorhus/macos-trash/issues/28/labels{/name}',
      comments_url: 'https://api.github.com/repos/sindresorhus/macos-trash/issues/28/comments',
      events_url: 'https://api.github.com/repos/sindresorhus/macos-trash/issues/28/events',
      html_url: 'https://github.com/sindresorhus/macos-trash/issues/28',
      id: 2913052055,
      node_id: 'I_kwDOAcd6ac6toaWX',
      number: 28,
      title: 'Add `--empty` flag',
      user: [Object],
      labels: [Array],
      state: 'closed',
      locked: false,
      assignees: [],
      milestone: null,
      comments: 8,
      created_at: '2025-03-12T07:49:15Z',
      updated_at: '2026-08-12T12:36:38Z',
      closed_at: '2026-08-12T12:36:38Z',
      assignee: null,
      active_lock_reason: null,
      sub_issues_summary: [Object],
      issue_dependencies_summary: [Object],
      body: 'In order to differentiate it from native trash commands, we should add --list(-l) and --clear(-cl) options.\n' +
        'The --list(-l) option lists up the contents of trash box.\n' +
        'The --clear(-cl) option empties the trash box.',
      reactions: [Object],
      timeline_url: 'https://api.github.com/repos/sindresorhus/macos-trash/issues/28/timeline',
      performed_via_github_app: null,
      state_reason: 'completed',
      pinned_comment: null
    }
  },
  public: true,
  created_at: '2026-08-12T12:36:38Z'
}
{
  id: '13162092920',
  type: 'IssueCommentEvent',
  actor: {
    id: 170270,
    login: 'sindresorhus',
    display_login: 'sindresorhus',
    gravatar_id: '',
    url: 'https://api.github.com/users/sindresorhus',
    avatar_url: 'https://avatars.githubusercontent.com/u/170270?'
  },
  repo: {
    id: 94061307,
    name: 'vadimdemedes/ink',
    url: 'https://api.github.com/repos/vadimdemedes/ink'
  },
  payload: {
    action: 'created',
    issue: {
      url: 'https://api.github.com/repos/vadimdemedes/ink/issues/988',
      repository_url: 'https://api.github.com/repos/vadimdemedes/ink',
      labels_url: 'https://api.github.com/repos/vadimdemedes/ink/issues/988/labels{/name}',
      comments_url: 'https://api.github.com/repos/vadimdemedes/ink/issues/988/comments',
      events_url: 'https://api.github.com/repos/vadimdemedes/ink/issues/988/events',
      html_url: 'https://github.com/vadimdemedes/ink/pull/988',
      id: 5103525397,
      node_id: 'PR_kwDOBZtC-878rZm3',
      number: 988,
      title: 'Add scrolling primitives: `contentOffsetX`/`contentOffsetY` props and client/scroll size metrics',
      user: [Object],
      labels: [],
      state: 'open',
      locked: false,
      assignees: [],
      milestone: null,
      comments: 2,
      created_at: '2026-08-09T16:21:38Z',
      updated_at: '2026-08-12T14:17:18Z',
      closed_at: null,
      assignee: null,
      active_lock_reason: null,
      draft: false,
      pull_request: [Object],
      body: 'This implements the scrolling primitives sketched in #765, following the direction there: core primitives only, so a `ScrollView` can be built in userland (example included in the readme).\n' +
        '\n' +
        '- `contentOffsetX` / `contentOffsetY` props on `Box`. Children are shifted left/up by the given number of columns/rows at render time. Combined with `overflow="hidden"`, this is the scroll mechanism. Layout is untouched, the offset is applied in `renderNodeToOutput` when recursing into children, so Yoga sees nothing new.\n' +
        '- `measureElement()` now also returns `clientWidth`/`clientHeight` (size excluding borders) and `scrollWidth`/`scrollHeight` (content extent including overflow, computed from child layout extents and clamped to be at least the client size, matching DOM semantics). These extend the `x`/`y`/`width`/`height` shape from #968.\n' +
        '- `useBoxMetrics()` returns the same four new fields, so a userland ScrollView can be fully reactive to content changes via the existing layout listener.\n' +
        '- The readme ScrollView recipe (and the runnable `examples/scroll`) wrap the content in a `flexShrink={0}` container. Without it, Yoga squeezes the children into the fixed-height viewport and there is nothing to scroll; the recipe notes this explicitly since it is the first thing anyone building a ScrollView will hit.\n' +
        '\n' +
        "One deliberate divergence from the snippet in #765: child extents are measured relative to the inside of the container's border (parent border offsets are subtracted), so `scrollWidth === clientWidth` when content exactly fits a bordered box. The issue snippet measured against the outer edge, which over-reports the scroll extent by the border width.\n" +
        '\n' +
        'Deliberately not included, per the discussion in #765: scrollbars, overflow indicators, an imperative scroll API, and any built-in `ScrollView` component. Offsets are also not clamped to the content extent, clamping policy belongs to the userland component (the readme example clamps via `scrollHeight - clientHeight`).\n' +
        '\n' +
        'Tests: rendering tests for vertical/horizontal offsets, offsets inside borders, nested offset containers, offset beyond content, and a zero-offset behavior lock; metric tests for client/scroll sizes with overflowing content, borders, and content that grows after mount. All fail on `master` without the change (except the behavior lock). Verified manually in a real terminal with the included example (both axes, clamping at all edges).\n' +
        '\n' +
        'Also relevant to #222.\n',
      reactions: [Object],
      timeline_url: 'https://api.github.com/repos/vadimdemedes/ink/issues/988/timeline',
      performed_via_github_app: null,
      state_reason: null
    },
    comment: {
      url: 'https://api.github.com/repos/vadimdemedes/ink/issues/comments/5265946725',
      html_url: 'https://github.com/vadimdemedes/ink/pull/988#issuecomment-5265946725',
      issue_url: 'https://api.github.com/repos/vadimdemedes/ink/issues/988',
      id: 5265946725,
      node_id: 'IC_kwDOBZtC-88AAAABOd_4ZQ',
      user: [Object],
      created_at: '2026-08-12T11:15:08Z',
      updated_at: '2026-08-12T11:15:08Z',
      body: 'I found three remaining issues:\r\n' +
        '\r\n' +
        '1. Horizontal scrolling loses a column when the offset lands in the middle of a double-width character. With `你A` in a two-column viewport, offsets 1 and 2 both render `A`. At offset 1 it should render ` A`, since the first visible cell is the clipped half of `你` and `A` still belongs in the second cell. This is reproducable with the current code and means column offsets are not actually preserved for CJK text.\r\n' +
        '\r\n' +
        '2. The example only clamps the offset inside the arrow handlers. If the content becomes shorter, or the terminal becomes wider after scrolling horizontally, the maximum changes but the existing offset stays out of range. The viewport can remain blank until another key press resets it. The current offset should be clamped whenever the measured maximum shrinks.\r\n' +
        '\r\n' +
        '3. The documented `content.height - clientHeight` calculation is only correct when the viewport has no padding. For example, a height-4 viewport with one row of top padding and height-4 content reports a maximum of 0, but the fourth row is clipped and needs an offset of 1. The simplest solution may be to explicitly say that padding belongs on the content wrapper, not the viewport, instead of expanding the measurement API to model padding.',
      reactions: [Object],
      performed_via_github_app: null,
      minimized: null
    }
  },
  public: true,
  created_at: '2026-08-12T11:15:08Z'
}
{
  id: '13162085177',
  type: 'ReleaseEvent',
  actor: {
    id: 170270,
    login: 'sindresorhus',
    display_login: 'sindresorhus',
    gravatar_id: '',
    url: 'https://api.github.com/users/sindresorhus',
    avatar_url: 'https://avatars.githubusercontent.com/u/170270?'
  },
  repo: {
    id: 15186239,
    name: 'sindresorhus/globals',
    url: 'https://api.github.com/repos/sindresorhus/globals'
  },
  payload: {
    action: 'published',
    release: {
      url: 'https://api.github.com/repos/sindresorhus/globals/releases/369177604',
      assets_url: 'https://api.github.com/repos/sindresorhus/globals/releases/369177604/assets',
      upload_url: 'https://uploads.github.com/repos/sindresorhus/globals/releases/369177604/assets{?name,label}',
      html_url: 'https://github.com/sindresorhus/globals/releases/tag/v17.11.0',
      id: 369177604,
      author: [Object],
      node_id: 'RE_kwDOAOe5P84WATQE',
      tag_name: 'v17.11.0',
      target_commitish: 'main',
      name: '',
      draft: false,
      immutable: false,
      prerelease: false,
      created_at: '2026-08-12T11:06:46Z',
      updated_at: '2026-08-12T11:06:57Z',
      published_at: '2026-08-12T11:06:57Z',
      assets: [],
      tarball_url: 'https://api.github.com/repos/sindresorhus/globals/tarball/v17.11.0',
      zipball_url: 'https://api.github.com/repos/sindresorhus/globals/zipball/v17.11.0',
      body: '- Add `react-native` globals (#337)  61eafbf\r\n' +
        '\r\n' +
        '---\r\n' +
        '\r\n' +
        'https://github.com/sindresorhus/globals/compare/v17.10.0...v17.11.0',
      reactions: [Object],
      short_description_html: '<ul>\n' +
        '<li>Add <code>react-native</code> globals (<a class="issue-link js-issue-link" data-error-text="Failed to load title" data-id="3975399064" data-permission-text="Title is private" data-url="https://github.com/sindresorhus/globals/issues/337" data-hovercard-type="pull_request" data-hovercard-url="/sindresorhus/globals/pull/337/hovercard" href="https://github.com/sindresorhus/globals/pull/337">#337</a>) <a class="commit-link" data-hovercard-type="commit" data-hovercard-url="https://github.com/sindresorhus/globals/commit/61eafbf105037079654824d883edc261834a0fbd/hovercard" href="https://github.com/sindresorhus/globals/commit/61eafbf105037079654824d883edc261834a0fbd"><tt>61eafbf</tt></a>\n' +
        '</li>\n' +
        '</ul>\n' +
        '<hr>\n' +
        '<p><a class="commit-link" href="https://github.com/sindresorhus/globals/compare/v17.10.0...v17.11.0"><tt>v17.10.0...v17.11.0</tt></a></p>',
      is_short_description_html_truncated: false
    }
  },
  public: true,
  created_at: '2026-08-12T11:06:57Z'
}
{
  id: '17475179083',
  type: 'PushEvent',
  actor: {
    id: 170270,
    login: 'sindresorhus',
    display_login: 'sindresorhus',
    gravatar_id: '',
    url: 'https://api.github.com/users/sindresorhus',
    avatar_url: 'https://avatars.githubusercontent.com/u/170270?'
  },
  repo: {
    id: 15186239,
    name: 'sindresorhus/globals',
    url: 'https://api.github.com/repos/sindresorhus/globals'
  },
  payload: {
    repository_id: 15186239,
    push_id: 39795221112,
    ref: 'refs/heads/main',
    head: '8c599278a68a0a6ea17b0c12f976f2270f70f391',
    before: '61eafbf105037079654824d883edc261834a0fbd'
  },
  public: true,
  created_at: '2026-08-12T11:06:54Z'
}
{
  id: '17474774864',
  type: 'PushEvent',
  actor: {
    id: 170270,
    login: 'sindresorhus',
    display_login: 'sindresorhus',
    gravatar_id: '',
    url: 'https://api.github.com/users/sindresorhus',
    avatar_url: 'https://avatars.githubusercontent.com/u/170270?'
  },
  repo: {
    id: 15186239,
    name: 'sindresorhus/globals',
    url: 'https://api.github.com/repos/sindresorhus/globals'
  },
  payload: {
    repository_id: 15186239,
    push_id: 39794815846,
    ref: 'refs/heads/main',
    head: '61eafbf105037079654824d883edc261834a0fbd',
    before: '7bed4af3730dcb5dbea4274b5264e6be4c4b8910'
  },
  public: true,
  created_at: '2026-08-12T11:00:44Z'
}
{
  id: '13160747613',
  type: 'IssueCommentEvent',
  actor: {
    id: 170270,
    login: 'sindresorhus',
    display_login: 'sindresorhus',
    gravatar_id: '',
    url: 'https://api.github.com/users/sindresorhus',
    avatar_url: 'https://avatars.githubusercontent.com/u/170270?'
  },
  repo: {
    id: 94061307,
    name: 'vadimdemedes/ink',
    url: 'https://api.github.com/repos/vadimdemedes/ink'
  },
  payload: {
    action: 'created',
    issue: {
      url: 'https://api.github.com/repos/vadimdemedes/ink/issues/989',
      repository_url: 'https://api.github.com/repos/vadimdemedes/ink',
      labels_url: 'https://api.github.com/repos/vadimdemedes/ink/issues/989/labels{/name}',
      comments_url: 'https://api.github.com/repos/vadimdemedes/ink/issues/989/comments',
      events_url: 'https://api.github.com/repos/vadimdemedes/ink/issues/989/events',
      html_url: 'https://github.com/vadimdemedes/ink/pull/989',
      id: 5125488076,
      node_id: 'PR_kwDOBZtC-879x3Nq',
      number: 989,
      title: 'Fix: restore terminal input modes when the process is continued (SIGC…',
      user: [Object],
      labels: [],
      state: 'closed',
      locked: false,
      assignees: [],
      milestone: null,
      comments: 3,
      created_at: '2026-08-11T23:20:42Z',
      updated_at: '2026-08-12T10:45:30Z',
      closed_at: '2026-08-11T23:45:55Z',
      assignee: null,
      active_lock_reason: null,
      draft: false,
      pull_request: [Object],
      body: '# Fix: restore terminal input modes when the process is continued (SIGCONT)\r\n' +
        '\r\n' +
        '## Written by me (the human author)\r\n' +
        '\r\n' +
        'Authored this PR with the help of Claude Code using Fable on medium effort. I did a red/green repro first of the actual problem I encountered in real life and then applied the fix from Fable.\r\n' +
        '\r\n' +
        "After I did a few human QA passes on the fix I got an adverserial review from a subagent, and after that another review asking it to review it based on the maintainer's perspective which seemed to give a good result.\r\n" +
        '\r\n' +
        'This solves an actual problem for me where I want to be able to stop a job with `kill -STOP` and resume it later without the raw mode bugging out on me.\r\n' +
        '\r\n' +
        'Repro steps:\r\n' +
        '\r\n' +
        '1. Start app.js with node\r\n' +
        '2. In another window take the pid given by app.js and run `kill -STOP 123456`\r\n' +
        '3. Go back to the app.js window, there are still escape sequences but running `fg` should bring up app.js again with the raw input mode working still.\r\n' +
        '\r\n' +
        'Repro application code:\r\n' +
        '\r\n' +
        '```js\r\n' +
        'import React, { useState, useEffect } from "react";\r\n' +
        'import { render, Box, Text, useInput, useStdout } from "ink";\r\n' +
        '\r\n' +
        '// SGR mouse tracking is enabled manually — ink has no mouse API, but any\r\n' +
        '// raw-mode TUI that consumes mouse input does exactly this.\r\n' +
        'function App() {\r\n' +
        '  const [eventCount, setEventCount] = useState(0);\r\n' +
        '  const [lastInput, setLastInput] = useState("");\r\n' +
        '  const { stdout } = useStdout();\r\n' +
        '\r\n' +
        '  useEffect(() => {\r\n' +
        '    stdout.write("\\u001B[?1002;1006h");\r\n' +
        '    return () => {\r\n' +
        '      stdout.write("\\u001B[?1002;1006l");\r\n' +
        '    };\r\n' +
        '  }, [stdout]);\r\n' +
        '\r\n' +
        '  useInput((input) => {\r\n' +
        '    setEventCount((count) => count + 1);\r\n' +
        '    // hex so raw escape bytes never appear on screen (the harness asserts\r\n' +
        '    // on-screen escape sequences only ever come from tty echo)\r\n' +
        '    setLastInput(Buffer.from(input).toString("hex"));\r\n' +
        '  });\r\n' +
        '\r\n' +
        '  return React.createElement(\r\n' +
        '    Box,\r\n' +
        '    { flexDirection: "column", borderStyle: "round", paddingX: 1 },\r\n' +
        '    React.createElement(Text, null, `pid: ${process.pid}`),\r\n' +
        '    React.createElement(Text, null, `input events: ${eventCount}`),\r\n' +
        '    React.createElement(Text, null, `last input: ${lastInput}`),\r\n' +
        '  );\r\n' +
        '}\r\n' +
        '\r\n' +
        'render(React.createElement(App));\r\n' +
        '```\r\n' +
        '\r\n' +
        '## Problem (rest of the description written by Claude)\r\n' +
        '\r\n' +
        'When an Ink app is stopped while running under a job-control shell — `kill -STOP <pid>`, or `kill -TSTP <pid>` sent externally — the shell notices the foreground job stopped, reclaims the terminal, and resets the tty to cooked mode (echo on, canonical input) so the user can type at the prompt.\r\n' +
        '\r\n' +
        "When the process is later continued, nothing restores Ink's terminal state. Ink still believes raw mode is enabled, but the kernel is echoing every byte: keystrokes and mouse escape sequences (`^[[<0;5;5M` …) print directly on screen, and `useInput` receives nothing. Crucially, **`fg` does not recover either** — the app is stuck in this broken state until restart. There is no reasonable app-level workaround: re-asserting raw mode requires defeating libuv's tty-mode cache, which isn't reachable through Ink's public API.\r\n" +
        '\r\n' +
        "Raw mode is state Ink owns, so re-asserting it when the kernel/shell clobbers it behind Ink's back belongs in Ink — the same way vim, less, and Node's readline re-assert terminal state on resume.\r\n" +
        '\r\n' +
        '## Solution\r\n' +
        '\r\n' +
        'A process-level `SIGCONT` listener that reinstates whatever input state the app still owns, then repaints:\r\n' +
        '\r\n' +
        "- **`src/components/App.tsx`** — new `restoreInputState()`, registered through the existing `onRegisterInputControl` channel alongside `pauseInput`/`resumeInput`. Unlike those (which serve `suspendTerminal()`'s deliberate teardown), it works off the live ref counts: nothing was torn down, the terminal was simply taken away. If components still own raw mode it toggles `setRawMode(false)` → `(true)` — the toggle is required because libuv caches the tty mode and treats a repeated enable as a no-op. Re-asserts bracketed paste if `usePaste` hooks are mounted. The toggle is try/catch-guarded: a tty fd gone bad while stopped must not crash the process from a signal handler.\r\n" +
        '- **`src/ink.tsx`** — a single module-level `SIGCONT` handler shared by all interactive instances (a `Set` registry, installed on first subscribe, removed on last), so instance count never scales `process` listeners — mirroring how signal-exit multiplexes exit handling. Per instance, `handleContinue` no-ops while unmounted/unmounting or while `suspendTerminal()` has intentionally handed the terminal to a child. Otherwise it restores input state, settles pending throttled writes, pops-then-re-pushes the kitty keyboard flags, and forces a full repaint over whatever the shell drew (job status lines, prompt, echoed input).\r\n' +
        '- **`src/log-update.ts`** — `reset()` now also clears the hidden-cursor flag, so the repaint re-hides a cursor the shell prompt made visible while the process was stopped. Its only other caller (`endSuspend`) reaches `reset()` after `log.done()` already cleared the flag, so behavior there is unchanged.\r\n' +
        '\r\n' +
        '### Notable details\r\n' +
        '\r\n' +
        "- **Kitty flags are popped before re-pushing.** Being stopped never pops the terminal-side stack (unlike the `suspendTerminal()` path, where `beginSuspend` pops first). A bare push would grow the stack by one entry per stop/continue cycle while unmount pops only once, leaving the user's shell receiving CSI-u sequences after exit. Popping an empty stack is defined as a no-op, so pop-then-push is safe in all cases.\r\n" +
        "- **Windows guard.** `SIGCONT` does not exist on Windows; the listener is only installed when `process.platform !== 'win32'`, and the tests skip themselves there.\r\n" +
        "- **Background-continue semantics are preserved, not fought.** If the process is continued in a _background_ process group (`kill -CONT` without `fg`), the `tcsetattr` raises `SIGTTOU` and the job stops again — standard job control. When the job is foregrounded with `fg`, the shell delivers `SIGCONT` again and the handler completes the restore. The alternative — ignoring `SIGTTOU` and forcing the tty from the background — would put the _user's shell_ into raw mode while they type at it, which is strictly worse.\r\n" +
        '- **Prior art, framed precisely:** Node\'s readline re-enables raw mode on `SIGCONT`, but via a transient `process.once` paired with its Ctrl-Z/SIGTSTP handling. This listener is persistent because `SIGSTOP` is uncatchable — there is no "suspend moment" to hook, which is also why the cache-defeating toggle is needed where readline needs none.\r\n' +
        '\r\n' +
        '### Scope\r\n' +
        '\r\n' +
        'This fixes externally delivered `SIGSTOP`/`SIGTSTP`. It does **not** make Ctrl-Z suspend work: under raw mode ISIG is off, so `^Z` arrives at `useInput` as `\\x1a` and never becomes a signal. Readline-style SIGTSTP handling (cooked mode, re-raise, re-arm on continue) is the symmetric other half of this feature and is proposed as a follow-up issue: <!-- link follow-up issue here -->\r\n' +
        '\r\n' +
        '## Tests\r\n' +
        '\r\n' +
        "`test/sigcont.tsx`, five tests using the existing `createStdout`/`createStdin` helpers and `process.emit('SIGCONT')`:\r\n" +
        '\r\n' +
        "1. raw mode owned by `useInput` is reinstated via the `[true, false, true]` toggle (the toggle _is_ the contract with libuv's cache, hence asserting the exact sequence);\r\n" +
        '2. bracketed paste, kitty pop-before-push ordering, cursor re-hide, and the repainted frame all appear in the post-SIGCONT writes;\r\n' +
        '3. no raw mode is enabled when nothing owns it;\r\n' +
        '4. the listener is removed on unmount;\r\n' +
        '5. multiple instances share a single process-level listener (count stays at +1, drops to baseline after the last unmount).\r\n' +
        '\r\n' +
        '## Manual QA\r\n' +
        '\r\n' +
        'Verified in a real terminal (Ghostty, zsh, Linux) with a minimal repro app (`useInput` + SGR mouse tracking), in both directions — the bug on vanilla v7.1.1, and the fix on this branch:\r\n' +
        '\r\n' +
        '| Sequence                              | v7.1.1                                             | this branch                                                                |\r\n' +
        '| ------------------------------------- | -------------------------------------------------- | -------------------------------------------------------------------------- |\r\n' +
        '| `kill -STOP` → `fg`                   | broken: cooked mode, input echoes, `useInput` dead | recovers fully                                                             |\r\n' +
        '| `kill -STOP` → `kill -CONT` → `fg`    | broken even after `fg`                             | recovers fully                                                             |\r\n' +
        '| `kill -STOP` → `kill -CONT` (no `fg`) | broken + escape codes leak into prompt             | job waits stopped (SIGTTOU); leak until `fg` — kernel semantics, see above |\r\n' +
        '\r\n' +
        '```mermaid\r\n' +
        'sequenceDiagram\r\n' +
        '    participant U as User (Ghostty)\r\n' +
        '    participant S as zsh (job control)\r\n' +
        '    participant K as Kernel (tty)\r\n' +
        '    participant A as Ink app\r\n' +
        '\r\n' +
        '    U->>A: node app.js\r\n' +
        '    A->>K: setRawMode(true), enable mouse tracking\r\n' +
        '    Note over A: mouse events counted, nothing echoes\r\n' +
        '\r\n' +
        '    U->>A: kill -STOP\r\n' +
        '    S->>K: reclaims tty, restores cooked mode\r\n' +
        '    Note over K: echo on, icanon on — app frozen, believes raw mode is on\r\n' +
        '\r\n' +
        '    U->>A: kill -CONT\r\n' +
        '    A->>K: SIGCONT handler: setRawMode toggle (tcsetattr)\r\n' +
        '    K-->>A: SIGTTOU (background process group) → job stops again\r\n' +
        '    Note over S: mouse escape codes echo at the prompt until fg\r\n' +
        '\r\n' +
        '    U->>S: fg\r\n' +
        '    S->>K: tcsetpgrp(app), sends SIGCONT\r\n' +
        '    A->>K: handler re-runs in foreground: raw mode + bracketed paste restored\r\n' +
        '    A->>U: kitty flags re-pushed, cursor re-hidden, full repaint\r\n' +
        '    Note over U: mouse events consumed again, nothing echoes\r\n' +
        '```\r\n' +
        '\r\n' +
        'The same sequence is automated in a tmux-based harness (interactive shell in a pty, SGR mouse bytes injected via `send-keys -H`, termios asserted with `stty -F <pane-tty>`, screen scraped with `capture-pane`): red on v7.1.1, green on this branch, under both zsh and bash.\r\n' +
        '\r\n' +
        'Full suite: 1058 tests pass (4 pre-existing known failures), typecheck and xo clean.\r\n',
      reactions: [Object],
      timeline_url: 'https://api.github.com/repos/vadimdemedes/ink/issues/989/timeline',
      performed_via_github_app: null,
      state_reason: null
    },
    comment: {
      url: 'https://api.github.com/repos/vadimdemedes/ink/issues/comments/5265665438',
      html_url: 'https://github.com/vadimdemedes/ink/pull/989#issuecomment-5265665438',
      issue_url: 'https://api.github.com/repos/vadimdemedes/ink/issues/989',
      id: 5265665438,
      node_id: 'IC_kwDOBZtC-88AAAABOdutng',
      user: [Object],
      created_at: '2026-08-12T10:45:30Z',
      updated_at: '2026-08-12T10:45:30Z',
      body: 'No deeper philosophy. Ink uses raw mode, so Ctrl+Z is app input rather than a terminal-generated SIGTSTP. Supporting it in core would mean reserving that input and taking ownership of process-wide job control and terminal lifecycle. I think that should remain opt-in at the application level, using useInput and suspendTerminal(), rather than implicit Ink behavior.',
      reactions: [Object],
      performed_via_github_app: null,
      minimized: null
    }
  },
  public: true,
  created_at: '2026-08-12T10:45:30Z'
}
{
  id: '13137151198',
  type: 'PullRequestEvent',
  actor: {
    id: 170270,
    login: 'sindresorhus',
    display_login: 'sindresorhus',
    gravatar_id: '',
    url: 'https://api.github.com/users/sindresorhus',
    avatar_url: 'https://avatars.githubusercontent.com/u/170270?'
  },
  repo: {
    id: 94061307,
    name: 'vadimdemedes/ink',
    url: 'https://api.github.com/repos/vadimdemedes/ink'
  },
  payload: {
    action: 'closed',
    number: 987,
    pull_request: {
      url: 'https://api.github.com/repos/vadimdemedes/ink/pulls/987',
      id: 4236535774,
      number: 987,
      head: [Object],
      base: [Object]
    }
  },
  public: true,
  created_at: '2026-08-08T23:54:52Z'
}
{
  id: '13137150726',
  type: 'IssuesEvent',
  actor: {
    id: 170270,
    login: 'sindresorhus',
    display_login: 'sindresorhus',
    gravatar_id: '',
    url: 'https://api.github.com/users/sindresorhus',
    avatar_url: 'https://avatars.githubusercontent.com/u/170270?'
  },
  repo: {
    id: 94061307,
    name: 'vadimdemedes/ink',
    url: 'https://api.github.com/repos/vadimdemedes/ink'
  },
  payload: {
    action: 'closed',
    issue: {
      url: 'https://api.github.com/repos/vadimdemedes/ink/issues/986',
      repository_url: 'https://api.github.com/repos/vadimdemedes/ink',
      labels_url: 'https://api.github.com/repos/vadimdemedes/ink/issues/986/labels{/name}',
      comments_url: 'https://api.github.com/repos/vadimdemedes/ink/issues/986/comments',
      events_url: 'https://api.github.com/repos/vadimdemedes/ink/issues/986/events',
      html_url: 'https://github.com/vadimdemedes/ink/issues/986',
      id: 5072993459,
      node_id: 'I_kwDOBZtC-88AAAABLl-8sw',
      number: 986,
      title: 'measureText / wrapText caches are unbounded and never evicted, leaking on every distinct string rendered',
      user: [Object],
      labels: [],
      state: 'closed',
      locked: false,
      assignees: [],
      milestone: null,
      comments: 1,
      created_at: '2026-08-05T16:20:12Z',
      updated_at: '2026-08-12T00:11:46Z',
      closed_at: '2026-08-12T00:11:46Z',
      assignee: null,
      active_lock_reason: null,
      sub_issues_summary: [Object],
      issue_dependencies_summary: [Object],
      body: '### Summary\n' +
        '\n' +
        '`measureText()` and `wrapText()` each keep a **module-level cache with no eviction**, keyed by the full text. Every distinct string an app ever renders is retained for the lifetime of the process, so any app whose text changes over time (a streaming/typing indicator, a growing log, a clock, a progress line) leaks monotonically until it OOMs.\n' +
        '\n' +
        'https://github.com/vadimdemedes/ink/blob/main/src/measure-text.ts — `const cache = new Map()`\n' +
        'https://github.com/vadimdemedes/ink/blob/main/src/wrap-text.ts — `const cache = {}`\n' +
        '\n' +
        'Both are fed from the Yoga measure function (`measureTextNode` in `dom.ts`), so entries are added on **every layout pass**, not only on writes — `renderThrottleMs` throttles stdout, not layout. A single text node can add up to 3 permanent entries per layout (`measureText(text)`, `wrapText(text, width)`, `measureText(wrappedText)`).\n' +
        '\n' +
        "> Not a duplicate of #869: that one was React's dev-mode `performance.measure()` entries piling up in Node's unbounded buffer (fixed by `NODE_ENV=production`, facebook/react#35761). The numbers below were measured **with `NODE_ENV=production`**, so React's contribution is excluded.\n" +
        '\n' +
        '### Measurements\n' +
        '\n' +
        'ink 7.1.1, node 24.15.0, `NODE_ENV=production`, retained heap = `heapUsed` delta after two forced `gc()` calls. Retention **survives `unmount()`**, which is what identifies it as module-level.\n' +
        '\n' +
        '| Rendered each frame (4,000 frames, 118 columns) | Retained |\n' +
        '|---|---|\n' +
        '| Text node whose content never changes (cache hits) | ~0.5 KB/frame |\n' +
        '| One ~100-character line, distinct every frame | **~1.7 KB/frame** |\n' +
        '| One 4,000-character `<Text wrap="truncate-end">`, distinct every frame | **~17.8 KB/frame** |\n' +
        '\n' +
        'At a modest 10 renders/s, the 4,000-character case is ~178 KB/s ≈ **640 MB/hour**. Note the worst case is `wrap="truncate-end"`: only ~118 cells are ever displayed, but the cache key is the whole 4,000-character string.\n' +
        '\n' +
        "Real-world impact: this was one of two leaks that made [codiva](https://github.com/takecchi/codiva) (a TUI that streams assistant output) die with `Allocation failed - JavaScript heap out of memory` after a day of use. Node's diagnostic report showed `old_space` at 4.2 GB with `large_object_space` at only 55 MB — i.e. millions of small retained objects (the cache keys and value objects), not one big allocation.\n" +
        '\n' +
        '### Reproduction\n' +
        '\n' +
        '```js\n' +
        '// leak.mjs — node --expose-gc leak.mjs\n' +
        "import {PassThrough} from 'node:stream';\n" +
        "import React from 'react';\n" +
        "import {render, Box, Text} from 'ink';\n" +
        '\n' +
        'const used = () => {globalThis.gc(); globalThis.gc(); return process.memoryUsage().heapUsed};\n' +
        'const mb = n => `${(n / 1024 / 1024).toFixed(1)}MB`;\n' +
        '\n' +
        'const stdout = new PassThrough();\n' +
        'stdout.columns = 120;\n' +
        'stdout.rows = 40;\n' +
        "stdout.on('data', () => {});\n" +
        '\n' +
        'const view = n => React.createElement(\n' +
        "  Box, {flexDirection: 'column', width: 118},\n" +
        "  React.createElement(Text, {wrap: 'truncate-end'}, `${n} ${'x'.repeat(3994)}`),\n" +
        ');\n' +
        '\n' +
        'const instance = render(view(0), {stdout, stdin: new PassThrough(), patchConsole: false});\n' +
        'const base = used();\n' +
        'for (let n = 1; n <= 4000; n++) {\n' +
        '  instance.rerender(view(n));\n' +
        '  await new Promise(r => setImmediate(r));\n' +
        '}\n' +
        "console.log('retained while mounted:', mb(used() - base));\n" +
        'instance.unmount();\n' +
        "console.log('retained after unmount:', mb(used() - base)); // ~the same → module-level\n" +
        '```\n' +
        '\n' +
        '```\n' +
        'retained while mounted: 46.4MB\n' +
        'retained after unmount: 46.2MB\n' +
        '```\n' +
        '\n' +
        '### Suggested fix\n' +
        '\n' +
        'Bound both caches — an LRU with a modest entry cap would keep the hit rate for the stable parts of a UI (they are touched every layout, so they stay warm) while making retention proportional to the visible UI instead of to everything ever rendered. Something like:\n' +
        '\n' +
        '```js\n' +
        'const CACHE_LIMIT = 4096;\n' +
        'const cache = new Map();\n' +
        '\n' +
        'const remember = (key, value) => {\n' +
        '  if (cache.size >= CACHE_LIMIT) {\n' +
        '    cache.delete(cache.keys().next().value); // oldest first (insertion order)\n' +
        '  }\n' +
        '  cache.set(key, value);\n' +
        '};\n' +
        '```\n' +
        '\n' +
        'Refreshing an entry on read (`delete` + `set`) makes it a true LRU, which matters when the number of live text nodes approaches the cap.\n' +
        '\n' +
        'Happy to open a PR if that direction looks right.\n' +
        '\n' +
        '### Workaround for app authors\n' +
        '\n' +
        'Don\'t hand Ink a long string that changes every frame: slice it to the width you actually display *before* rendering. `wrap="truncate-end"` does not help, because the cache key is the pre-truncation string. In codiva\'s case, clipping the streaming preview line to the display width cut it from 6,786 to 3,129 B/frame — and once the line exceeds the width the string stops changing, so it starts hitting the cache instead.\n' +
        '\n' +
        '### Environment\n' +
        '\n' +
        '- ink 7.1.1\n' +
        '- node 24.15.0 (also reproduced on 22.22.3)\n' +
        '- macOS 15 (Darwin 24.5.0), Ghostty\n',
      reactions: [Object],
      timeline_url: 'https://api.github.com/repos/vadimdemedes/ink/issues/986/timeline',
      performed_via_github_app: null,
      state_reason: 'completed',
      pinned_comment: null
    }
  },
  public: true,
  created_at: '2026-08-12T00:11:47Z'
}
{
  id: '17436504046',
  type: 'PushEvent',
  actor: {
    id: 170270,
    login: 'sindresorhus',
    display_login: 'sindresorhus',
    gravatar_id: '',
    url: 'https://api.github.com/users/sindresorhus',
    avatar_url: 'https://avatars.githubusercontent.com/u/170270?'
  },
  repo: {
    id: 94061307,
    name: 'vadimdemedes/ink',
    url: 'https://api.github.com/repos/vadimdemedes/ink'
  },
  payload: {
    repository_id: 94061307,
    push_id: 39754736087,
    ref: 'refs/heads/master',
    head: 'ad9e3ea430acd3411be1c7578a2859f810a848ec',
    before: 'eb82d8f057484b029020e4b3227eed263a53c076'
  },
  public: true,
  created_at: '2026-08-12T00:11:46Z'
}
{
  id: '13136761926',
  type: 'IssueCommentEvent',
  actor: {
    id: 170270,
    login: 'sindresorhus',
    display_login: 'sindresorhus',
    gravatar_id: '',
    url: 'https://api.github.com/users/sindresorhus',
    avatar_url: 'https://avatars.githubusercontent.com/u/170270?'
  },
  repo: {
    id: 94061307,
    name: 'vadimdemedes/ink',
    url: 'https://api.github.com/repos/vadimdemedes/ink'
  },
  payload: {
    action: 'created',
    issue: {
      url: 'https://api.github.com/repos/vadimdemedes/ink/issues/988',
      repository_url: 'https://api.github.com/repos/vadimdemedes/ink',
      labels_url: 'https://api.github.com/repos/vadimdemedes/ink/issues/988/labels{/name}',
      comments_url: 'https://api.github.com/repos/vadimdemedes/ink/issues/988/comments',
      events_url: 'https://api.github.com/repos/vadimdemedes/ink/issues/988/events',
      html_url: 'https://github.com/vadimdemedes/ink/pull/988',
      id: 5103525397,
      node_id: 'PR_kwDOBZtC-878rZm3',
      number: 988,
      title: 'Add scrolling primitives: `contentOffsetX`/`contentOffsetY` props and client/scroll size metrics',
      user: [Object],
      labels: [],
      state: 'open',
      locked: false,
      assignees: [],
      milestone: null,
      comments: 2,
      created_at: '2026-08-09T16:21:38Z',
      updated_at: '2026-08-12T14:17:18Z',
      closed_at: null,
      assignee: null,
      active_lock_reason: null,
      draft: false,
      pull_request: [Object],
      body: 'This implements the scrolling primitives sketched in #765, following the direction there: core primitives only, so a `ScrollView` can be built in userland (example included in the readme).\n' +
        '\n' +
        '- `contentOffsetX` / `contentOffsetY` props on `Box`. Children are shifted left/up by the given number of columns/rows at render time. Combined with `overflow="hidden"`, this is the scroll mechanism. Layout is untouched, the offset is applied in `renderNodeToOutput` when recursing into children, so Yoga sees nothing new.\n' +
        '- `measureElement()` now also returns `clientWidth`/`clientHeight` (size excluding borders) and `scrollWidth`/`scrollHeight` (content extent including overflow, computed from child layout extents and clamped to be at least the client size, matching DOM semantics). These extend the `x`/`y`/`width`/`height` shape from #968.\n' +
        '- `useBoxMetrics()` returns the same four new fields, so a userland ScrollView can be fully reactive to content changes via the existing layout listener.\n' +
        '- The readme ScrollView recipe (and the runnable `examples/scroll`) wrap the content in a `flexShrink={0}` container. Without it, Yoga squeezes the children into the fixed-height viewport and there is nothing to scroll; the recipe notes this explicitly since it is the first thing anyone building a ScrollView will hit.\n' +
        '\n' +
        "One deliberate divergence from the snippet in #765: child extents are measured relative to the inside of the container's border (parent border offsets are subtracted), so `scrollWidth === clientWidth` when content exactly fits a bordered box. The issue snippet measured against the outer edge, which over-reports the scroll extent by the border width.\n" +
        '\n' +
        'Deliberately not included, per the discussion in #765: scrollbars, overflow indicators, an imperative scroll API, and any built-in `ScrollView` component. Offsets are also not clamped to the content extent, clamping policy belongs to the userland component (the readme example clamps via `scrollHeight - clientHeight`).\n' +
        '\n' +
        'Tests: rendering tests for vertical/horizontal offsets, offsets inside borders, nested offset containers, offset beyond content, and a zero-offset behavior lock; metric tests for client/scroll sizes with overflowing content, borders, and content that grows after mount. All fail on `master` without the change (except the behavior lock). Verified manually in a real terminal with the included example (both axes, clamping at all edges).\n' +
        '\n' +
        'Also relevant to #222.\n',
      reactions: [Object],
      timeline_url: 'https://api.github.com/repos/vadimdemedes/ink/issues/988/timeline',
      performed_via_github_app: null,
      state_reason: null
    },
    comment: {
      url: 'https://api.github.com/repos/vadimdemedes/ink/issues/comments/5260277204',
      html_url: 'https://github.com/vadimdemedes/ink/pull/988#issuecomment-5260277204',
      issue_url: 'https://api.github.com/repos/vadimdemedes/ink/issues/988',
      id: 5260277204,
      node_id: 'IC_kwDOBZtC-88AAAABOYl11A',
      user: [Object],
      created_at: '2026-08-11T23:59:35Z',
      updated_at: '2026-08-11T23:59:35Z',
      body: 'Overall, I think the direction makes sense. Keeping scrolling in userland and adding only render offsets plus measurement primitives feels like the right boundary.\r\n' +
        '\r\n' +
        'I manually tested this and found two things that should be fixed before merging:\r\n' +
        '\r\n' +
        '1. Nested clipping is broken when an offset is applied. If the scrolled content contains another overflow-hidden box, the inner clip replaces the outer clip instead of intersecting it. Content can then escape the viewport and overwrite surrounding UI. In my test, a line above the scroll view was replaced by the first clipped line. This is an existing renderer bug, but this PR makes it reachable through the normal documented scrolling path and currently claims that nested offsets compose. I think clips should be intersected, or nested clipped content needs to be explicitly unsupported and the composition test removed.\r\n' +
        '\r\n' +
        '2. Offsets accept any number, but fractional values are passed directly into terminal cell coordinates. A vertical offset of 0.5 dropped one of two rendered lines, and negative fractions can erase the content entirely. These should be finite integer column/row values, normalized once at the render boundary, with tests for both axes.\r\n' +
        '\r\n' +
        'I am less convinced that scrollWidth and scrollHeight should try to emulate the DOM. The current calculation only looks at direct child boxes and their positive right/bottom edges, so it does not actually have DOM semantics. Recursively handling descendant overflow, reverse layouts, nested clips, negative origins, and padding would add quite a lot of complexity.\r\n' +
        '\r\n' +
        'The simpler option is to keep clientWidth/clientHeight, require the nonshrinking content wrapper that the example already uses, and measure that wrapper with a seperate useBoxMetrics ref. The maximum offset is then content.width - viewport.clientWidth (and the same for height). That makes the supported boundary explicit and avoids maintaining a partial browser scrolling model. I would prefer removing scrollWidth/scrollHeight and using that approach. If those fields stay, their docs should at least describe the narrower direct-child, normal-flow contract instead of claiming total DOM-like content size.\r\n' +
        '\r\n' +
        'One small nonblocking cleanup: useBoxMetrics currently spreads the complete measureElement result, so x and y are present at runtime even though they are not part of its return type. Explicitly selecting the intended fields would keep the runtime shape and change detection consistent.',
      reactions: [Object],
      performed_via_github_app: null,
      minimized: null
    }
  },
  public: true,
  created_at: '2026-08-11T23:59:35Z'
}
{
  id: '13136342396',
  type: 'PullRequestEvent',
  actor: {
    id: 170270,
    login: 'sindresorhus',
    display_login: 'sindresorhus',
    gravatar_id: '',
    url: 'https://api.github.com/users/sindresorhus',
    avatar_url: 'https://avatars.githubusercontent.com/u/170270?'
  },
  repo: {
    id: 94061307,
    name: 'vadimdemedes/ink',
    url: 'https://api.github.com/repos/vadimdemedes/ink'
  },
  payload: {
    action: 'closed',
    number: 989,
    pull_request: {
      url: 'https://api.github.com/repos/vadimdemedes/ink/pulls/989',
      id: 4257706858,
      number: 989,
      head: [Object],
      base: [Object]
    }
  },
  public: true,
  created_at: '2026-08-11T23:20:42Z'
}
{
  id: '13136342136',
  type: 'IssueCommentEvent',
  actor: {
    id: 170270,
    login: 'sindresorhus',
    display_login: 'sindresorhus',
    gravatar_id: '',
    url: 'https://api.github.com/users/sindresorhus',
    avatar_url: 'https://avatars.githubusercontent.com/u/170270?'
  },
  repo: {
    id: 94061307,
    name: 'vadimdemedes/ink',
    url: 'https://api.github.com/repos/vadimdemedes/ink'
  },
  payload: {
    action: 'created',
    issue: {
      url: 'https://api.github.com/repos/vadimdemedes/ink/issues/989',
      repository_url: 'https://api.github.com/repos/vadimdemedes/ink',
      labels_url: 'https://api.github.com/repos/vadimdemedes/ink/issues/989/labels{/name}',
      comments_url: 'https://api.github.com/repos/vadimdemedes/ink/issues/989/comments',
      events_url: 'https://api.github.com/repos/vadimdemedes/ink/issues/989/events',
      html_url: 'https://github.com/vadimdemedes/ink/pull/989',
      id: 5125488076,
      node_id: 'PR_kwDOBZtC-879x3Nq',
      number: 989,
      title: 'Fix: restore terminal input modes when the process is continued (SIGC…',
      user: [Object],
      labels: [],
      state: 'closed',
      locked: false,
      assignees: [],
      milestone: null,
      comments: 3,
      created_at: '2026-08-11T23:20:42Z',
      updated_at: '2026-08-12T10:45:30Z',
      closed_at: '2026-08-11T23:45:55Z',
      assignee: null,
      active_lock_reason: null,
      draft: false,
      pull_request: [Object],
      body: '# Fix: restore terminal input modes when the process is continued (SIGCONT)\r\n' +
        '\r\n' +
        '## Written by me (the human author)\r\n' +
        '\r\n' +
        'Authored this PR with the help of Claude Code using Fable on medium effort. I did a red/green repro first of the actual problem I encountered in real life and then applied the fix from Fable.\r\n' +
        '\r\n' +
        "After I did a few human QA passes on the fix I got an adverserial review from a subagent, and after that another review asking it to review it based on the maintainer's perspective which seemed to give a good result.\r\n" +
        '\r\n' +
        'This solves an actual problem for me where I want to be able to stop a job with `kill -STOP` and resume it later without the raw mode bugging out on me.\r\n' +
        '\r\n' +
        'Repro steps:\r\n' +
        '\r\n' +
        '1. Start app.js with node\r\n' +
        '2. In another window take the pid given by app.js and run `kill -STOP 123456`\r\n' +
        '3. Go back to the app.js window, there are still escape sequences but running `fg` should bring up app.js again with the raw input mode working still.\r\n' +
        '\r\n' +
        'Repro application code:\r\n' +
        '\r\n' +
        '```js\r\n' +
        'import React, { useState, useEffect } from "react";\r\n' +
        'import { render, Box, Text, useInput, useStdout } from "ink";\r\n' +
        '\r\n' +
        '// SGR mouse tracking is enabled manually — ink has no mouse API, but any\r\n' +
        '// raw-mode TUI that consumes mouse input does exactly this.\r\n' +
        'function App() {\r\n' +
        '  const [eventCount, setEventCount] = useState(0);\r\n' +
        '  const [lastInput, setLastInput] = useState("");\r\n' +
        '  const { stdout } = useStdout();\r\n' +
        '\r\n' +
        '  useEffect(() => {\r\n' +
        '    stdout.write("\\u001B[?1002;1006h");\r\n' +
        '    return () => {\r\n' +
        '      stdout.write("\\u001B[?1002;1006l");\r\n' +
        '    };\r\n' +
        '  }, [stdout]);\r\n' +
        '\r\n' +
        '  useInput((input) => {\r\n' +
        '    setEventCount((count) => count + 1);\r\n' +
        '    // hex so raw escape bytes never appear on screen (the harness asserts\r\n' +
        '    // on-screen escape sequences only ever come from tty echo)\r\n' +
        '    setLastInput(Buffer.from(input).toString("hex"));\r\n' +
        '  });\r\n' +
        '\r\n' +
        '  return React.createElement(\r\n' +
        '    Box,\r\n' +
        '    { flexDirection: "column", borderStyle: "round", paddingX: 1 },\r\n' +
        '    React.createElement(Text, null, `pid: ${process.pid}`),\r\n' +
        '    React.createElement(Text, null, `input events: ${eventCount}`),\r\n' +
        '    React.createElement(Text, null, `last input: ${lastInput}`),\r\n' +
        '  );\r\n' +
        '}\r\n' +
        '\r\n' +
        'render(React.createElement(App));\r\n' +
        '```\r\n' +
        '\r\n' +
        '## Problem (rest of the description written by Claude)\r\n' +
        '\r\n' +
        'When an Ink app is stopped while running under a job-control shell — `kill -STOP <pid>`, or `kill -TSTP <pid>` sent externally — the shell notices the foreground job stopped, reclaims the terminal, and resets the tty to cooked mode (echo on, canonical input) so the user can type at the prompt.\r\n' +
        '\r\n' +
        "When the process is later continued, nothing restores Ink's terminal state. Ink still believes raw mode is enabled, but the kernel is echoing every byte: keystrokes and mouse escape sequences (`^[[<0;5;5M` …) print directly on screen, and `useInput` receives nothing. Crucially, **`fg` does not recover either** — the app is stuck in this broken state until restart. There is no reasonable app-level workaround: re-asserting raw mode requires defeating libuv's tty-mode cache, which isn't reachable through Ink's public API.\r\n" +
        '\r\n' +
        "Raw mode is state Ink owns, so re-asserting it when the kernel/shell clobbers it behind Ink's back belongs in Ink — the same way vim, less, and Node's readline re-assert terminal state on resume.\r\n" +
        '\r\n' +
        '## Solution\r\n' +
        '\r\n' +
        'A process-level `SIGCONT` listener that reinstates whatever input state the app still owns, then repaints:\r\n' +
        '\r\n' +
        "- **`src/components/App.tsx`** — new `restoreInputState()`, registered through the existing `onRegisterInputControl` channel alongside `pauseInput`/`resumeInput`. Unlike those (which serve `suspendTerminal()`'s deliberate teardown), it works off the live ref counts: nothing was torn down, the terminal was simply taken away. If components still own raw mode it toggles `setRawMode(false)` → `(true)` — the toggle is required because libuv caches the tty mode and treats a repeated enable as a no-op. Re-asserts bracketed paste if `usePaste` hooks are mounted. The toggle is try/catch-guarded: a tty fd gone bad while stopped must not crash the process from a signal handler.\r\n" +
        '- **`src/ink.tsx`** — a single module-level `SIGCONT` handler shared by all interactive instances (a `Set` registry, installed on first subscribe, removed on last), so instance count never scales `process` listeners — mirroring how signal-exit multiplexes exit handling. Per instance, `handleContinue` no-ops while unmounted/unmounting or while `suspendTerminal()` has intentionally handed the terminal to a child. Otherwise it restores input state, settles pending throttled writes, pops-then-re-pushes the kitty keyboard flags, and forces a full repaint over whatever the shell drew (job status lines, prompt, echoed input).\r\n' +
        '- **`src/log-update.ts`** — `reset()` now also clears the hidden-cursor flag, so the repaint re-hides a cursor the shell prompt made visible while the process was stopped. Its only other caller (`endSuspend`) reaches `reset()` after `log.done()` already cleared the flag, so behavior there is unchanged.\r\n' +
        '\r\n' +
        '### Notable details\r\n' +
        '\r\n' +
        "- **Kitty flags are popped before re-pushing.** Being stopped never pops the terminal-side stack (unlike the `suspendTerminal()` path, where `beginSuspend` pops first). A bare push would grow the stack by one entry per stop/continue cycle while unmount pops only once, leaving the user's shell receiving CSI-u sequences after exit. Popping an empty stack is defined as a no-op, so pop-then-push is safe in all cases.\r\n" +
        "- **Windows guard.** `SIGCONT` does not exist on Windows; the listener is only installed when `process.platform !== 'win32'`, and the tests skip themselves there.\r\n" +
        "- **Background-continue semantics are preserved, not fought.** If the process is continued in a _background_ process group (`kill -CONT` without `fg`), the `tcsetattr` raises `SIGTTOU` and the job stops again — standard job control. When the job is foregrounded with `fg`, the shell delivers `SIGCONT` again and the handler completes the restore. The alternative — ignoring `SIGTTOU` and forcing the tty from the background — would put the _user's shell_ into raw mode while they type at it, which is strictly worse.\r\n" +
        '- **Prior art, framed precisely:** Node\'s readline re-enables raw mode on `SIGCONT`, but via a transient `process.once` paired with its Ctrl-Z/SIGTSTP handling. This listener is persistent because `SIGSTOP` is uncatchable — there is no "suspend moment" to hook, which is also why the cache-defeating toggle is needed where readline needs none.\r\n' +
        '\r\n' +
        '### Scope\r\n' +
        '\r\n' +
        'This fixes externally delivered `SIGSTOP`/`SIGTSTP`. It does **not** make Ctrl-Z suspend work: under raw mode ISIG is off, so `^Z` arrives at `useInput` as `\\x1a` and never becomes a signal. Readline-style SIGTSTP handling (cooked mode, re-raise, re-arm on continue) is the symmetric other half of this feature and is proposed as a follow-up issue: <!-- link follow-up issue here -->\r\n' +
        '\r\n' +
        '## Tests\r\n' +
        '\r\n' +
        "`test/sigcont.tsx`, five tests using the existing `createStdout`/`createStdin` helpers and `process.emit('SIGCONT')`:\r\n" +
        '\r\n' +
        "1. raw mode owned by `useInput` is reinstated via the `[true, false, true]` toggle (the toggle _is_ the contract with libuv's cache, hence asserting the exact sequence);\r\n" +
        '2. bracketed paste, kitty pop-before-push ordering, cursor re-hide, and the repainted frame all appear in the post-SIGCONT writes;\r\n' +
        '3. no raw mode is enabled when nothing owns it;\r\n' +
        '4. the listener is removed on unmount;\r\n' +
        '5. multiple instances share a single process-level listener (count stays at +1, drops to baseline after the last unmount).\r\n' +
        '\r\n' +
        '## Manual QA\r\n' +
        '\r\n' +
        'Verified in a real terminal (Ghostty, zsh, Linux) with a minimal repro app (`useInput` + SGR mouse tracking), in both directions — the bug on vanilla v7.1.1, and the fix on this branch:\r\n' +
        '\r\n' +
        '| Sequence                              | v7.1.1                                             | this branch                                                                |\r\n' +
        '| ------------------------------------- | -------------------------------------------------- | -------------------------------------------------------------------------- |\r\n' +
        '| `kill -STOP` → `fg`                   | broken: cooked mode, input echoes, `useInput` dead | recovers fully                                                             |\r\n' +
        '| `kill -STOP` → `kill -CONT` → `fg`    | broken even after `fg`                             | recovers fully                                                             |\r\n' +
        '| `kill -STOP` → `kill -CONT` (no `fg`) | broken + escape codes leak into prompt             | job waits stopped (SIGTTOU); leak until `fg` — kernel semantics, see above |\r\n' +
        '\r\n' +
        '```mermaid\r\n' +
        'sequenceDiagram\r\n' +
        '    participant U as User (Ghostty)\r\n' +
        '    participant S as zsh (job control)\r\n' +
        '    participant K as Kernel (tty)\r\n' +
        '    participant A as Ink app\r\n' +
        '\r\n' +
        '    U->>A: node app.js\r\n' +
        '    A->>K: setRawMode(true), enable mouse tracking\r\n' +
        '    Note over A: mouse events counted, nothing echoes\r\n' +
        '\r\n' +
        '    U->>A: kill -STOP\r\n' +
        '    S->>K: reclaims tty, restores cooked mode\r\n' +
        '    Note over K: echo on, icanon on — app frozen, believes raw mode is on\r\n' +
        '\r\n' +
        '    U->>A: kill -CONT\r\n' +
        '    A->>K: SIGCONT handler: setRawMode toggle (tcsetattr)\r\n' +
        '    K-->>A: SIGTTOU (background process group) → job stops again\r\n' +
        '    Note over S: mouse escape codes echo at the prompt until fg\r\n' +
        '\r\n' +
        '    U->>S: fg\r\n' +
        '    S->>K: tcsetpgrp(app), sends SIGCONT\r\n' +
        '    A->>K: handler re-runs in foreground: raw mode + bracketed paste restored\r\n' +
        '    A->>U: kitty flags re-pushed, cursor re-hidden, full repaint\r\n' +
        '    Note over U: mouse events consumed again, nothing echoes\r\n' +
        '```\r\n' +
        '\r\n' +
        'The same sequence is automated in a tmux-based harness (interactive shell in a pty, SGR mouse bytes injected via `send-keys -H`, termios asserted with `stty -F <pane-tty>`, screen scraped with `capture-pane`): red on v7.1.1, green on this branch, under both zsh and bash.\r\n' +
        '\r\n' +
        'Full suite: 1058 tests pass (4 pre-existing known failures), typecheck and xo clean.\r\n',
      reactions: [Object],
      timeline_url: 'https://api.github.com/repos/vadimdemedes/ink/issues/989/timeline',
      performed_via_github_app: null,
      state_reason: null
    },
    comment: {
      url: 'https://api.github.com/repos/vadimdemedes/ink/issues/comments/5260187572',
      html_url: 'https://github.com/vadimdemedes/ink/pull/989#issuecomment-5260187572',
      issue_url: 'https://api.github.com/repos/vadimdemedes/ink/issues/989',
      id: 5260187572,
      node_id: 'IC_kwDOBZtC-88AAAABOYgXtA',
      user: [Object],
      created_at: '2026-08-11T23:45:55Z',
      updated_at: '2026-08-11T23:45:55Z',
      body: "I don't think we should add this to Ink. It introduces process-global signal and terminal lifecycle handling for a rare external SIGSTOP workflow, while normal Ctrl+Z remains unsupported. It also redraws from a background SIGCONT when no raw mode is owned, which can corrupt the foreground shell, and the repaint loses an active useCursor position. I think externally delivered STOP/CONT should remain unsupported, with `suspendTerminal()` as the explicit supported handoff.",
      reactions: [Object],
      performed_via_github_app: null,
      minimized: null
    }
  },
  public: true,
  created_at: '2026-08-11T23:45:55Z'
}
{
  id: '13136241076',
  type: 'PullRequestEvent',
  actor: {
    id: 170270,
    login: 'sindresorhus',
    display_login: 'sindresorhus',
    gravatar_id: '',
    url: 'https://api.github.com/users/sindresorhus',
    avatar_url: 'https://avatars.githubusercontent.com/u/170270?'
  },
  repo: {
    id: 94061307,
    name: 'vadimdemedes/ink',
    url: 'https://api.github.com/repos/vadimdemedes/ink'
  },
  payload: {
    action: 'closed',
    number: 981,
    pull_request: {
      url: 'https://api.github.com/repos/vadimdemedes/ink/pulls/981',
      id: 4164279440,
      number: 981,
      head: [Object],
      base: [Object]
    }
  },
  public: true,
  created_at: '2026-08-11T23:37:41Z'
}
{
  id: '17435255574',
  type: 'PushEvent',
  actor: {
    id: 170270,
    login: 'sindresorhus',
    display_login: 'sindresorhus',
    gravatar_id: '',
    url: 'https://api.github.com/users/sindresorhus',
    avatar_url: 'https://avatars.githubusercontent.com/u/170270?'
  },
  repo: {
    id: 94061307,
    name: 'vadimdemedes/ink',
    url: 'https://api.github.com/repos/vadimdemedes/ink'
  },
  payload: {
    repository_id: 94061307,
    push_id: 39753487258,
    ref: 'refs/heads/master',
    head: 'eb82d8f057484b029020e4b3227eed263a53c076',
    before: 'cdc18fa4942b580cda13304545cc2cf18fdde9b8'
  },
  public: true,
  created_at: '2026-08-11T23:42:38Z'
}
{
  id: '13136069719',
  type: 'IssueCommentEvent',
  actor: {
    id: 170270,
    login: 'sindresorhus',
    display_login: 'sindresorhus',
    gravatar_id: '',
    url: 'https://api.github.com/users/sindresorhus',
    avatar_url: 'https://avatars.githubusercontent.com/u/170270?'
  },
  repo: {
    id: 94061307,
    name: 'vadimdemedes/ink',
    url: 'https://api.github.com/repos/vadimdemedes/ink'
  },
  payload: {
    action: 'created',
    issue: {
      url: 'https://api.github.com/repos/vadimdemedes/ink/issues/981',
      repository_url: 'https://api.github.com/repos/vadimdemedes/ink',
      labels_url: 'https://api.github.com/repos/vadimdemedes/ink/issues/981/labels{/name}',
      comments_url: 'https://api.github.com/repos/vadimdemedes/ink/issues/981/comments',
      events_url: 'https://api.github.com/repos/vadimdemedes/ink/issues/981/events',
      html_url: 'https://github.com/vadimdemedes/ink/pull/981',
      id: 5013735442,
      node_id: 'PR_kwDOBZtC-874NdyQ',
      number: 981,
      title: 'Fix: Accept capture streams in `RenderOptions` without a type assertion',
      user: [Object],
      labels: [],
      state: 'closed',
      locked: false,
      assignees: [],
      milestone: null,
      comments: 2,
      created_at: '2026-07-29T21:28:17Z',
      updated_at: '2026-08-11T23:42:38Z',
      closed_at: '2026-08-11T23:42:38Z',
      assignee: null,
      active_lock_reason: null,
      draft: false,
      pull_request: [Object],
      body: 'Ink can already render somewhere other than a terminal. `debug: true` exists for it, `ink-testing-library` is built on it, and the readme documents `stdout` as a `stream.Writable`. The types are the only thing standing in the way.\n' +
        '\n' +
        '## The problem\n' +
        '\n' +
        "`RenderOptions` asks for `NodeJS.WriteStream` and `NodeJS.ReadStream`. Those are `tty.WriteStream` and `tty.ReadStream`, which extend `net.Socket` — around 90 members each, from `cursorTo` and `moveCursor` to `remoteAddress` and `setNoDelay`. So the moment you want to capture output instead of printing it, you're stuck:\n" +
        '\n' +
        '```ts\n' +
        'const output: string[] = [];\n' +
        '\n' +
        'const sink = {\n' +
        '\tcolumns: 80,\n' +
        '\twrite(data: string) {\n' +
        '\t\toutput.push(data);\n' +
        '\t},\n' +
        '};\n' +
        '\n' +
        'render(<App />, {stdout: sink, debug: true});\n' +
        "// ✗ error TS2740: Type '{ columns: number; write(data: string): void; }' is missing\n" +
        "//   the following properties from type 'WriteStream': clearLine, clearScreenDown,\n" +
        '//   cursorTo, moveCursor, and 97 more.\n' +
        '```\n' +
        '\n' +
        'The way around it today is to assert the type away:\n' +
        '\n' +
        '```ts\n' +
        'render(<App />, {stdout: sink as unknown as NodeJS.WriteStream});\n' +
        '```\n' +
        '\n' +
        "That's not a small thing to ask. `as unknown as` doesn't just permit this object, it switches off type checking for that value entirely — including future mistakes that genuinely matter, like getting `write`'s shape wrong. It also can't be used at all in codebases that ban the pattern by lint rule, which puts a documented Ink feature out of reach for them.\n" +
        '\n' +
        "And Ink's own code has to do it. `ink-testing-library` casts internally. So does this repository:\n" +
        '\n' +
        '```ts\n' +
        '// test/helpers/create-stdout.ts\n' +
        'const stdout = new EventEmitter() as unknown as FakeStdout;\n' +
        '\n' +
        '// test/render.tsx\n' +
        'const stdout = new PassThrough() as unknown as NodeJS.WriteStream;\n' +
        '```\n' +
        '\n' +
        "When the companion package and the library's own tests both have to lie to the compiler to use a supported feature, the type is the thing that's wrong.\n" +
        '\n' +
        '## What Ink actually needs\n' +
        '\n' +
        'Before designing anything I checked what Ink really touches, from the compiled output:\n' +
        '\n' +
        '```\n' +
        '$ grep -ohE "stdout\\.[a-zA-Z_]+" build/*.js build/components/*.js build/hooks/*.js | sort -u\n' +
        'columns  destroyed  isTTY  off  on  writable  writableEnded  writableLength  write  _writableState\n' +
        '\n' +
        '$ grep -ohE "stdin\\.[a-zA-Z_]+"  build/*.js build/components/*.js build/hooks/*.js | sort -u\n' +
        'addListener  isTTY  on  read  ref  removeListener  setEncoding  setRawMode  unref  unshift\n' +
        '```\n' +
        '\n' +
        'Ten members out of ninety, and most of them conditional:\n' +
        '\n' +
        '- `write()` is the only one always used.\n' +
        '- The other output members are already read defensively — `getWritableStreamState()` does `!stdout.destroyed && !stdout.writableEnded && (stdout.writable ?? true)`, which is good evidence the narrow surface is deliberate.\n' +
        '- `on()`/`off()` are only used when rendering interactively (`ink.tsx:457`) and by `useWindowSize()` (`use-window-size.ts:32`).\n' +
        '- Ink touches `stdin` only when `stdin.isTTY` is set (`App.tsx:209`). Raw mode input then needs `addListener()`, `read()`, `setRawMode()`, `setEncoding()`, `ref()` and `unref()`, and kitty keyboard detection also uses `on()`, `removeListener()` and `unshift()` (`ink.tsx:1202-1255`).\n' +
        '- If a stream reports `writableLength`, Ink passes a completion callback to `write()` (`ink.tsx:896`) and waits for it, so such a stream must invoke it or `waitUntilExit()` and `waitUntilRenderFlush()` never settle.\n' +
        '\n' +
        "That's the contract, and it's what the new types describe — including the conditional parts, in their doc comments, so nobody has to rediscover this from a crash.\n" +
        '\n' +
        '## The proposal\n' +
        '\n' +
        '```ts\n' +
        'export type InkOutputStream = {\n' +
        '\tcolumns?: number;\n' +
        '\trows?: number;\n' +
        '\tisTTY?: boolean;\n' +
        '\tdestroyed?: boolean;\n' +
        '\twritable?: boolean;\n' +
        '\twritableEnded?: boolean;\n' +
        '\twritableLength?: number;\n' +
        '\twrite(data: string, ...rest: unknown[]): unknown;\n' +
        '\ton?(event: unknown, listener: unknown): unknown;\n' +
        '\toff?(event: unknown, listener: unknown): unknown;\n' +
        '};\n' +
        '\n' +
        'export type InkInputStream = {\n' +
        '\tisTTY?: boolean;\n' +
        '\ton?(event: unknown, listener: unknown): unknown;\n' +
        '\tread?(...args: unknown[]): unknown;\n' +
        '\tsetRawMode?(mode: boolean): unknown;\n' +
        '\tsetEncoding?(...args: unknown[]): unknown;\n' +
        '\tunshift?(...args: unknown[]): unknown;\n' +
        '\taddListener?(event: unknown, listener: unknown): unknown;\n' +
        '\tremoveListener?(event: unknown, listener: unknown): unknown;\n' +
        '\tref?(): unknown;\n' +
        '\tunref?(): unknown;\n' +
        '};\n' +
        '\n' +
        'export type RenderOptions<\n' +
        '\tOutputStream extends InkOutputStream = NodeJS.WriteStream,\n' +
        '\tInputStream extends InkInputStream = NodeJS.ReadStream,\n' +
        '> = {\n' +
        '\tstdout?: OutputStream;\n' +
        '\tstdin?: InputStream;\n' +
        '\tstderr?: OutputStream;\n' +
        '\t// …everything else unchanged\n' +
        '};\n' +
        '\n' +
        'const render = (\n' +
        '\tnode: ReactNode,\n' +
        '\toptions?: Writable | RenderOptions<InkOutputStream, InkInputStream>,\n' +
        '): Instance => {…};\n' +
        '```\n' +
        '\n' +
        'Which makes the original snippet compile as-is:\n' +
        '\n' +
        '```ts\n' +
        'render(<App />, {stdout: sink, debug: true});     // ✓\n' +
        'const mySink: InkOutputStream = sink;             // ✓ exported, so you can type your own\n' +
        '```\n' +
        '\n' +
        "## Decisions I made, and where I'd like your opinion\n" +
        '\n' +
        '**Why structural types rather than just loosening to `stream.Writable`.** That would fix `PassThrough`, but not the case that motivates this: an in-memory sink is usually a plain object, not a `Writable` subclass, and forcing people to extend `Writable` for a `write()` method is a worse deal than the assertion. Structural types accept both.\n' +
        '\n' +
        '**Why `RenderOptions` is generic instead of just narrowing the three properties.** Narrowing them directly was my first attempt, and it broke code that reads the options back out:\n' +
        '\n' +
        '```ts\n' +
        'const stream: NodeJS.WriteStream = options.stdout!;   // used to compile\n' +
        'options.stdout!.cursorTo(0);                          // used to compile\n' +
        '```\n' +
        '\n' +
        "TypeScript uses one type for reads and writes of a property, so widening what callers may pass in necessarily narrows what everyone else gets out. Generic parameters with Node's types as the defaults avoid that: bare `RenderOptions` means exactly what it means today, `render()` accepts the wide instantiation, and wrapper authors can ask for `RenderOptions<InkOutputStream, InkInputStream>` explicitly. The cost is two type parameters on a public type. I think that's the right trade, but it's your API — happy to switch to the plain narrowing if you'd rather have the simpler type and accept the read-side break.\n" +
        '\n' +
        "**Why stream detection is left exactly as it is.** An earlier revision of this PR also let you pass a capture stream as the positional second argument, `render(tree, sink)`. That required changing stream detection from `options instanceof Stream` to a duck-typed `typeof options.write === 'function'`, and I convinced myself it was strictly wider. It wasn't:\n" +
        '\n' +
        "- `render(tree, null)` and `render(tree, 42)` started throwing `TypeError: Cannot use 'in' operator…`, where master falls back to the defaults and renders. Any JS caller forwarding a possibly-null options value would have hit that.\n" +
        '- An object carrying a `write` method but intended as options got reclassified as the output stream, silently dropping the options it carried.\n' +
        '\n' +
        "I don't like changing behavior people already depend on just because it's convenient, and a second way to pass a stream doesn't come close to earning it — the upside is a shorter call for a handful of users, the downside lands on people who never asked for it. So detection is byte-for-byte master's `instanceof Stream`, and the positional parameter is typed `Writable`: the streams that check accepts *and* Ink can actually write to. It's deliberately a little narrower than the check — a `Readable` or a bare `Stream` subclass is rejected at compile time even though `instanceof Stream` would take it — but nothing the type allows is mishandled at runtime, which is the direction that matters. Capture streams go through the options object, which is the documented form and what `ink-testing-library` uses. I verified behavior matches master for `null`, numbers, strings, functions and options-shaped objects carrying `write`.\n" +
        '\n' +
        '**Why every `InkInputStream` member is optional.** My first version required `on` and `read`. That looked reasonable until the new test had to stub both with no-ops for methods Ink never calls on a non-TTY stdin — the split matched nothing at runtime. Ink touches stdin only when `isTTY` is set, so the honest encoding is all-optional, with the input requirements documented on the type.\n' +
        '\n' +
        "This has a cost I want to flag rather than bury: because Node types `tty.ReadStream` and `tty.WriteStream` as sockets, an all-optional input type also accepts an output stream, so `render(tree, {stdin: process.stdout})` compiles now where master rejected it. It would fail at runtime if a component called `useInput`. The only member that discriminates the two is `setRawMode`, and requiring it would rule out the minimal stdin that motivated the change. I chose the weaker type and documented the contract, but this one is genuinely a judgement call and I'll follow your preference.\n" +
        '\n' +
        "**What I deliberately left alone.** Ink's internals still use Node's stream types. `render()` casts at that single boundary, so `ink.tsx`, the contexts, the hooks and `instances.ts` are untouched, and `useStdout()`/`useStdin()`/`useStderr()` keep their current return types. Migrating those is a bigger, breaking change and doesn't belong here — but say the word and I'll do it in this PR if you'd prefer they match.\n" +
        '\n' +
        '**One intentional behavior difference.** Passing a stream as an explicit `undefined` or `null` now falls back to the process stream instead of overriding the default with it. On master the nullish value reached the renderer, and none of these worked:\n' +
        '\n' +
        '```ts\n' +
        "render(<App />, {stdout: undefined});  // master: TypeError: Cannot read properties of undefined (reading 'isTTY')\n" +
        "render(<App />, {stdout: null});       // master: TypeError: Cannot read properties of null (reading 'isTTY')\n" +
        'render(<App />, {stdin: undefined});   // master: renders nothing, silently — the TypeError is swallowed by the error boundary\n' +
        '```\n' +
        '\n' +
        'All three render here. Turning two crashes and a silent no-op into working renders seemed worth keeping, but '... 2991 more characters,
      reactions: [Object],
      timeline_url: 'https://api.github.com/repos/vadimdemedes/ink/issues/981/timeline',
      performed_via_github_app: null,
      state_reason: null
    },
    comment: {
      url: 'https://api.github.com/repos/vadimdemedes/ink/issues/comments/5260114641',
      html_url: 'https://github.com/vadimdemedes/ink/pull/981#issuecomment-5260114641',
      issue_url: 'https://api.github.com/repos/vadimdemedes/ink/issues/981',
      id: 5260114641,
      node_id: 'IC_kwDOBZtC-88AAAABOYb60Q',
      user: [Object],
      created_at: '2026-08-11T23:37:41Z',
      updated_at: '2026-08-11T23:37:41Z',
      body: "Thanks for putting this together. I ended up using Node's existing `NodeJS.WritableStream` and `NodeJS.ReadableStream` types instead. They solve the core problem of accepting generic Node streams such as `PassThrough`, while keeping `RenderOptions` non-generic and avoiding new public Ink-specific stream types.\r\n" +
        '\r\n' +
        "I intentionally did not support plain objects that only implement `write()`. Ink also relies on stream events and write callbacks for interactive behavior and flush barriers, so accepting those objects would make the type broader than the actual supported contract. The implementation now carries the generic stream types through Ink's internals and checks TTY and raw-mode capabilities at runtime.",
      reactions: [Object],
      performed_via_github_app: null,
      minimized: null
    }
  },
  public: true,
  created_at: '2026-08-11T23:37:41Z'
}
{
  id: '13130695868',
  type: 'ReleaseEvent',
  actor: {
    id: 170270,
    login: 'sindresorhus',
    display_login: 'sindresorhus',
    gravatar_id: '',
    url: 'https://api.github.com/users/sindresorhus',
    avatar_url: 'https://avatars.githubusercontent.com/u/170270?'
  },
  repo: {
    id: 15186239,
    name: 'sindresorhus/globals',
    url: 'https://api.github.com/repos/sindresorhus/globals'
  },
  payload: {
    action: 'published',
    release: {
      url: 'https://api.github.com/repos/sindresorhus/globals/releases/368860454',
      assets_url: 'https://api.github.com/repos/sindresorhus/globals/releases/368860454/assets',
      upload_url: 'https://uploads.github.com/repos/sindresorhus/globals/releases/368860454/assets{?name,label}',
      html_url: 'https://github.com/sindresorhus/globals/releases/tag/v17.10.0',
      id: 368860454,
      author: [Object],
      node_id: 'RE_kwDOAOe5P84V_F0m',
      tag_name: 'v17.10.0',
      target_commitish: 'main',
      name: '',
      draft: false,
      immutable: false,
      prerelease: false,
      created_at: '2026-08-11T21:14:27Z',
      updated_at: '2026-08-11T21:15:18Z',
      published_at: '2026-08-11T21:15:18Z',
      assets: [],
      tarball_url: 'https://api.github.com/repos/sindresorhus/globals/tarball/v17.10.0',
      zipball_url: 'https://api.github.com/repos/sindresorhus/globals/zipball/v17.10.0',
      body: '- Add `GM_cookie` to Greasemonkey globals (#349)  f468407\r\n' +
        '\r\n' +
        '---\r\n' +
        '\r\n' +
        'https://github.com/sindresorhus/globals/compare/v17.9.0...v17.10.0',
      reactions: [Object],
      short_description_html: '<ul>\n' +
        '<li>Add <code>GM_cookie</code> to Greasemonkey globals (<a class="issue-link js-issue-link" data-error-text="Failed to load title" data-id="5091664362" data-permission-text="Title is private" data-url="https://github.com/sindresorhus/globals/issues/349" data-hovercard-type="pull_request" data-hovercard-url="/sindresorhus/globals/pull/349/hovercard" href="https://github.com/sindresorhus/globals/pull/349">#349</a>) <a class="commit-link" data-hovercard-type="commit" data-hovercard-url="https://github.com/sindresorhus/globals/commit/f4684072a5ec0ad598ee4a20989b3eaa733753bf/hovercard" href="https://github.com/sindresorhus/globals/commit/f4684072a5ec0ad598ee4a20989b3eaa733753bf"><tt>f468407</tt></a>\n' +
        '</li>\n' +
        '</ul>\n' +
        '<hr>\n' +
        '<p><a class="commit-link" href="https://github.com/sindresorhus/globals/compare/v17.9.0...v17.10.0"><tt>v17.9.0...v17.10.0</tt></a></p>',
      is_short_description_html_truncated: false
    }
  },
  public: true,
  created_at: '2026-08-11T21:15:18Z'
}
{
  id: '17428225460',
  type: 'PushEvent',
  actor: {
    id: 170270,
    login: 'sindresorhus',
    display_login: 'sindresorhus',
    gravatar_id: '',
    url: 'https://api.github.com/users/sindresorhus',
    avatar_url: 'https://avatars.githubusercontent.com/u/170270?'
  },
  repo: {
    id: 15186239,
    name: 'sindresorhus/globals',
    url: 'https://api.github.com/repos/sindresorhus/globals'
  },
  payload: {
    repository_id: 15186239,
    push_id: 39746457016,
    ref: 'refs/heads/main',
    head: '7bed4af3730dcb5dbea4274b5264e6be4c4b8910',
    before: 'f4684072a5ec0ad598ee4a20989b3eaa733753bf'
  },
  public: true,
  created_at: '2026-08-11T21:15:12Z'
}
{
  id: '13130616493',
  type: 'IssueCommentEvent',
  actor: {
    id: 170270,
    login: 'sindresorhus',
    display_login: 'sindresorhus',
    gravatar_id: '',
    url: 'https://api.github.com/users/sindresorhus',
    avatar_url: 'https://avatars.githubusercontent.com/u/170270?'
  },
  repo: {
    id: 15186239,
    name: 'sindresorhus/globals',
    url: 'https://api.github.com/repos/sindresorhus/globals'
  },
  payload: {
    action: 'created',
    issue: {
      url: 'https://api.github.com/repos/sindresorhus/globals/issues/337',
      repository_url: 'https://api.github.com/repos/sindresorhus/globals',
      labels_url: 'https://api.github.com/repos/sindresorhus/globals/issues/337/labels{/name}',
      comments_url: 'https://api.github.com/repos/sindresorhus/globals/issues/337/comments',
      events_url: 'https://api.github.com/repos/sindresorhus/globals/issues/337/events',
      html_url: 'https://github.com/sindresorhus/globals/pull/337',
      id: 3975399064,
      node_id: 'PR_kwDOAOe5P87FgcgW',
      number: 337,
      title: 'Add `react-native` globals',
      user: [Object],
      labels: [],
      state: 'closed',
      locked: false,
      assignees: [],
      milestone: null,
      comments: 2,
      created_at: '2026-02-22T20:45:29Z',
      updated_at: '2026-08-12T11:18:10Z',
      closed_at: '2026-08-12T11:00:43Z',
      assignee: null,
      active_lock_reason: null,
      draft: false,
      pull_request: [Object],
      body: '- React Native publicly documents its globals in the website sidebar: https://github.com/facebook/react-native-website/blob/main/website/sidebars.ts#L232\r\n' +
        '  - Did not add `IntersectionObserver` or `IntersectionObserverEntry` because they are currently marked as "Canary and Experimental only".\r\n' +
        '- Added `CharacterData`, `Document`, `DOMRect`, `DOMRectList`, `DOMRectReadOnly`, `Element`, `HTMLElement`, `HTMLCollection`, `Node`, `NodeList`, and `Text` because of how React Native 0.84 [sets up its DOM globals](https://github.com/facebook/react-native/blob/v0.84.0/packages/react-native/src/private/setup/setUpDefaultReactNativeEnvironment.js#L22-L24), and [`setUpDOM` installs these constructors](https://github.com/facebook/react-native/blob/v0.84.0/packages/react-native/src/private/setup/setUpDOM.js#L22-L75). This supports usage like `value instanceof Element`.\r\n' +
        '- Added [`Performance`](https://github.com/facebook/react-native/blob/v0.84.0/packages/react-native/src/private/setup/setUpPerformanceModern.js#L34-L37) and [`TaskAttributionTiming`](https://github.com/facebook/react-native/blob/v0.84.0/packages/react-native/src/private/setup/setUpPerformanceModern.js#L91-L95) because they are exposed by the same modern performance setup as the other `Performance*` globals already included here.\r\n' +
        '- Added `self` because it is [documented as an alias for `globalThis`](https://reactnative.dev/docs/0.84/global-self). React Native also [tests that `globalThis`, `global`, `window`, and `self` refer to the same object](https://github.com/facebook/react-native/blob/v0.84.0/packages/react-native/src/private/setup/__tests__/setUpDefaultReactNativeEnvironment-Globals-itest.js#L15-L19).\r\n' +
        "- Added `require` because it is listed in React Native's [`globals.d.ts`](https://github.com/facebook/react-native/blob/main/packages/react-native/src/types/globals.d.ts#L13), despite being missing from the website.\r\n" +
        "- Added `Event` and `EventTarget` because React Native's `globals.d.ts` assumes they exist.\r\n" +
        '- There are other variables in `globals.d.ts` that are not publicly documented (for example, `HermesInternal`); not sure what the policy is on adding those.\r\n' +
        "- Set the writable flag to `false` for everything. The previous package set it to `true` for some globals like `setImmediate`, but unless I'm missing something, that seems wrong.\r\n" +
        '\r\n' +
        '<details>\r\n' +
        '<summary>Context</summary>\r\n' +
        'https://github.com/sindresorhus/globals/pull/129 was previously rejected, but re-opening because it seems the policy of this repo has changed.\r\n' +
        '\r\n' +
        'There is an existing package, but it has not been touched for years. https://github.com/react-native-community/eslint-plugin-react-native-globals\r\n' +
        '</details>',
      reactions: [Object],
      timeline_url: 'https://api.github.com/repos/sindresorhus/globals/issues/337/timeline',
      performed_via_github_app: null,
      state_reason: null
    },
    comment: {
      url: 'https://api.github.com/repos/sindresorhus/globals/issues/comments/5258927216',
      html_url: 'https://github.com/sindresorhus/globals/pull/337#issuecomment-5258927216',
      issue_url: 'https://api.github.com/repos/sindresorhus/globals/issues/337',
      id: 5258927216,
      node_id: 'IC_kwDOAOe5P88AAAABOXTccA',
      user: [Object],
      created_at: '2026-08-11T21:13:34Z',
      updated_at: '2026-08-11T21:13:34Z',
      body: 'There are a few missing React Native globals here:\r\n' +
        '\r\n' +
        '- React Native 0.84 unconditionally installs `CharacterData`, `Document`, `DOMRect`, `DOMRectList`, `DOMRectReadOnly`, `Element`, `HTMLElement`, `HTMLCollection`, `Node`, `NodeList`, and `Text`. Omitting them will cause `no-undef` errors for supported usage such as `value instanceof Element`.\r\n' +
        '- The perfomance globals are missing `Performance` and `TaskAttributionTiming`. They are exposed by the same setup as the other `Performance*` globals already included here.\r\n' +
        '- `self` is a documented React Native global and an alias for the global object, so it should be included too.\r\n' +
        '\r\n' +
        'Could you add these and regenerate the generated output?\r\n',
      reactions: [Object],
      performed_via_github_app: null,
      minimized: null
    }
  },
  public: true,
  created_at: '2026-08-11T21:13:34Z'
}
{
  id: '13130558532',
  type: 'IssueCommentEvent',
  actor: {
    id: 170270,
    login: 'sindresorhus',
    display_login: 'sindresorhus',
    gravatar_id: '',
    url: 'https://api.github.com/users/sindresorhus',
    avatar_url: 'https://avatars.githubusercontent.com/u/170270?'
  },
  repo: {
    id: 29850217,
    name: 'sindresorhus/macos-trash',
    url: 'https://api.github.com/repos/sindresorhus/macos-trash'
  },
  payload: {
    action: 'created',
    issue: {
      url: 'https://api.github.com/repos/sindresorhus/macos-trash/issues/35',
      repository_url: 'https://api.github.com/repos/sindresorhus/macos-trash',
      labels_url: 'https://api.github.com/repos/sindresorhus/macos-trash/issues/35/labels{/name}',
      comments_url: 'https://api.github.com/repos/sindresorhus/macos-trash/issues/35/comments',
      events_url: 'https://api.github.com/repos/sindresorhus/macos-trash/issues/35/events',
      html_url: 'https://github.com/sindresorhus/macos-trash/pull/35',
      id: 5120256880,
      node_id: 'PR_kwDOAcd6ac79g1-y',
      number: 35,
      title: 'Add `--empty` flag',
      user: [Object],
      labels: [],
      state: 'closed',
      locked: false,
      assignees: [],
      milestone: null,
      comments: 1,
      created_at: '2026-08-11T12:39:49Z',
      updated_at: '2026-08-12T12:36:37Z',
      closed_at: '2026-08-12T12:36:37Z',
      assignee: null,
      active_lock_reason: null,
      draft: false,
      pull_request: [Object],
      body: 'Adds the `--empty` flag discussed in #28.\r\n' +
        '\r\n' +
        'It uses Finder through `NSAppleScript`, matching the approach suggested in the issue. The command does not prompt or respect `--interactive`, and AppleScript failures are reported through the existing CLI error path.\r\n' +
        '\r\n' +
        'Fixes #28\r\n' +
        '\r\n' +
        '## Verification\r\n' +
        '\r\n' +
        '- `swift build --disable-sandbox`\r\n' +
        '- Valid and invalid AppleScript helper checks\r\n' +
        '- Help, version, and existing CLI regression checks\r\n' +
        '- Universal `x86_64`/`arm64` release build',
      reactions: [Object],
      timeline_url: 'https://api.github.com/repos/sindresorhus/macos-trash/issues/35/timeline',
      performed_via_github_app: null,
      state_reason: null
    },
    comment: {
      url: 'https://api.github.com/repos/sindresorhus/macos-trash/issues/comments/5258914619',
      html_url: 'https://github.com/sindresorhus/macos-trash/pull/35#issuecomment-5258914619',
      issue_url: 'https://api.github.com/repos/sindresorhus/macos-trash/issues/35',
      id: 5258914619,
      node_id: 'IC_kwDOAcd6ac8AAAABOXSrOw',
      user: [Object],
      created_at: '2026-08-11T21:12:17Z',
      updated_at: '2026-08-11T21:12:17Z',
      body: '`--empty` is ignored when `--interactive` comes first\r\n' +
        '\r\n' +
        'Argument dispatch examines only the first argument. Consequently, `trash --interactive --empty` enters interactive mode, filters out `--empty`, processes no paths, and exits successfully without emptying the Trash.\r\n' +
        '\r\n' +
        'This contradicts issue #28, which explicitly says `--empty` must not respect `--interactive`. The documented usage also places `--interactive` before `--empty`.\r\n' +
        '\r\n' +
        'Safe reproduction:\r\n' +
        '\r\n' +
        '```\r\n' +
        '$ trash --interactive --empty\r\n' +
        '$ echo $?\r\n' +
        '0\r\n' +
        '```\r\n' +
        '\r\n' +
        'Parse supported action flags independently so `--empty` takes precedence regardless of its ordering. Add regression coverage for both option orders.',
      reactions: [Object],
      performed_via_github_app: null,
      minimized: null
    }
  },
  public: true,
  created_at: '2026-08-11T21:12:17Z'
}
{
  id: '13129728347',
  type: 'IssueCommentEvent',
  actor: {
    id: 170270,
    login: 'sindresorhus',
    display_login: 'sindresorhus',
    gravatar_id: '',
    url: 'https://api.github.com/users/sindresorhus',
    avatar_url: 'https://avatars.githubusercontent.com/u/170270?'
  },
  repo: {
    id: 28951059,
    name: 'sindresorhus/dot-prop',
    url: 'https://api.github.com/repos/sindresorhus/dot-prop'
  },
  payload: {
    action: 'created',
    issue: {
      url: 'https://api.github.com/repos/sindresorhus/dot-prop/issues/129',
      repository_url: 'https://api.github.com/repos/sindresorhus/dot-prop',
      labels_url: 'https://api.github.com/repos/sindresorhus/dot-prop/issues/129/labels{/name}',
      comments_url: 'https://api.github.com/repos/sindresorhus/dot-prop/issues/129/comments',
      events_url: 'https://api.github.com/repos/sindresorhus/dot-prop/issues/129/events',
      html_url: 'https://github.com/sindresorhus/dot-prop/issues/129',
      id: 5118204536,
      node_id: 'I_kwDOAbnCE88AAAABMRGaeA',
      number: 129,
      title: 'Security: method override via set path keys (toString/hasOwnProperty) — incomplete fix of GHSA-ff7x-qrg7-qggm',
      user: [Object],
      labels: [],
      state: 'closed',
      locked: true,
      assignees: [],
      milestone: null,
      comments: 1,
      created_at: '2026-08-11T08:27:59Z',
      updated_at: '2026-08-11T20:55:01Z',
      closed_at: '2026-08-11T20:54:53Z',
      assignee: null,
      active_lock_reason: 'spam',
      sub_issues_summary: [Object],
      issue_dependencies_summary: [Object],
      body: '## Summary\n' +
        '\n' +
        '`dot-prop` (both the main package and `dot-prop-immutable`) allows **method override** via `set`/`setProperty` path keys — `toString`, `hasOwnProperty`, `valueOf` can be replaced with non-function values, causing runtime crashes in consumers. The existing GHSA (GHSA-ff7x-qrg7-qggm) fixed `__proto__` prototype pollution (fixed in 4.2.1 / 5.1.1) but **method-name keys were never covered** — the issue persists in the latest release (10.2.0).\n' +
        '\n' +
        '## PoC (verified, node v22, dot-prop@10.2.0)\n' +
        '\n' +
        '```js\n' +
        "const dp = require('dot-prop');\n" +
        '\n' +
        '// PoC 1: toString override → crash on String()\n' +
        'const obj = { a: 1 };\n' +
        "dp.setProperty(obj, 'toString', 'HACKED');\n" +
        'String(obj);   // TypeError: Cannot convert object to primitive value\n' +
        '\n' +
        '// PoC 2: hasOwnProperty override → crash on property check\n' +
        'const obj2 = {};\n' +
        "dp.setProperty(obj2, 'hasOwnProperty', 'HACKED');\n" +
        "obj2.hasOwnProperty('a');   // TypeError: obj2.hasOwnProperty is not a function\n" +
        '```\n' +
        '\n' +
        'Also affects `dot-prop-immutable` (2.1.1):\n' +
        '```js\n' +
        "const dpi = require('dot-prop-immutable');\n" +
        "const out = dpi.set({}, 'toString', 'HACKED');\n" +
        'String(out);   // TypeError\n' +
        '```\n' +
        '\n' +
        '## Real output (node v22)\n' +
        '\n' +
        '```\n' +
        'setProperty toString → {"t":"string"}\n' +
        'setProperty hasOwnProperty → {"t":"string"}\n' +
        'String(out) → ERROR: Cannot convert object to primitive value\n' +
        'out.hasOwnProperty("a") → ERROR: out.hasOwnProperty is not a function\n' +
        '```\n' +
        '\n' +
        '## Root cause\n' +
        '\n' +
        '`parsePath` splits paths on `.` and the set path assigns `object[segment] = value` without filtering method names. The 2020 fix (GHSA-ff7x-qrg7-qggm, commit for #102) only added a `__proto__`/`constructor`/`prototype` blacklist — `toString`, `hasOwnProperty`, `valueOf` are still writable as data keys, shadowing inherited methods.\n' +
        '\n' +
        '## Impact\n' +
        '\n' +
        '- **Method override (DoS)**: any consumer handling untrusted dot-paths (URL params, config keys, form data, JSON paths) crashes on serialization (`String()`, `JSON.stringify` in some paths) or property-existence checks (`hasOwnProperty`).\n' +
        '- Affects the main `dot-prop` (≈49M weekly downloads) and `dot-prop-immutable` (≈40K weekly).\n' +
        '- Prototype pollution via nested paths may still be possible in edge cases (e.g. `constructor.prototype` chains).\n' +
        '\n' +
        '## Affected versions\n' +
        '\n' +
        '- `dot-prop`: all versions, including latest 10.2.0 (and 4.x/5.x despite the GHSA fix — the fix was incomplete)\n' +
        '- `dot-prop-immutable`: all versions up to 2.1.1\n' +
        '\n' +
        '## Suggested fix\n' +
        '\n' +
        'Extend the existing blacklist (or better, reject any key that is an `Object.prototype` own property name):\n' +
        '\n' +
        '```js\n' +
        '// in parsePath or set:\n' +
        "if (key === '__proto__' || key === 'constructor' || key === 'prototype' ||\n" +
        '    Object.prototype.hasOwnProperty.call(Object.prototype, key)) {\n' +
        "  throw new TypeError('Refusing to access forbidden property: ' + key);\n" +
        '}\n' +
        '```\n' +
        '\n' +
        'Rejecting all inherited `Object.prototype` own property names (`toString`, `hasOwnProperty`, `valueOf`, `isPrototypeOf`, `propertyIsEnumerable`, `toLocaleString`, `__defineGetter__`, etc.) is more robust than a hardcoded list.\n',
      reactions: [Object],
      timeline_url: 'https://api.github.com/repos/sindresorhus/dot-prop/issues/129/timeline',
      performed_via_github_app: null,
      state_reason: 'not_planned',
      pinned_comment: null
    },
    comment: {
      url: 'https://api.github.com/repos/sindresorhus/dot-prop/issues/comments/5258745938',
      html_url: 'https://github.com/sindresorhus/dot-prop/issues/129#issuecomment-5258745938',
      issue_url: 'https://api.github.com/repos/sindresorhus/dot-prop/issues/129',
      id: 5258745938,
      node_id: 'IC_kwDOAbnCE88AAAABOXIYUg',
      user: [Object],
      created_at: '2026-08-11T20:54:53Z',
      updated_at: '2026-08-11T20:54:53Z',
      body: 'From the readme:\n' +
        '\n' +
        '> Sanitizing untrusted path input is your responsibility. Use [escapePath](https://github.com/sindresorhus/dot-prop/issues/129#escapepathpath) to treat it as a literal key.\n' +
        '\n' +
        '> Apart from the components above, no protection against attacker-controlled paths is attempted. A path can reach anything reachable from the object, including inherited properties and built-ins. Only you know which parts of your object graph are safe to expose, so guard that where the path enters your program.',
      pin: null,
      reactions: [Object],
      performed_via_github_app: null,
      minimized: null
    }
  },
  public: true,
  created_at: '2026-08-11T20:54:53Z'
}
{
  id: '13129727755',
  type: 'IssuesEvent',
  actor: {
    id: 170270,
    login: 'sindresorhus',
    display_login: 'sindresorhus',
    gravatar_id: '',
    url: 'https://api.github.com/users/sindresorhus',
    avatar_url: 'https://avatars.githubusercontent.com/u/170270?'
  },
  repo: {
    id: 28951059,
    name: 'sindresorhus/dot-prop',
    url: 'https://api.github.com/repos/sindresorhus/dot-prop'
  },
  payload: {
    action: 'closed',
    issue: {
      url: 'https://api.github.com/repos/sindresorhus/dot-prop/issues/129',
      repository_url: 'https://api.github.com/repos/sindresorhus/dot-prop',
      labels_url: 'https://api.github.com/repos/sindresorhus/dot-prop/issues/129/labels{/name}',
      comments_url: 'https://api.github.com/repos/sindresorhus/dot-prop/issues/129/comments',
      events_url: 'https://api.github.com/repos/sindresorhus/dot-prop/issues/129/events',
      html_url: 'https://github.com/sindresorhus/dot-prop/issues/129',
      id: 5118204536,
      node_id: 'I_kwDOAbnCE88AAAABMRGaeA',
      number: 129,
      title: 'Security: method override via set path keys (toString/hasOwnProperty) — incomplete fix of GHSA-ff7x-qrg7-qggm',
      user: [Object],
      labels: [],
      state: 'closed',
      locked: true,
      assignees: [],
      milestone: null,
      comments: 1,
      created_at: '2026-08-11T08:27:59Z',
      updated_at: '2026-08-11T20:55:01Z',
      closed_at: '2026-08-11T20:54:53Z',
      assignee: null,
      active_lock_reason: 'spam',
      sub_issues_summary: [Object],
      issue_dependencies_summary: [Object],
      body: '## Summary\n' +
        '\n' +
        '`dot-prop` (both the main package and `dot-prop-immutable`) allows **method override** via `set`/`setProperty` path keys — `toString`, `hasOwnProperty`, `valueOf` can be replaced with non-function values, causing runtime crashes in consumers. The existing GHSA (GHSA-ff7x-qrg7-qggm) fixed `__proto__` prototype pollution (fixed in 4.2.1 / 5.1.1) but **method-name keys were never covered** — the issue persists in the latest release (10.2.0).\n' +
        '\n' +
        '## PoC (verified, node v22, dot-prop@10.2.0)\n' +
        '\n' +
        '```js\n' +
        "const dp = require('dot-prop');\n" +
        '\n' +
        '// PoC 1: toString override → crash on String()\n' +
        'const obj = { a: 1 };\n' +
        "dp.setProperty(obj, 'toString', 'HACKED');\n" +
        'String(obj);   // TypeError: Cannot convert object to primitive value\n' +
        '\n' +
        '// PoC 2: hasOwnProperty override → crash on property check\n' +
        'const obj2 = {};\n' +
        "dp.setProperty(obj2, 'hasOwnProperty', 'HACKED');\n" +
        "obj2.hasOwnProperty('a');   // TypeError: obj2.hasOwnProperty is not a function\n" +
        '```\n' +
        '\n' +
        'Also affects `dot-prop-immutable` (2.1.1):\n' +
        '```js\n' +
        "const dpi = require('dot-prop-immutable');\n" +
        "const out = dpi.set({}, 'toString', 'HACKED');\n" +
        'String(out);   // TypeError\n' +
        '```\n' +
        '\n' +
        '## Real output (node v22)\n' +
        '\n' +
        '```\n' +
        'setProperty toString → {"t":"string"}\n' +
        'setProperty hasOwnProperty → {"t":"string"}\n' +
        'String(out) → ERROR: Cannot convert object to primitive value\n' +
        'out.hasOwnProperty("a") → ERROR: out.hasOwnProperty is not a function\n' +
        '```\n' +
        '\n' +
        '## Root cause\n' +
        '\n' +
        '`parsePath` splits paths on `.` and the set path assigns `object[segment] = value` without filtering method names. The 2020 fix (GHSA-ff7x-qrg7-qggm, commit for #102) only added a `__proto__`/`constructor`/`prototype` blacklist — `toString`, `hasOwnProperty`, `valueOf` are still writable as data keys, shadowing inherited methods.\n' +
        '\n' +
        '## Impact\n' +
        '\n' +
        '- **Method override (DoS)**: any consumer handling untrusted dot-paths (URL params, config keys, form data, JSON paths) crashes on serialization (`String()`, `JSON.stringify` in some paths) or property-existence checks (`hasOwnProperty`).\n' +
        '- Affects the main `dot-prop` (≈49M weekly downloads) and `dot-prop-immutable` (≈40K weekly).\n' +
        '- Prototype pollution via nested paths may still be possible in edge cases (e.g. `constructor.prototype` chains).\n' +
        '\n' +
        '## Affected versions\n' +
        '\n' +
        '- `dot-prop`: all versions, including latest 10.2.0 (and 4.x/5.x despite the GHSA fix — the fix was incomplete)\n' +
        '- `dot-prop-immutable`: all versions up to 2.1.1\n' +
        '\n' +
        '## Suggested fix\n' +
        '\n' +
        'Extend the existing blacklist (or better, reject any key that is an `Object.prototype` own property name):\n' +
        '\n' +
        '```js\n' +
        '// in parsePath or set:\n' +
        "if (key === '__proto__' || key === 'constructor' || key === 'prototype' ||\n" +
        '    Object.prototype.hasOwnProperty.call(Object.prototype, key)) {\n' +
        "  throw new TypeError('Refusing to access forbidden property: ' + key);\n" +
        '}\n' +
        '```\n' +
        '\n' +
        'Rejecting all inherited `Object.prototype` own property names (`toString`, `hasOwnProperty`, `valueOf`, `isPrototypeOf`, `propertyIsEnumerable`, `toLocaleString`, `__defineGetter__`, etc.) is more robust than a hardcoded list.\n',
      reactions: [Object],
      timeline_url: 'https://api.github.com/repos/sindresorhus/dot-prop/issues/129/timeline',
      performed_via_github_app: null,
      state_reason: 'not_planned',
      pinned_comment: null
    }
  },
  public: true,
  created_at: '2026-08-11T20:54:54Z'
}
{
  id: '13129647300',
  type: 'PullRequestEvent',
  actor: {
    id: 170270,
    login: 'sindresorhus',
    display_login: 'sindresorhus',
    gravatar_id: '',
    url: 'https://api.github.com/users/sindresorhus',
    avatar_url: 'https://avatars.githubusercontent.com/u/170270?'
  },
  repo: {
    id: 15186239,
    name: 'sindresorhus/globals',
    url: 'https://api.github.com/repos/sindresorhus/globals'
  },
  payload: {
    action: 'closed',
    number: 307,
    pull_request: {
      url: 'https://api.github.com/repos/sindresorhus/globals/pulls/307',
      id: 2739181991,
      number: 307,
      head: [Object],
      base: [Object]
    }
  },
  public: true,
  created_at: '2026-01-27T14:39:36Z'
}
{
  id: '13129636344',
  type: 'IssueCommentEvent',
  actor: {
    id: 170270,
    login: 'sindresorhus',
    display_login: 'sindresorhus',
    gravatar_id: '',
    url: 'https://api.github.com/users/sindresorhus',
    avatar_url: 'https://avatars.githubusercontent.com/u/170270?'
  },
  repo: {
    id: 15186239,
    name: 'sindresorhus/globals',
    url: 'https://api.github.com/repos/sindresorhus/globals'
  },
  payload: {
    action: 'created',
    issue: {
      url: 'https://api.github.com/repos/sindresorhus/globals/issues/236',
      repository_url: 'https://api.github.com/repos/sindresorhus/globals',
      labels_url: 'https://api.github.com/repos/sindresorhus/globals/issues/236/labels{/name}',
      comments_url: 'https://api.github.com/repos/sindresorhus/globals/issues/236/comments',
      events_url: 'https://api.github.com/repos/sindresorhus/globals/issues/236/events',
      html_url: 'https://github.com/sindresorhus/globals/pull/236',
      id: 2145909870,
      node_id: 'PR_kwDOAOe5P85nekVU',
      number: 236,
      title: 'Add `--enable-blink-test-features` to run chrome',
      user: [Object],
      labels: [],
      state: 'closed',
      locked: false,
      assignees: [],
      milestone: null,
      comments: 1,
      created_at: '2024-02-21T06:07:00Z',
      updated_at: '2026-08-12T02:42:22Z',
      closed_at: '2026-08-11T20:52:57Z',
      assignee: null,
      active_lock_reason: null,
      draft: true,
      pull_request: [Object],
      body: null,
      reactions: [Object],
      timeline_url: 'https://api.github.com/repos/sindresorhus/globals/issues/236/timeline',
      performed_via_github_app: null,
      state_reason: null
    },
    comment: {
      url: 'https://api.github.com/repos/sindresorhus/globals/issues/comments/5258727037',
      html_url: 'https://github.com/sindresorhus/globals/pull/236#issuecomment-5258727037',
      issue_url: 'https://api.github.com/repos/sindresorhus/globals/issues/236',
      id: 5258727037,
      node_id: 'IC_kwDOAOe5P88AAAABOXHOfQ',
      user: [Object],
      created_at: '2026-08-11T20:52:57Z',
      updated_at: '2026-08-11T20:52:57Z',
      body: 'Closing as this has been stale for a long time.',
      reactions: [Object],
      performed_via_github_app: null,
      minimized: null
    }
  },
  public: true,
  created_at: '2026-08-11T20:52:57Z'
}
{
  id: '13129635163',
  type: 'PullRequestEvent',
  actor: {
    id: 170270,
    login: 'sindresorhus',
    display_login: 'sindresorhus',
    gravatar_id: '',
    url: 'https://api.github.com/users/sindresorhus',
    avatar_url: 'https://avatars.githubusercontent.com/u/170270?'
  },
  repo: {
    id: 15186239,
    name: 'sindresorhus/globals',
    url: 'https://api.github.com/repos/sindresorhus/globals'
  },
  payload: {
    action: 'closed',
    number: 236,
    pull_request: {
      url: 'https://api.github.com/repos/sindresorhus/globals/pulls/236',
      id: 1736066388,
      number: 236,
      head: [Object],
      base: [Object]
    }
  },
  public: true,
  created_at: '2026-01-27T14:39:36Z'
}
