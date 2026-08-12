export interface Post  {
    id: number,
    type: string,
    actor: {
      id: number,
      login: string,
      display_login: string,
      gravatar_id: string,
      url: string,
      avatar_url: string
    },
    repo: {
      id: number,
      name: string,
      url: string
    },
    payload: {
      action: string,
      ref: string,
      ref_type: string,
      full_ref: string,
      state: string,
      issue: { state: string },
      master_branch: string,
      description: string,
      pusher_type: string
    },
    public: boolean,
    created_at: string
}

export type Events = {
    push: { 
      count: number 
    },
    issues: {
      open: number,
      Close: number,
      comment: number
    },
    pullRequest: {
      open: number,
      close: {
        merged: number,
        rejected: number
      }
    },
    create: {
      repository: number,
      branch: number
    },
    delete: {
      count: number
    },
    fork: {
      count: number
    }
};

export type Repo = {
    type: string,
    name: string,
    repo: {
      id: number,
      name: string,
      url: string
    },
    payload: {
      action: string,
      ref: string,
      ref_type: string,
      state: string,
      issue: { state: string }
    },
    events: object
}


// export type Payload = {
//   action: string,
//   state: string,
// }