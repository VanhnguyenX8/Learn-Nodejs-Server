import ChatModel from "../models/ChatModel";

export class ChatService {
  async saveMessage(data: {
    from: string;
    to: string;
    message?: string;
    fileUrl?: string;
    fileType?: string;
  }) {
    return ChatModel.create({
      from: data.from,
      to: data.to,
      message: data.message,
      fileUrl: data.fileUrl,
      fileType: data.fileType,
      isRead: false,
    });
  }

  async markAsRead(messageId: number, userId: string) {
    const msg = await ChatModel.findByPk(messageId);
    if (msg && msg.to === userId) {
      msg.isRead = true;
      msg.readAt = new Date();
      await msg.save();
      return msg;
    }
    return null;
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
