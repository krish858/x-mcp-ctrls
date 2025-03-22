import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { TwitterApi } from "twitter-api-v2";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Buffer } from "buffer";
import fs from "fs";
import "dotenv/config";

const server = new McpServer({
  name: "x-mcp-ctrls",
  version: "1.0.0",
});

const X_API_SECRET_KEY = process.env.X_API_SECRET_KEY as string;
const X_API_KEY = process.env.X_API_KEY as string;
const X_ACCESS_TOKEN = process.env.X_ACCESS_TOKEN as string;
const X_ACCESS_TOKEN_SECRET = process.env.X_ACCESS_TOKEN_SECRET as string;

const userClient = new TwitterApi({
  appKey: X_API_KEY,
  appSecret: X_API_SECRET_KEY,
  accessToken: X_ACCESS_TOKEN,
  accessSecret: X_ACCESS_TOKEN_SECRET,
});
await userClient.appLogin();

async function Create_Post(post_text: string) {
  try {
    const post_client = userClient.v2;
    await post_client.tweet({
      text: `${post_text}`,
    });
    return { msg: "done" };
  } catch (error) {
    return { msg: "Error", error: error };
  }
}

async function Create_img_post(post_text: string, img_prompt: string) {
  try {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY as string | undefined;
    if (!GEMINI_API_KEY) {
      throw new Error(
        "For image generation, add the GEMINI_API_KEY to the environment variables."
      );
    }
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const img_client = userClient.v1;
    const post_client = userClient.v2;
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp-image-generation",
      generationConfig: {
        //@ts-ignore
        responseModalities: ["Text", "Image"],
      },
    });
    const response = await model.generateContent(img_prompt);
    if (!response?.response?.candidates?.[0]?.content?.parts) {
      throw new Error("Invalid response from Gemini API.");
    }
    for (const part of response.response.candidates[0].content.parts) {
      if (part.text) {
        console.error(part.text);
      } else if (part.inlineData) {
        const imageData = part.inlineData.data;
        const buffer = Buffer.from(imageData, "base64");
        fs.writeFileSync("gemini-native-image.png", buffer);
      }
    }
    const mediaIds = await Promise.all([
      img_client.uploadMedia("./gemini-native-image.png"),
    ]);
    await post_client.tweet({
      text: `${post_text}`,
      media: { media_ids: mediaIds },
    });
    await fs.unlink("gemini-native-image.png", () => {});
    return { msg: "done" };
  } catch (error) {
    return { msg: "error", error: error };
  }
}

server.tool(
  "post-text-on-x",
  "given text content post it on x (twitter)",
  { postdata: z.string().max(280) },
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
            text: `Some error Occoured... \n ${error}`,
          },
        ],
      };
    }
  }
);

server.tool(
  "post-img+txt-on-x",
  "given text content and image prompt post text content and image on x",
  { post_data: z.string(), img_context: z.string() },
  async ({ post_data, img_context }) => {
    try {
      const res = await Create_img_post(post_data, img_context);
      if (res.msg == "error") {
        return {
          content: [
            {
              type: "text",
              text: `Error occoured ... \n ${res.error}`,
            },
          ],
        };
      }
      return {
        content: [
          {
            type: "text",
            text: "Post Created",
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error occoured. \n${error}`,
          },
        ],
      };
    }
  }
);

server.tool(
  "fetch-x-acc",
  "fetch deatails about a x account ",
  { accountname: z.string() },
  async ({ accountname }) => {
    return {
      content: [
        {
          type: "text",
          text: "currently under construction",
        },
      ],
    };
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
