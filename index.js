
const http = require("http");
const { API_PORT } = process.env;
const port = 5000;
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");


const routes = [
  { path: "/", file: "index.html" },
  { path: "/projects", file: "projects.html" },
  { path: "/assets/game", file: "assets/game.html" }
]

routes.forEach((route) => {
  const handlers = [
    (req, res) => res.sendFile(path.join(__dirname, route.file)),
  ];
  if (route.middleware) {
    handlers.unshift(route.middleware);
  }
  app.get(route.path, handlers);
});

app.use(express.static(path.join(__dirname)))

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

