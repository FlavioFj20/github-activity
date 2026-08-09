#!/usr/bin/env node
import { parseArgs } from "node:util";

function main(){
    const { positionals } = parseArgs({
      options: {},
      allowPositionals: true,
      strict: true,
    })
    console.log(positionals);
}