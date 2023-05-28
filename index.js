import http from "http";
import express from "express";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const port = 6003;
const app = express();

const routes = [
  { path: "/", file: "index.html" },
  { path: "/settings", file: "settings.html" },
  { path: "/changelog", file: "changelog.html" },
  { path: "/chatroom", file: "chatroom.html" },
  { path: "/about", file: "about.html" },
  { path: "/credits", file: "credits.html" },
  { path: "/404", file: "404.html" },
  { path: "/projects", file: "projects.html" },
  { path: "/assets/game", file: "assets/game.html" }
];

routes.forEach((route) => {
  const handlers = [
    (req, res) => res.sendFile(path.join(__dirname, "public", route.file)),
  ];
  if (route.middleware) {
    handlers.unshift(route.middleware);
  }
  app.get(route.path, handlers);
});

app.use(express.static(path.join(__dirname)));

const server = http.createServer(app);
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
