import "dotenv/config";
import path from "path";
import express from "express";
import ngrok from "@ngrok/ngrok";
import { createProxyMiddleware } from "http-proxy-middleware";
const NGROK_DOMAIN = process.env.NGROK_DOMAIN;
const NGROK_AUTHTOKEN = process.env.NGROK_AUTHTOKEN;
const PROXY_SERVER_PORT = 4000;
const appPorts = { audioSphere: 3001, geminiChat: 3002, quoteGen: 3003 };
const app = express();
app.use(express.static(path.join(process.cwd(), "public")));
app.use(
  "/AudioSphere",
  createProxyMiddleware({
    target: `http://localhost:${appPorts.audioSphere}`,
    changeOrigin: true,
    pathRewrite: { "^/AudioSphere": "/" },
    onProxyReq: (proxyReq, req, res) => {
      console.log(`[Proxy] Forwarding /AudioSphere to ${proxyReq.protocol}//${proxyReq.host}${req.url}`);
    },
  }),
);
app.use(
  "/GeminiChat",
  createProxyMiddleware({
    target: `http://localhost:${appPorts.geminiChat}`,
    changeOrigin: true,
    pathRewrite: { "^/GeminiChat": "/" },
    onProxyReq: (proxyReq, req, res) => {
      console.log(`[Proxy] Forwarding /GeminiChat to ${proxyReq.protocol}//${proxyReq.host}${req.url}`);
    },
  }),
);
app.use(
  "/QuoteGen",
  createProxyMiddleware({
    target: `http://localhost:${appPorts.quoteGen}`,
    changeOrigin: true,
    pathRewrite: { "^/QuoteGen": "/" },
    onProxyReq: (proxyReq, req, res) => {
      console.log(`[Proxy] Forwarding /QuoteGen to ${proxyReq.protocol}//${proxyReq.host}${req.url}`);
    },
  }),
);
app.listen(PROXY_SERVER_PORT, () => {
  console.log(`Reverse proxy server started on port ${PROXY_SERVER_PORT}`);
  console.log(`Local Access: http://localhost:${PROXY_SERVER_PORT}/`);
  console.log(`Local Access: http://localhost:${PROXY_SERVER_PORT}/AudioSphere`);
  console.log(`Local Access: http://localhost:${PROXY_SERVER_PORT}/GeminiChat`);
  console.log(`Local Access: http://localhost:${PROXY_SERVER_PORT}/QuoteGen`);
  startNgrokTunnel();
});
async function startNgrokTunnel() {
  if (!NGROK_AUTHTOKEN) {
    console.error("NGROK_AUTHTOKEN environment variable not set. Add it to your .env file or set it in your shell.");
    console.error("Find your authtoken at https://dashboard.ngrok.com/get-started/your-authtoken");
    process.exit(1);
  }
  if (!NGROK_DOMAIN) {
    console.warn("NGROK_DOMAIN not set in .env. A random ngrok URL will be assigned.");
  }
  try {
    console.log("\nConnecting to ngrok...");
    await ngrok.authtoken(NGROK_AUTHTOKEN);
    console.log(`Attempting to tunnel to Proxy Server (Port ${PROXY_SERVER_PORT})`);
    const tunnel = await ngrok.forward({ hostname: NGROK_DOMAIN || undefined, addr: PROXY_SERVER_PORT, proto: "http" });
    console.log("\n--- ngrok Tunnel Active ---");
    console.log(`Your public URL: ${tunnel.url()}`);
    console.log(`  Access Root (index.html): ${tunnel.url()}/`);
    console.log(`  Access AudioSphere: ${tunnel.url()}/AudioSphere`);
    console.log(`  Access GeminiChat: ${tunnel.url()}/GeminiChat`);
    console.log(`  Access QuoteGen: ${tunnel.url()}/QuoteGen`);
    console.log("----------------------------\n");
    process.on("SIGINT", async () => {
      console.log("\nShutting down ngrok tunnel and proxy server...");
      await ngrok.disconnect();
      console.log("ngrok tunnel disconnected.");
      process.exit(0);
    });
  } catch (error) {
    console.error("Failed to start ngrok tunnel:", error.message);
    if (error.details) console.error("Details:", error.details);
    process.exit(1);
  }
}
