import { Payload } from './../dist/types.d';
import { type Post, type Repo } from './types.js';

const repos: Repo[] = [];

const processIssue = (e: Post) => {
        const {action, issue} = e.payload;
        //const { state } = issue ? issue : { state: ""};
        const { state } = issue ;
        console.log("Kind of issue:")
        console.log(action, state, "\n");
}

const addRepo = (e: Post) => {
    if (repos.length == 0){
        const type = e.type, name = e.repo.name, repo = e.repo, payload = e.payload, ev = new Object;
        repos.push({ type, name, repo, payload, ev })
    }
}

export const processEvents = (events: Post[]) => {
    events.forEach(
        (e) => {
           switch(e.type){
                case 'PushEvent': 
                    console.log("Push: ", e.type);
                    break;
                case 'CreateEvent': 
                    console.log("Create: ", e.type);
                    break;
                case 'IssuesEvent': 
                    console.log(e.type);
                    processIssue(e);
                    break;
                case 'DeleteEvent': 
                    console.log("Delete: ", e.type);
                    break;
                case 'ReleaseEvent': 
                    console.log("Release: ", e.type);
                    break;
                case 'PullRequestEvent': 
                    console.log("PullRequest: ", e.type);
                    break;
                case 'IssueCommentEvent': 
                    console.log(e.type);
                    processIssue(e);
                    break;
                default:
                    console.log("Unknown: ",e.type, "\n");
           } 
        }
    )
}