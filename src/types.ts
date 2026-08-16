export interface GitHubActor {
  readonly id: number;
  readonly login: string;
  readonly display_login: string;
  readonly gravatar_id: string;
  readonly url: string;
  readonly avatar_url: string;
}

export interface GitHubRepo {
  readonly id: number;
  readonly name: string;
  readonly url: string;
}

export interface GitHubWikiPage {
  readonly page_name: string;
  readonly title: string;
  readonly action: string;
  readonly summary: string;
  readonly sha: string;
  readonly html_url: string;
}

export interface GitHubPayload {
  readonly action?: string;
  readonly ref?: string;
  readonly ref_type?: string;
  readonly full_ref?: string;
  readonly state?: string;
  readonly issue?: { readonly state: string };
  readonly master_branch?: string;
  readonly description?: string;
  readonly pusher_type?: string;
  readonly pages?: GitHubWikiPage[];
}

export type GitHubEventType =
  | 'PushEvent'
  | 'IssuesEvent'
  | 'PullRequestEvent'
  | 'IssueCommentEvent'
  | 'CreateEvent'
  | 'DeleteEvent'
  | 'ReleaseEvent'
  | 'WatchEvent'
  | 'ForkEvent'
  | 'MemberEvent'
  | 'CommitCommentEvent'
  | 'PullRequestReviewEvent'
  | 'PullRequestReviewCommentEvent'
  | 'GollumEvent'
  | 'DiscussionEvent'
  | 'PublicEvent';

export interface GitHubEvent {
  readonly id: string;
  readonly type: GitHubEventType;
  readonly actor: GitHubActor;
  readonly repo: GitHubRepo;
  readonly payload: GitHubPayload;
  readonly public: boolean;
  readonly created_at: string;
}
