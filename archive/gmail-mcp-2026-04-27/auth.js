import { google } from "googleapis";
import fs from "fs";
import http from "http";
import { exec } from "child_process";
import { URL } from "url";

const SCOPES = ["https://www.googleapis.com/auth/gmail.compose"];
const PORT = 3000;

const credentials = JSON.parse(fs.readFileSync("./credentials.json", "utf8"));
const data = credentials.installed || credentials.web;
if (!data) throw new Error("Invalid credentials.json — expected installed or web client type.");
const { client_id, client_secret } = data;

const oauth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  `http://127.0.0.1:${PORT}`
);

const authUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  scope: SCOPES,
});

console.log("Opening browser for authorization...");
console.log("If it doesn't open automatically, visit:\n");
console.log(authUrl);
console.log("\nWaiting...");

exec(`start "" "${authUrl}"`);

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://127.0.0.1:${PORT}`);
  const code = url.searchParams.get("code");

  if (!code) {
    res.writeHead(400);
    res.end("No authorization code received.");
    return;
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    fs.writeFileSync("./token.json", JSON.stringify(tokens, null, 2));
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("<h2>Done — you can close this tab.</h2>");
    console.log("\ntoken.json saved. Restart Claude Code and the Gmail MCP will be ready.");
    server.close();
  } catch (err) {
    res.writeHead(500);
    res.end("Error: " + err.message);
    console.error("Failed to get token:", err.message);
    server.close();
  }
});

server.listen(PORT);
