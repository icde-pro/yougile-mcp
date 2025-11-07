import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { makeYougileRequest } from "../common/request-helper.js";

export const registerTaskChatTools = (server: McpServer) => {
  server.tool(
    "get_task_chat",
    "Get chat messages for a specific task",
    {
      taskId: z.string().describe("The ID of the task to get chat messages for (use the task UUID)"),
      limit: z.number().optional().describe("Limit number of messages returned"),
      offset: z.number().optional().describe("Offset for pagination"),
    },
    async ({ taskId, limit, offset }) => {
      try {
        // Build query parameters for pagination
        let queryString = '';
        if (limit !== undefined || offset !== undefined) {
          const params = new URLSearchParams();
          if (limit !== undefined) params.append('limit', limit.toString());
          if (offset !== undefined) params.append('offset', offset.toString());
          queryString = '?' + params.toString();
        }

        // Use the correct Yougile API endpoint: /api-v2/chats/{taskId}/messages
        const path = `chats/${taskId}/messages${queryString}`;
        const messages = await makeYougileRequest("GET", path);
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(messages, null, 2),
            },
          ],
        };
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return {
          content: [
            {
              type: "text",
              text: `Error retrieving chat messages: ${errorMessage}`,
            },
          ],
        };
      }
    }
  );

  server.tool(
    "send_task_message",
    "Send a message to a specific task's chat",
    {
      taskId: z.string().describe("The ID of the task to send the message to (use the task UUID)"),
      text: z.string().describe("The message text to send"),
    },
    async ({ taskId, text }) => {
      try {
        const messageData = { text };
        
        // For sending messages, we need to determine if Yougile uses the same pattern
        // Based on the GET pattern, it's likely: /api-v2/chats/{taskId}/messages
        const result = await makeYougileRequest("POST", `chats/${taskId}/messages`, messageData);
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return {
          content: [
            {
              type: "text",
              text: `Error sending message: ${errorMessage}`,
            },
          ],
        };
      }
    }
  );

  server.tool(
    "get_task_messages",
    "Get messages for a specific task (alternative method)",
    {
      taskId: z.string().describe("The ID of the task to get messages for (use the task UUID)"),
      limit: z.number().optional().describe("Limit number of messages returned"),
      offset: z.number().optional().describe("Offset for pagination"),
    },
    async ({ taskId, limit, offset }) => {
      try {
        // Build query parameters for pagination
        let queryString = '';
        if (limit !== undefined || offset !== undefined) {
          const params = new URLSearchParams();
          if (limit !== undefined) params.append('limit', limit.toString());
          if (offset !== undefined) params.append('offset', offset.toString());
          queryString = '?' + params.toString();
        }

        // Alternative method using the correct endpoint
        const path = `chats/${taskId}/messages${queryString}`;
        const messages = await makeYougileRequest("GET", path);
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(messages, null, 2),
            },
          ],
        };
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return {
          content: [
            {
              type: "text",
              text: `Error retrieving messages: ${errorMessage}`,
            },
          ],
        };
      }
    }
  );
};