import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { getVersion } from "./common/version.js";
import { registerTools } from "./tools/index.js";

export function createServer() {
  const version = getVersion();

  const server = new McpServer({
    name: "yougile-mcp-server",
    version,
    capabilities: {
      tools: {
        list: true,
      },
    },
  });

  registerTools(server);

  return { server, version };
}