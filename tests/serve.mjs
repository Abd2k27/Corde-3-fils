// Petit serveur statique pour les tests et pour essayer le site en local : `npm run serve`.
// Il force le mode « local » dans js/config.js (données dans le navigateur, sans Firebase).
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const port = +process.argv[2] || 4173;
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".mjs": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".json": "application/json", ".png": "image/png", ".svg": "image/svg+xml", ".ico": "image/x-icon" };

createServer(async (req, res) => {
  let path = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (path.endsWith("/")) path += "index.html";
  const file = normalize(join(root, path));
  if (!file.startsWith(root) || /[\\/](node_modules|\.git)[\\/]/.test(file)) { res.writeHead(403).end(); return; }
  try {
    let body = await readFile(file);
    if (path === "/js/config.js") body = Buffer.from(body.toString().replace(/mode:\s*"firebase"/, 'mode: "local"'));
    res.writeHead(200, { "Content-Type": TYPES[extname(file)] || "application/octet-stream", "Cache-Control": "no-store" }).end(body);
  } catch { res.writeHead(404).end("Introuvable"); }
}).listen(port, () => console.log(`Site (mode local) : http://localhost:${port}/`));
