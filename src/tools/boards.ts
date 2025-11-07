import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { makeYougileRequest } from "../common/request-helper.js";

export const registerBoardTools = (server: McpServer) => {
  server.tool(
    "get_boards",
    "Get all boards in the company",
    {
      limit: z.number().optional().describe("Limit number of boards returned"),
      offset: z.number().optional().describe("Offset for pagination"),
      title: z.string().optional().describe("Filter by board title"),
      projectId: z.string().optional().describe("Filter by project ID"),
    },
    async ({ limit, offset, title, projectId }) => {
      // Build query parameters
      const queryParams = new URLSearchParams();
      if (limit) queryParams.append('limit', limit.toString());
      if (offset) queryParams.append('offset', offset.toString());
      if (title) queryParams.append('title', title);
      if (projectId) queryParams.append('projectId', projectId);

      const queryString = queryParams.toString();
      const path = `boards${queryString ? '?' + queryString : ''}`;
      
      const boards = await makeYougileRequest("GET", path);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(boards, null, 2),
          },
        ],
      };
    }
  );

  server.tool(
    "get_board",
    "Get a specific board by ID",
    {
      id: z.string().describe("The ID of the board to retrieve"),
    },
    async ({ id }) => {
      const board = await makeYougileRequest("GET", `boards/${id}`);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(board, null, 2),
          },
        ],
      };
    }
  );

  server.tool(
    "create_board",
    "Create a new board",
    {
      title: z.string().describe("The title of the board"),
      projectId: z.string().describe("The ID of the project the board belongs to"),
      description: z.string().optional().describe("The description of the board"),
    },
    async ({ title, projectId, description }) => {
      const boardData: any = { 
        title,
        projectId
      };
      if (description) boardData.description = description;

      const result = await makeYougileRequest("POST", "boards", boardData);
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
    "update_board",
    "Update an existing board",
    {
      id: z.string().describe("The ID of the board to update"),
      title: z.string().optional().describe("The new title of the board"),
      description: z.string().optional().describe("The new description of the board"),
    },
    async ({ id, title, description }) => {
      const boardData: any = {};
      if (title) boardData.title = title;
      if (description) boardData.description = description;

      const result = await makeYougileRequest("PUT", `boards/${id}`, boardData);
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