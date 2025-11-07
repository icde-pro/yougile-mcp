# Yougile MCP Server - Project Context

## Project Overview

The Yougile MCP Server is a Model Context Protocol (MCP) server that enables AI agents and developer tools to interact programmatically with Yougile workspaces. It provides a bridge between MCP-compatible clients (like Claude Desktop) and the Yougile API, allowing for management of projects, tasks, users, boards, columns, and task discussions.

## Architecture

The project is built using:
- **TypeScript**: For type-safe development
- **Node.js**: Runtime environment
- **@modelcontextprotocol/sdk**: MCP protocol implementation
- **Axios**: HTTP client for API requests
- **Zod**: Runtime validation for tool parameters
- **Dotenv**: Environment variable management

The codebase follows a modular structure:
- `src/`: TypeScript source files
  - `src/common/`: Shared utilities (API request handler, version management)
  - `src/tools/`: Individual tool implementations for different Yougile features
  - `src/index.ts`: Main entry point
  - `src/server.ts`: MCP server initialization
- `build/`: Compiled JavaScript output
- `docs/`: API documentation (OpenAPI specification)

## Available Tools

### Core Management Tools
- **User Management**: `get_users`, `get_user`, `create_user`, `update_user`, `delete_user`
- **Project Management**: `get_projects`, `get_project`, `create_project`, `update_project`
- **Task Management**: `get_tasks`, `get_task`, `create_task`, `update_task`
- **Board Management**: `get_boards`, `get_board`, `create_board`, `update_board`
- **Column Management**: `get_columns`, `get_column`, `create_column`, `update_column`

### Chat/Comment Tools
- **Task Discussions**: `get_task_chat`, `send_task_message`, `get_task_messages`

## Building and Running

### Prerequisites
- Node.js 18 or higher
- A Yougile account with API access
- Valid Yougile API key

### Setup and Installation
1. Install dependencies:
   ```
   npm install
   ```

2. Build the server:
   ```
   npm run build
   ```

3. Configure the MCP server with your API key in `.kilocode/mcp.json` or system environment

### Available Scripts
- `npm run build`: Compiles TypeScript to JavaScript
- `npm run serve`: Builds and runs the server
- `npm run dev`: Development mode with auto-rebuild
- `npm start`: Runs the main entry point

## Configuration

### MCP Configuration
The server integrates with MCP-compatible tools via configuration in `.kilocode/mcp.json` or equivalent. Key configuration:

```json
{
  "mcpServers": {
    "yougile-mcp": {
      "command": "node",
      "args": [
        "D:\\Projects\\yougile-mcp\\yougile.js"
      ],
      "env": {
        "YOUGILE_API_KEY": "your_actual_api_key_here"
      }
    }
  }
}
```

### Environment Variables
- `YOUGILE_API_KEY`: Required - Your Yougile API token
- `YOUGILE_API_HOST_URL`: Optional - API host URL (defaults to https://yougile.com/api-v2/)

## Development Conventions

- All API requests are made through the `makeYougileRequest` function in `request-helper.ts`
- Tools follow the pattern of using Zod for input validation and returning structured content
- Error handling is implemented with try-catch blocks and proper error messages
- The server uses Bearer token authentication for Yougile API calls
- Tools are organized by functionality in separate files within the `src/tools/` directory

## API Integration

The server communicates with the Yougile API v2 using:
- Base URL: `https://yougile.com/api-v2/` (configurable)
- Authentication: Bearer token via `Authorization` header
- Content type: `application/json`
- Supported methods: GET, POST, PUT, DELETE

## Deployment

The server can be run directly using Node.js after building:
1. Ensure `YOUGILE_API_KEY` is available in the environment
2. Run `npm run serve` or execute `node yougile.js` directly
3. The server will automatically build if needed and start the MCP service

## Troubleshooting

Common issues:
- API key not set: Ensure `YOUGILE_API_KEY` is properly configured
- Build issues: Run `npm run build` to compile TypeScript
- Connection closed errors: Check API key validity and network connectivity
- Method not found: Verify tool names match those defined in the server

## Files Structure
- `package.json` - Project dependencies and scripts
- `tsconfig.json` - TypeScript compiler configuration
- `yougile.js` - Main entry point that handles auto-building
- `README.md` - Project documentation
- `src/` - TypeScript source code
- `build/` - Compiled JavaScript code
- `docs/open-api-v2.json` - Yougile API OpenAPI specification