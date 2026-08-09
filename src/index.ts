#!/usr/bin/env node
import { parseArgs } from "node:util";

function main(){
    const { positionals } = parseArgs({
      options: {},
      allowPositionals: true,
      strict: true,
    })
    console.log(positionals);
    const [username, ...extra] = positionals;
    if (extra.length > 0){
      console.error(`Wrong Usage:\n\tExtra arguments detected: ${extra.join(',')}`);
      console.error(`Correct Usage:\n\t"github-activity <username>"`);
      process.exit(1);
    }
    console.log(`Hello ${username}`);
}

main();