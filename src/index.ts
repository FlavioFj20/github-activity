#!/usr/bin/env node
import { type GitHubEvent } from './types.js';
import { parseArgs } from "node:util";
import { checkExtraInputs, validateUser } from "./utils.js";
import { processEvents } from './process_events.js';

async function getActivity(link: string): Promise<GitHubEvent[]> {
  try {
    const res = await fetch(link);

    if (!res.ok){
        throw new Error(`Requisition error: {res.status}`);
      }
      const data: GitHubEvent[] = (await res.json()) as GitHubEvent[];
      processEvents(data);
      return data;
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

    checkExtraInputs(extra);
    validateUser(username);

    const link = `https://api.github.com/users/${username}/events`; 
    //console.log(link);
    await getActivity(link);

  } catch (error: any) {
    console.error(`Unexpected error: ${error.message}`);
    process.exit(1);
  }
}

main();