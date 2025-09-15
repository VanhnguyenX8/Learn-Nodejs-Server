import { Server, Socket } from "socket.io";
import { ChatService } from "../../services/ChatService";

export function chatModuls(io: Server) {
  const chatService = new ChatService();

  io.on("connection", (socket: Socket & { user?: any }) => {
    console.log("Connected:", socket.user);

    socket.on("private_message", async ({ to, message }) => {
      const msg = await chatService.saveMessage(socket.user?.id, to, message);

      const targetSocket = Array.from(io.sockets.sockets.values()).find(
        s => (s as any).user?.id === to
      );
      if (targetSocket) {
        targetSocket.emit("private_message", msg);
      }

      socket.emit("private_message", msg);
    });
  });
}
