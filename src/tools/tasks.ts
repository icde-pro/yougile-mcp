import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { makeYougileRequest } from "../common/request-helper.js";

export const registerTaskTools = (server: McpServer) => {
  server.tool(
    "get_tasks",
    "Get tasks list. IMPORTANT: YouGile API does NOT support projectId filter! Use columnId or assignedTo instead. For complete user task list, use get_user_tasks.",
    {
      columnId: z.string().optional().describe("Filter by column ID"),
      assignedTo: z.string().optional().describe("Comma-separated user IDs to filter by assignee"),
      title: z.string().optional().describe("Filter by task title (partial match)"),
      limit: z.number().optional().describe("Limit number of tasks returned (default: 100)"),
      offset: z.number().optional().describe("Offset for pagination"),
    },
    async ({ columnId, assignedTo, title, limit, offset }) => {
      // Build query parameters - NOTE: projectId is NOT supported by YouGile API!
      const queryParams = new URLSearchParams();
      if (columnId) queryParams.append('columnId', columnId);
      if (assignedTo) queryParams.append('assignedTo', assignedTo);
      if (title) queryParams.append('title', title);
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
    "get_user_tasks",
    "Get ALL tasks assigned to a user. Uses assignedTo filter which works correctly for all projects.",
    {
      userId: z.string().describe("The user ID to get tasks for"),
      includeCompleted: z.boolean().optional().describe("Include completed tasks (default: false)"),
      includeArchived: z.boolean().optional().describe("Include archived tasks (default: false)"),
    },
    async ({ userId, includeCompleted = false, includeArchived = false }) => {
      // Use assignedTo filter directly - it works for all projects!
      const response = await makeYougileRequest("GET", `task-list?assignedTo=${userId}&limit=500`) as any;
      
      const allTasks: any[] = [];
      const tasks = response.content || [];
      
      for (const task of tasks) {
        // Filter by completion/archived status
        if (!includeCompleted && task.completed) continue;
        if (!includeArchived && task.archived) continue;
        allTasks.push(task);
      }
      
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            total: allTasks.length,
            tasks: allTasks,
          }, null, 2),
        }],
      };
    }
  );

  server.tool(
    "get_task",
    "Get a specific task by ID (supports both UUID and task code like SAI-515)",
    {
      id: z.string().describe("The ID or code of the task (e.g., 'SAI-515' or UUID)"),
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
      assigned: z.array(z.string()).optional().describe("Array of user IDs to assign the task to"),
    },
    async ({ title, columnId, description, assigned }) => {
      const taskData: any = { 
        title,
        columnId
      };
      if (description) taskData.description = description;
      if (assigned) taskData.assigned = assigned;

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
      assigned: z.array(z.string()).optional().describe("Array of user IDs to assign the task to"),
      completed: z.boolean().optional().describe("Mark task as completed"),
      archived: z.boolean().optional().describe("Archive/unarchive the task"),
    },
    async ({ id, title, description, columnId, assigned, completed, archived }) => {
      const taskData: any = {};
      if (title !== undefined) taskData.title = title;
      if (description !== undefined) taskData.description = description;
      if (columnId !== undefined) taskData.columnId = columnId;
      if (assigned !== undefined) taskData.assigned = assigned;
      if (completed !== undefined) taskData.completed = completed;
      if (archived !== undefined) taskData.archived = archived;

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
