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
                 "C:\\Users\\Krish\\Downloads\\mcp-starter-master\\x-mcp-ctrls\\build\\index.js"
             ],
             "env":{
               "X_API_KEY": "tDu0RG8JVpKRV6x0H2CMXTRXB",
               "X_API_SECRET_KEY": "FNo7RXVrDQ4mr4GJR0a8io5IopP6YeQ4rCV78s8Gjbrm5JZykX",
               "X_BEARER_TOKEN": "AAAAAAAAAAAAAAAAAAAAAClM0AEAAAAAuAjgWh9qDLLOT1vCCvkAcyrNBXY%3Dwd4tNxZOZU9NBxjckyHTVGF3UWoFEfnu9QgW20BoZ7PsQnPo7G",
               "X_ACCESS_TOKEN": "1754568305132941312-iD8M1uapAn5XzhKz5svq3oH5CHF8r2",
               "X_ACCESS_TOKEN_SECRET": "uaDpsoVsmQOKH278bD3ih9aT1C2D5MzX02ZIx2eCCwTfu"
             }
         }
     }
   }

<br>
**Restart you app and now your mcp is configured just tell Ai agent to do something and See the Magic!!
