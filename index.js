import http from "http";
import express from "express";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import cors from "cors";
import routes from "./routes/routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const port = 6003;
const app = express();

routes.forEach((route) => {
  const handlers = [
    (req, res) => res.sendFile(path.join(__dirname, "public", route.file)),
  ];
  if (route.middleware) {
    handlers.unshift(route.middleware);
  }
  app.get(route.path, handlers);
});

app.use(express.static(path.join(__dirname, "public", "src")));

const server = http.createServer(app);
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
