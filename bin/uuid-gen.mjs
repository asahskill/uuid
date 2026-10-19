#!/usr/bin/env node
import { v4, v7 } from '../src/index.mjs';

const args = process.argv.slice(2);
let version = 'v7';
let count = 1;
try {
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--help' || arg === '-h') {
      console.log('Usage: uuid-gen [--v4|--v7] [--count N]\nGenerate secure UUIDs; default: v7.');
      process.exit(0);
    }
    if (arg === '--v4' || arg === '--v7') version = arg.slice(2);
    else if (arg === '--count' || arg === '-n') {
      const value = args[++i];
      if (!/^[1-9]\d*$/.test(value ?? '') || !Number.isSafeInteger(Number(value)) || Number(value) > 100000) {
        throw new Error('Count must be an integer from 1 to 100000');
      }
      count = Number(value);
    } else throw new Error(`Unknown option: ${arg}`);
  }
  for (let i = 0; i < count; i++) console.log(version === 'v4' ? v4() : v7());
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
