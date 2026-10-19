#!/usr/bin/env node

import { generateUuids } from "./index.js";

function printHelp() {
  console.log(`Usage: uuid [options]

Generate one or more UUID v4 values.

Options:
  -n, --count <number>  Number of UUIDs to generate (default: 1)
  -h, --help            Show this help message`);
}

function parseArgs(args) {
  let count = 1;

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === "-h" || arg === "--help") {
      return { help: true };
    }

    if (arg === "-n" || arg === "--count") {
      const value = args[index + 1];
      if (value === undefined || value.startsWith("-")) {
        throw new Error(`${arg} requires a positive integer`);
      }

      count = Number(value);
      index += 1;
      continue;
    }

    throw new Error(`Unknown option: ${arg}`);
  }

  if (!Number.isSafeInteger(count) || count < 1) {
    throw new Error("count must be a positive safe integer");
  }

  return { count };
}

try {
  const options = parseArgs(process.argv.slice(2));

  if (options.help) {
    printHelp();
  } else {
    for (const uuid of generateUuids(options.count)) {
      console.log(uuid);
    }
  }
} catch (error) {
  console.error(`Error: ${error.message}`);
  console.error('Run "uuid --help" for usage.');
  process.exitCode = 1;
}
