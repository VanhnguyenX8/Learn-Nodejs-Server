import { Router } from "express";
import { MediaController } from "../controllers/MediaController";

const router = Router();

// GET /api/media/stream/:filename
router.get("/stream/:filename", MediaController.stream);

export default router;
