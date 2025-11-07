#!/usr/bin/env node
const {spawnSync} = require('child_process');
const {existsSync} = require('fs');
const {join} = require('path');
require('dotenv/config');

// Check if the required environment variables are set
if (!process.env.YOUGILE_API_KEY) {
    console.error("Error: YOUGILE_API_KEY environment variable is not set.");
    console.error("Please add YOUGILE_API_KEY to your .env file or environment.");
    process.exit(1);
}

console.error("Starting Yougile MCP server from directory:", __dirname);
console.error("Current working directory:", process.cwd());
console.error("Build path:", join(__dirname, 'build', 'index.js'));

// Check if build directory exists and build if needed
const buildPath = join(__dirname, 'build', 'index.js');

if (!existsSync(buildPath)) {
    console.error("Build file does not exist, attempting to build...");
    const result = spawnSync('npx', ['tsc'], {stdio: 'pipe', shell: true});

    if (result.status !== 0) {
        console.error('TypeScript compilation failed');
        console.error(result.stderr?.toString() || 'Unknown error');
        process.exit(1);
    }
    console.error("Build completed successfully");
} else {
    console.error("Build file exists, proceeding to start server");
}

// Import and run the built server
async function startServer() {
    try {
        await require(buildPath);
        console.error("Server imported successfully");
    } catch (error) {
        console.error('Failed to start Yougile MCP server:', error.message);
        console.error('Stack trace:', error.stack);
        process.exit(1);
    }
}

startServer();

// Keep the process alive for MCP communication through stdio
process.stdin.resume();