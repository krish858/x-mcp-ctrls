[![MseeP.ai Security Assessment Badge](https://mseep.net/mseep-audited.png)](https://mseep.ai/app/krish858-x-mcp-ctrls)

# X-MCR-CTRLS

CONTROLL YOUR X THROUGH LLM AGENTS.

## Overview

X-MCP-Ctrl allows control of your and X-Acc through LLM agents using in apps like Claude-desktop/cursor.

## Setup-Guide

Setting up your the MCP is simple and requires just three steps:

1. **Clone this repo.**

2. **install and Build the project**
   ```bash
   npm install
   npm run build
   ```
3. **Update Your Configuration**
   Paste the following JSON configuration into your Claude or Cursor setup:
   ```JSON
      {
     "mcpServers": {
         "x-mcp-ctrls": {
             "command": "node",
             "args": [
                 "PATH_TO_DOWNLOADED_FOLDER\\build\\index.js"
             ],
             "env":{
               "X_API_KEY": "YOUR_API_KEY",
               "X_API_SECRET_KEY": "YOUR_API_KEY",
               "X_BEARER_TOKEN": "YOUR_API_KEY",
               "X_ACCESS_TOKEN": "YOUR_API_KEY2",
               "X_ACCESS_TOKEN_SECRET": "YOUR_API_KEY",
               "GEMINI_API_KEY": "YOUR_API_KEY" // ONLY IF YOU WANT IMG GENERATION
             }
         }
     }
   }
   ```

<br>
**Restart you app and now your mcp is configured just tell Ai agent to do something and See the Magic!!
