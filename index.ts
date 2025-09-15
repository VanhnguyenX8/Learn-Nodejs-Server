
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import rateLimit from 'express-rate-limit';
import http from 'http';
import path from 'path';
import favicon from 'serve-favicon';

import { Server } from "socket.io";
import sequelize from './src/database/Database';
import { authSocketMiddleware } from './src/middlewares/AuthMiddleware';
import { chatModuls } from "./src/moduls/chat/ChatModuls";
import AuthRouter from './src/routers/AuthRouter';
import chatRouter from "./src/routers/ChatRouter";
import ToDoRouter from './src/routers/TodoRouter';
import UploadRouter from './src/upload/UpLoadController';




const PORT = Number(process.env.PORT ?? 5000);
const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cors({
  origin: '*',
  methods: ["POST", "GET", "DELETE"],
  credentials: true
}));
app.use(favicon(path.join(__dirname, 'public', 'logo.png')));
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 600, // limit each IP to 300 requests per window
  message:
    "System: Any Requests from you have been blocked for 15 minutes due to excessive requests. Please try again later."
})

/// Sync Database
sequelize.sync({ force: true })
  .then(() => console.log("Database synced"))
  .catch(err => console.error("Error syncing DB:", err));

app.use(limiter);
app.use('/public', express.static(path.join(__dirname, './public')))
app.use('/api/auth', AuthRouter);
app.use('/api/todo', ToDoRouter);
app.use("/api/upload", UploadRouter);
app.use("/api/chat", chatRouter);
//* socket io setup 
const io = new Server(server, { cors: { origin: "*" } });
// socket auth middleware
io.use(authSocketMiddleware);

// socket gateway
chatModuls(io);

app.use((req, res, next) => {
  res.status(404).sendFile(__dirname + '/public/404.html');
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});