#!/usr/bin/env node
import {StdioServerTransport} from "@modelcontextprotocol/sdk/server/stdio.js";
import 'dotenv/config';

import {createServer} from "./server.js";

// Check if the required environment variables are set
if (!process.env.YOUGILE_API_KEY) {
    console.error("Error: YOUGILE_API_KEY environment variable is not set.");
    console.error("Please add YOUGILE_API_KEY to your .env file or environment.");
    process.exit(1);
}

try {
    const {server, version} = createServer();
    const transport = new StdioServerTransport();

    // Connect the server to the transport
    server.connect(transport).catch(error => {
        console.error("Fatal error connecting server:", error);
        process.exit(1);
    });
} catch (error) {
    console.error("Fatal error in main():", error);
    process.exit(1);
}