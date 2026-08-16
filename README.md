# github-activity

A command line interface (CLI) that fetches the recent activity of a GitHub user from the
[GitHub Events API](https://docs.github.com/en/rest/activity/events) and prints a human-readable
summary in the terminal.

Inspired by the [GitHub Activity](https://roadmap.sh/projects/github-user-activity) project from
roadmap.sh.

## Features

- Fetches the most recent events of any public GitHub user.
- Groups and counts activity per repository, and per action/ref type where it makes sense.
- Outputs natural-language lines like the reference example:

  ```
  - Pushed 3 times to kamranahmedse/developer-roadmap
  - Opened a new issue in kamranahmedse/developer-roadmap
  - Starred kamranahmedse/developer-roadmap
  ```

- Validates the username and CLI arguments before hitting the API.

## Requirements

- [Node.js](https://nodejs.org) **18 or later** (uses the global `fetch` API and `node:util`).
- [npm](https://www.npmjs.com) to install dependencies.

## Installation

```bash
git clone https://github.com/FlavioFj20/github-activity.git
cd github-activity
npm install
npm run build
```

To use the `github-activity` command anywhere, link the package:

```bash
npm link
```

## Usage

```bash
github-activity <username>
```

Or, without linking:

```bash
node dist/index.js <username>
```

### Example

```bash
github-activity kamranahmedse
```

Output (abridged):

```
- Pushed 2 times to kamranahmedse/developer-roadmap
- Opened a new issue in kamranahmedse/developer-roadmap
- Closed 1 issue in kamranahmedse/developer-roadmap
- Merged a pull request in kamranahmedse/developer-roadmap
- Starred sindresorhus/awesome
- Created a branch in kamranahmedse/developer-roadmap
```

If the username is missing or invalid, or extra arguments are passed, the CLI prints the correct
usage and exits with code `1`.

### Notes

- The GitHub Events API is public and rate-limited to **60 requests/hour per IP** without an
  authentication token. Each run consumes one request.
- Only the most recent ~30 events are returned by the API (no pagination is performed yet).

## Supported events

| Event                            | Output strategy                    |
| -------------------------------- | ---------------------------------- |
| `PushEvent`                      | Count per repo                     |
| `IssuesEvent`                    | Count per repo + action            |
| `PullRequestEvent`               | Count per repo + action            |
| `IssueCommentEvent`              | Count per repo                     |
| `CreateEvent`                    | Count per repo + ref type          |
| `DeleteEvent`                    | Count per repo + ref type          |
| `ReleaseEvent`                   | Count per repo                     |
| `WatchEvent`                     | One line per event (Starred)       |
| `ForkEvent`                      | Total count                        |
| `MemberEvent`                    | Count per repo                     |
| `CommitCommentEvent`             | Count per repo                     |
| `PullRequestReviewEvent`         | Count per repo + action            |
| `PullRequestReviewCommentEvent`  | Count per repo                     |
| `GollumEvent`                    | Count wiki pages per action        |
| `DiscussionEvent`                | Count per repo                     |
| `PublicEvent`                    | One line per event                 |

Events outside this list are ignored.

## Project structure

```
src/
├── index.ts            # entry point: argument parsing, validation, fetch, orchestration
├── process_events.ts   # counting helpers (reduce) + output formatting
├── types.ts            # TypeScript types for the GitHub Events API response
└── utils.ts            # username/argument validation
```

## Development

```bash
npm run build   # compile TypeScript to dist/
npm run test    # (placeholder — tests are planned)
```

## License

[MIT](./LICENSE)
