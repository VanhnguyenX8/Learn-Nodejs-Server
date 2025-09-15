import { Router } from "express";
import { ChatController } from "../controllers/ChatController";
import { authenticateToken } from "../middlewares/AuthMiddleware";

const router = Router();

router.get("/history/:userId", authenticateToken, ChatController.getHistory);
router.post("/messages", authenticateToken, ChatController.saveMessage);

export default router;
