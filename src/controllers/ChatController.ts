import { Response } from 'express';
import { AuthenticatedRequest } from "../middlewares/AuthMiddleware";
import { ChatService } from "../services/ChatService";
import { errorRes, successRes } from '../utils/BaseRespone';

const chatService = new ChatService();

export class ChatController {
  static async getHistory(req: AuthenticatedRequest, res: Response) {
    try {
      const { userId } = req.params;
      const currentUserId = String(req.user?.id ?? 0);
      const otherUserId = String(req.params.userId ?? 0);
      const messages = await chatService.getMessagesBetween(currentUserId, otherUserId);
      return res.status(200).json(successRes({ messages }));
    } catch (error) {
      return res.status(500).json(errorRes('Failed to retrieve chat history'));
    }
  }
}