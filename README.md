# Yougile MCP Server

The Yougile MCP Server brings the power of Model Context Protocol (MCP) to Yougile, allowing AI agents and developer tools to interact programmatically with your Yougile workspace.

## What can you do with it?

This server unlocks all sorts of useful capabilities for anyone working with Yougile:

- Manage projects (get, create, update)
- Manage tasks (get, create, update, assign)
- Manage users (invite, get details, update)
- Manage boards and columns
- Update task statuses and move tasks between columns
- Build smart apps that interact naturally with Yougile

## Prerequisites

- Node.js 18 or higher
- A Yougile account with appropriate permissions
- An API key for your Yougile company

## Getting Your Yougile API Key

### Method 1: Using the Yougile Web Interface
1. Log in to your Yougile account at https://yougile.com
2. Go to Settings > API Keys
3. Create a new API key with the necessary permissions
4. Copy the API key (save it securely, as you won't be able to see it again)

### Method 2: Using cURL

You can get your API key programmatically using the following cURL command:

```bash
curl -X POST "https://yougile.com/api-v2/auth/keys" \
  -H "Content-Type: application/json" \
  -d '{
    "login": "your_email@example.com",
    "password": "your_password",
    "companyName": "Your Company Name"
  }'
```

Note: This creates a new API key. Make sure to save the returned API key securely.

### Method 3: Get existing API keys

To retrieve your existing API keys:

```bash
curl -X POST "https://yougile.com/api-v2/auth/keys/get" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_EXISTING_API_KEY" \
  -d '{
    "company": "Company ID or Name"
  }'
```

## Installation

1. Clone or download this repository
2. Install dependencies:
```bash
npm install
```

3. Build the server:
```bash
npm run build
```

## Configuration

### MCP Configuration

The server is configured through the `.kilocode/mcp.json` file. Update the configuration with your API key:

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
      },
      "disabled": false,
      "alwaysAllow": []
    }
  }
}
```

For Claude Desktop or other MCP-compatible tools, you can add Yougile by updating your MCP configuration file:

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

Alternatively, if you prefer to manage your API key through system environment variables:

```json
{
  "mcpServers": {
    "yougile-mcp": {
      "command": "node",
      "args": [
        "D:\\Projects\\yougile-mcp\\yougile.js"
      ],
      "env": {
        "YOUGILE_API_KEY": "${env.YOUGILE_API_KEY}"
      }
    }
  }
}
```

### Environment Variables

- `YOUGILE_API_KEY` - Your Yougile API token (required)
- `YOUGILE_API_HOST_URL` (optional) - The host URL of the Yougile API Server. Defaults to https://yougile.com/api-v2/

## Available Tools

### Users
- `get_users` - Get all users in the company
- `get_user` - Get a specific user by ID
- `create_user` - Invite a user to the company
- `update_user` - Update an existing user
- `delete_user` - Remove a user from the company

### Projects
- `get_projects` - Get all projects for the current user
- `get_project` - Get a specific project by ID
- `create_project` - Create a new project
- `update_project` - Update an existing project

### Tasks
- `get_tasks` - Get all tasks for a specific project or column
- `get_task` - Get a specific task by ID
- `create_task` - Create a new task
- `update_task` - Update an existing task

### Boards
- `get_boards` - Get all boards in the company
- `get_board` - Get a specific board by ID
- `create_board` - Create a new board
- `update_board` - Update an existing board

### Columns
- `get_columns` - Get all columns in a board
- `get_column` - Get a specific column by ID
- `create_column` - Create a new column
- `update_column` - Update an existing column

### Task Chat/Comments
- `get_task_chat` - Get chat messages/comments for a specific task
- `send_task_message` - Send a message/comment to a specific task's chat
- `get_task_messages` - Get messages/comments for a specific task (alternative method)

## Usage

### Claude Desktop

You can add Yougile to Claude Desktop by updating your MCP configuration file:

```json
{
  "mcpServers": {
    "yougile-mcp": {
      "command": "node",
      "args": [
        "path/to/yougile.js"
      ],
      "env": {
        "YOUGILE_API_KEY": "${env.YOUGILE_API_KEY}"
      }
    }
  }
}
```

### Command Line

To run the server directly:
```bash
npm run serve
```

## Development

To build the TypeScript code:
```bash
npm run build
```

To run in development mode with auto-rebuild:
```bash
npm run dev
```

## API Documentation

For more details about the Yougile API endpoints, see the OpenAPI specification at `docs/open-api-v2.json`.

## License

This project is licensed under the MIT License.