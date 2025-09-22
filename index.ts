import cluster from "cluster";
import cors from "cors";
import express from "express";
import http from "http";
import os from "os";
import path from "path";
import favicon from "serve-favicon";
import { Server } from "socket.io";
import sequelize from "./src/database/Database";
import { authSocketMiddleware } from "./src/middlewares/AuthMiddleware";
import { chatModuls } from "./src/moduls/chat/ChatModuls";
import AuthRouter from "./src/routers/AuthRouter";
import ChatRouter from "./src/routers/ChatRouter";
import MediaRoute from "./src/routers/MediaRouter";
import ToDoRouter from "./src/routers/TodoRouter";
import UploadRouter from "./src/upload/UpLoadController";
const numCPUs = os.cpus().length;
const PORT = Number(process.env.PORT ?? 5000);

if (cluster.isPrimary) {
  console.log(`Master ${process.pid} is running`);

  // Spawn workers cho API
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Tạo process chạy socket
  const socketProcess = cluster.fork({ ROLE: "SOCKET" });

  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} died. Restarting...`);
    const role = "API";
    cluster.fork({ ROLE: role });
  });

} else {
  if (process.env.ROLE === "SOCKET") {
    // Process này chuyên để chạy socket
    const app = express();
    const server = http.createServer(app);

    const io = new Server(server, { cors: { origin: "*" } });
    io.use(authSocketMiddleware);
    chatModuls(io);

    server.listen(PORT + 1, () => {
      console.log(`Socket.IO server running on port ${PORT + 1}`);
    });

  } else {
    // process này chuyên để chạy API
    const app = express();

    app.use(express.json());
    app.use(cors({ origin: "*", methods: ["POST", "GET", "DELETE"], credentials: true }));
    app.use(favicon(path.join(__dirname, "public", "logo.png")));

    sequelize.sync().then(() => console.log("DB synced"));

    app.use("/public", express.static(path.join(__dirname, "./public")));
    app.use("/api/auth", AuthRouter);
    app.use("/api/todo", ToDoRouter);
    app.use("/api/upload", UploadRouter);
    app.use("/api/chat", ChatRouter);
    app.use("/api/media", MediaRoute);
    app.use((req, res) => {
      res.status(404).sendFile(__dirname + "/public/404.html");
    });

    app.listen(PORT, () => {
      console.log(`API worker ${process.pid} running on port ${PORT}`);
    });
  }
}
