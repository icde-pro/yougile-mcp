import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { makeYougileRequest } from "../common/request-helper.js";

export const registerTaskTools = (server: McpServer) => {
  server.tool(
    "get_tasks",
    "Get all tasks for a specific project or column",
    {
      projectId: z.string().optional().describe("The ID of the project to get tasks from"),
      columnId: z.string().optional().describe("The ID of the column to get tasks from"),
      limit: z.number().optional().describe("Limit number of tasks returned"),
      offset: z.number().optional().describe("Offset for pagination"),
    },
    async ({ projectId, columnId, limit, offset }) => {
      // Build query parameters
      const queryParams = new URLSearchParams();
      if (projectId) queryParams.append('projectId', projectId);
      if (columnId) queryParams.append('columnId', columnId);
      if (limit) queryParams.append('limit', limit.toString());
      if (offset) queryParams.append('offset', offset.toString());

      const queryString = queryParams.toString();
      const path = `task-list${queryString ? '?' + queryString : ''}`;
      
      const tasks = await makeYougileRequest("GET", path);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(tasks, null, 2),
          },
        ],
      };
    }
  );

  server.tool(
    "get_task",
    "Get a specific task by ID",
    {
      id: z.string().describe("The ID of the task to retrieve"),
    },
    async ({ id }) => {
      const task = await makeYougileRequest("GET", `tasks/${id}`);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(task, null, 2),
          },
        ],
      };
    }
  );

  server.tool(
    "create_task",
    "Create a new task",
    {
      title: z.string().describe("The title of the task"),
      columnId: z.string().describe("The ID of the column to add the task to"),
      description: z.string().optional().describe("The description of the task"),
      assignedTo: z.array(z.string()).optional().describe("Array of user IDs to assign the task to"),
      priority: z.string().optional().describe("Priority level (e.g., high, medium, low)"),
    },
    async ({ title, columnId, description, assignedTo, priority }) => {
      const taskData: any = { 
        title,
        columnId
      };
      if (description) taskData.description = description;
      if (assignedTo) taskData.assignedTo = assignedTo;
      if (priority) taskData.priority = priority;

      const result = await makeYougileRequest("POST", "tasks", taskData);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }
  );

  server.tool(
    "update_task",
    "Update an existing task",
    {
      id: z.string().describe("The ID of the task to update"),
      title: z.string().optional().describe("The new title of the task"),
      description: z.string().optional().describe("The new description of the task"),
      columnId: z.string().optional().describe("The new column ID for the task"),
      assignedTo: z.array(z.string()).optional().describe("Array of new user IDs to assign the task to"),
      priority: z.string().optional().describe("New priority level (e.g., high, medium, low)"),
    },
    async ({ id, title, description, columnId, assignedTo, priority }) => {
      const taskData: any = {};
      if (title) taskData.title = title;
      if (description) taskData.description = description;
      if (columnId) taskData.columnId = columnId;
      if (assignedTo) taskData.assignedTo = assignedTo;
      if (priority) taskData.priority = priority;

      const result = await makeYougileRequest("PUT", `tasks/${id}`, taskData);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }
  );
};