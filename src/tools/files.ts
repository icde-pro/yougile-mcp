import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import * as fs from "fs";
import * as path from "path";
import axios from "axios";

import { logRequest, logResponse, logError } from "../common/logger.js";

async function uploadFileToYougile(filePath: string): Promise<string> {
  const hostUrl = process.env.YOUGILE_API_HOST_URL || "https://yougile.com/api-v2/";
  const host = hostUrl.endsWith("/") ? hostUrl : `${hostUrl}`;
  const url = `${host}upload-file`;
  
  const headers: Record<string, string> = {
    "Authorization": `Bearer ${process.env.YOUGILE_API_KEY || ""}`,
  };

  logRequest("POST", url, headers, `file: ${filePath}`);

  try {
    const formData = new FormData();
    const fileContent = fs.readFileSync(filePath);
    const fileName = path.basename(filePath);
    
    formData.append("file", new Blob([fileContent]), fileName);

    const response = await axios.post(url, formData, {
      headers: {
        ...headers,
        "Content-Type": "multipart/form-data",
      },
    });

    logResponse(url, response.status, response.data);
    
    // Return the file URL
    return response.data.url || response.data.fileUrl || response.data;
  } catch (error) {
    logError(url, error);
    
    if (axios.isAxiosError(error)) {
      throw new Error(`File upload failed: ${error.message}`);
    }
    throw error;
  }
}

export const registerFileTools = (server: McpServer) => {
  server.tool(
    "upload_file",
    "Upload a file to YouGile and get its URL",
    {
      filePath: z.string().describe("The local path to the file to upload"),
    },
    async ({ filePath }) => {
      try {
        const fileUrl = await uploadFileToYougile(filePath);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ 
                success: true, 
                filePath,
                fileUrl 
              }, null, 2),
            },
          ],
        };
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ 
                success: false, 
                error: errorMessage 
              }, null, 2),
            },
          ],
        };
      }
    }
  );
};
