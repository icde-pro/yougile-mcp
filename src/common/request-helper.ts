import axios, { AxiosRequestConfig } from "axios";
import { logRequest, logResponse, logError } from "./logger.js";

export async function makeYougileRequest<T>(method: string, path: string, body: any = null): Promise<T> {
  const hostUrl = process.env.YOUGILE_API_HOST_URL || "https://yougile.com/api-v2/";
  const host = hostUrl.endsWith("/") ? hostUrl : `${hostUrl}`;
  const url = `${host}${path}`;
  const headers: Record<string, string> = {
    "Authorization": `Bearer ${process.env.YOUGILE_API_KEY || ""}`,
    "Content-Type": "application/json"
  };

  // Only add Content-Type for non-GET requests if it's not already set
  if (method.toUpperCase() !== 'GET') {
    headers["Content-Type"] = "application/json";
  }

  // Log the request
  logRequest(method, url, headers, body);

  try {
    const config: AxiosRequestConfig = {
      url,
      method,
      headers,
    };

    // Only include body for non-GET requests
    if (method.toUpperCase() !== 'GET' && body !== null) {
      config.data = body;
    }

    const response = await axios(config);
    
    // Log the response
    logResponse(url, response.status, response.data);
    
    return response.data;
  } catch (error) {
    // Log the error
    logError(url, error);
    
    if (axios.isAxiosError(error)) {
      throw new Error(`Request failed: ${error.message}`);
    }
    throw error;
  }
}