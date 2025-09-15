import ChatModel from "../models/ChatModel";

export class ChatService {
  async saveMessage(from: string, to: string, message: string) {
    return await ChatModel.create({ from, to, message });
  }

  async getMessagesBetween(user1: string, user2: string) {
    return await ChatModel.findAll({
      where: {
        from: [user1, user2],
        to: [user1, user2],
      },
      order: [["createdAt", "ASC"]],
    });
  }
}
