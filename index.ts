
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import rateLimit from 'express-rate-limit';
import http from 'http';
import path from 'path';
import AuthRouter from './src/routers/AuthRouter';
import ToDoRouter from './src/routers/TodoRouter';

const PORT = Number(process.env.PORT ?? 5000);
const app = express();
const server = http.createServer(app);
app.use(express.json());
app.use(cors({
  origin: '*',
  methods: ["POST", "GET", "DELETE"],
  credentials: true
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 600, // limit each IP to 300 requests per window
  message:
    "System: Any Requests from you have been blocked for 15 minutes due to excessive requests. Please try again later."
})


app.use(limiter);
app.use('/public', express.static(path.join(__dirname, '../public')))
app.use('/api/auth', AuthRouter);
app.use('/api/todo', ToDoRouter);
app.use((req, res, next) => {
  const error = new Error("This route is not defined.");
  error.stack = "This route is not defined.";
  next(error);
})

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});