#!/usr/bin/env node
import 'dotenv/config';
import { spawnSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

// Check if the required environment variables are set
if (!process.env.YOUGILE_API_KEY) {
  console.error("Error: YOUGILE_API_KEY environment variable is not set.");
  console.error("Please add YOUGILE_API_KEY to your .env file or environment.");
  process.exit(1);
}

// Check if build directory exists and build if needed
const buildPath = join(process.cwd(), 'build', 'index.js');

if (!existsSync(buildPath)) {
  console.log('Build not found, running TypeScript compilation...');
  const result = spawnSync('npx', ['tsc'], { stdio: 'inherit', shell: true });
  
  if (result.status !== 0) {
    console.error('TypeScript compilation failed');
    process.exit(1);
  }
  
  console.log('TypeScript compilation completed');
}

// Now import and run the built server
import('./build/index.js');

// Keep the process alive for MCP communication through stdio
process.stdin.resume();