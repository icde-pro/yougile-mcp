# Yougile MCP Server

The Yougile MCP Server brings the power of Model Context Protocol (MCP) to Yougile, allowing AI agents and developer
tools to interact programmatically with your Yougile workspace.

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

The server is configured through the global MCP configuration file. Update the configuration with your API key:

```json
{
  "mcpServers": {
    "yougile-mcp": {
      "command": "node",
      "args": [
        "D:\\Projects\\yougile-mcp\\yougile.cjs"
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

For Claude Desktop or other MCP-compatible tools, you can add Yougile by updating your global MCP configuration file (
typically located at `C:\Users\{username}\.kilocode\globalStorage\kilo code.kilo-code\settings\mcp_settings.json`):

```json
{
  "mcpServers": {
    "yougile-mcp": {
      "command": "node",
      "args": [
        "D:\\Projects\\yougile-mcp\\yougile.cjs"
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
        "D:\\Projects\\yougile-mcp\\yougile.cjs"
      ],
      "env": {
        "YOUGILE_API_KEY": "${env.YOUGILE_API_KEY}"
      }
    }
  }
}
```

### Troubleshooting

If you experience "MCP error -32000: Connection closed" when working with different projects:

1. Make sure the server file extension is `.cjs` (CommonJS) rather than `.js` (ES modules) to properly support
   `__dirname`
2. Ensure that the path in your MCP configuration points to `yougile.cjs` and not `yougile.js`
3. If the problem persists, check that your global MCP configuration is properly set up
4. Restart your MCP client (Claude Desktop, KiloCode, etc.) after making configuration changes

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

## API Coverage

This MCP server implements **~30%** of the Yougile API v2.0 endpoints.

### ✅ Implemented (20 endpoints)

#### Users (5 methods)
- `GET /api-v2/users` - Get all users
- `GET /api-v2/users/{id}` - Get user by ID
- `POST /api-v2/users` - Invite user to company
- `PUT /api-v2/users/{id}` - Update user
- `DELETE /api-v2/users/{id}` - Remove user from company

#### Projects (4 methods)
- `GET /api-v2/projects` - Get all projects
- `GET /api-v2/projects/{id}` - Get project by ID
- `POST /api-v2/projects` - Create project
- `PUT /api-v2/projects/{id}` - Update project

#### Tasks (4 methods)
- `GET /api-v2/task-list` - Get all tasks
- `GET /api-v2/tasks/{id}` - Get task by ID
- `POST /api-v2/tasks` - Create task
- `PUT /api-v2/tasks/{id}` - Update task

#### Boards (4 methods)
- `GET /api-v2/boards` - Get all boards
- `GET /api-v2/boards/{id}` - Get board by ID
- `POST /api-v2/boards` - Create board
- `PUT /api-v2/boards/{id}` - Update board

#### Columns (4 methods)
- `GET /api-v2/columns` - Get all columns
- `GET /api-v2/columns/{id}` - Get column by ID
- `POST /api-v2/columns` - Create column
- `PUT /api-v2/columns/{id}` - Update column

#### Task Chat (3 methods)
- `GET /api-v2/chats/{chatId}/messages` - Get task chat messages
- `POST /api-v2/chats/{chatId}/messages` - Send message to task chat
- `GET /api-v2/chats/{chatId}/messages` - Get task messages (alternative)

### ❌ Not Implemented (45+ endpoints)

#### Auth
- Companies list, API keys management (create, list, delete)

#### Companies
- Get company details, update company

#### Departments
- Full CRUD operations for departments

#### Project Roles
- Full CRUD operations for project roles

#### Stickers
- String stickers (with states) - full CRUD
- Sprint stickers - full CRUD
- Sticker states management

#### Group Chats
- Full CRUD operations for group chats

#### Webhooks
- Create, list, update webhooks

#### Files
- File upload functionality

#### CRM
- Contact persons management
- External ID lookup

#### Additional
- Task chat subscribers management
- Delete operations for tasks, boards, columns

## API Documentation

For more details about the Yougile API endpoints, see the OpenAPI specification at `docs/open-api-v2.json`.

## License

This project is licensed under the MIT License.