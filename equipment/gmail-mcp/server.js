import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { google } from "googleapis";
import { z } from "zod";
import fs from "fs";

const SCOPES = ["https://www.googleapis.com/auth/gmail.compose"];
const REDIRECT_URI = "http://127.0.0.1:3000";

function loadCredentials() {
  if (!fs.existsSync("./credentials.json")) {
    throw new Error("credentials.json not found");
  }

  if (!fs.existsSync("./token.json")) {
    throw new Error("token.json not found → run auth.js first");
  }

  const credentials = JSON.parse(fs.readFileSync("./credentials.json", "utf8"));
  const token = JSON.parse(fs.readFileSync("./token.json", "utf8"));

  const data = credentials.installed || credentials.web;

  if (!data) {
    throw new Error("Invalid credentials.json format");
  }

  const auth = new google.auth.OAuth2(
    data.client_id,
    data.client_secret,
    REDIRECT_URI
  );

  auth.setCredentials(token);
  return auth;
}

async function createDraft({ to, subject, body }) {
  const auth = loadCredentials();
  const gmail = google.gmail({ version: "v1", auth });

  const message = [
    `To: ${to}`,
    `Subject: ${subject}`,
    "Content-Type: text/plain; charset=utf-8",
    "MIME-Version: 1.0",
    "",
    body
  ].join("\n");

  const raw = Buffer.from(message)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  const res = await gmail.users.drafts.create({
    userId: "me",
    requestBody: {
      message: { raw }
    }
  });

  return res.data;
}

// MCP Server
const server = new McpServer({
  name: "gmail-drafts",
  version: "1.0.0"
});

server.tool(
  "create_gmail_draft",
  {
    to: z.string().email(),
    subject: z.string(),
    body: z.string()
  },
  async ({ to, subject, body }) => {
    try {
      const draft = await createDraft({ to, subject, body });

      return {
        content: [
          {
            type: "text",
            text: `✅ Draft created. ID: ${draft.id}`
          }
        ]
      };
    } catch (err) {
      return {
        content: [
          {
            type: "text",
            text: `❌ Error: ${err.message}`
          }
        ]
      };
    }
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);

process.stderr.write("Gmail MCP server running\n");