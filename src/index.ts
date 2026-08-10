#!/usr/bin/env node
import { parseArgs } from "node:util";

function isValidGitHubUsername(username: string): boolean {
    const GITHUB_USERNAME_REGEX = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;
    return GITHUB_USERNAME_REGEX.test(username);
}

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

async function getActivity(link: string): Promise<void> {
  try {
    const res = await fetch(link);

    if (!res.ok){
        throw new Error(`Requisition error: {res.status}`);
      }
      //get the data with my typescript interface
      const data = (await res.json()) as Post;
      // console.log(`I get:\n
      //   \tUserId:${data.userId}\n\tid:${data.id}\n\ttitle:${data.title}\n\tbody:${data.body}\n`);
      console.log(data);
  } catch (error: any) {
  console.error(`Unexpected error: ${error.message}`);
  process.exit(1);
  }
}

async function main(){
  try{
    const { positionals } = parseArgs({
      options: {},
      allowPositionals: true,
      strict: true,
    })
    console.log(positionals);
    const [username, ...extra] = positionals;
    if (extra.length > 0){
      console.error(`Wrong Usage:\n\tExtra arguments detected: ${extra.join(',')}`);
      console.error(`Usage correct :\n\tgithub-activity <username>`);
      process.exit(1);
    }
    if (!username){
      console.error("Error: Any username given.");
      console.error(`Usage correct :\n\tgithub-activity <username>`);
      process.exit(1);
    }
    else if (username.length > 39 || !isValidGitHubUsername(username)){
      console.error("Error: Invalid username.");
      console.error(`A valid GitHub username must be between 1 and 39 characters long and can only contain alphanumeric characters (letters and numbers) and single hyphens`);
      process.exit(1);
    }
    const link = `https://api.github.com/users/${username}/events`; 
    console.log(link);
    await getActivity(link);
  } catch (error: any) {
    console.error(`Unexpected error: ${error.message}`);
    process.exit(1);
  }
}

main();