import { type Post } from './types.js';

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
                    break;
                default:
                    console.log("Unknown: ",e.type, "\n");
           } 
        }
    )
}