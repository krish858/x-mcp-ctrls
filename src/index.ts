import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { TwitterApi } from "twitter-api-v2";
import "dotenv/config";

const server = new McpServer({
  name: "x-mcp-ctrls",
  version: "1.0.0",
});

const X_BEARER_TOKEN = process.env.X_BEARER_TOKEN as string;
const X_API_SECRET_KEY = process.env.X_API_SECRET_KEY as string;
const X_API_KEY = process.env.X_API_KEY as string;
const X_ACCESS_TOKEN = process.env.X_ACCESS_TOKEN as string;
const X_ACCESS_TOKEN_SECRET = process.env.X_ACCESS_TOKEN_SECRET as string;

async function Create_Post(post_text: string) {
  try {
    const userClient = new TwitterApi({
      appKey: X_API_KEY,
      appSecret: X_API_SECRET_KEY,
      accessToken: X_ACCESS_TOKEN,
      accessSecret: X_ACCESS_TOKEN_SECRET,
    });
    await userClient.appLogin();
    const post_client = userClient.v2;
    await post_client.tweet({
      text: `${post_text}`,
    });
    return { msg: "done" };
  } catch (error) {
    return { msg: "Error", error: error };
  }
}

server.tool(
  "post-text-on-x",
  "given text content post it on x (twitter)",
  { postdata: z.string() },
  async ({ postdata }) => {
    try {
      const res = await Create_Post(postdata);
      if (res.msg === "Error") {
        return {
          content: [
            {
              type: "text",
              text: `${res.error}`,
            },
          ],
        };
      }
      return {
        content: [
          {
            type: "text",
            text: `Post Created ...`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: "Some error Occoured...",
          },
        ],
      };
    }
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Weather MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
