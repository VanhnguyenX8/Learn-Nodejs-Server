import { Server, Socket } from "socket.io";
import { ChatService } from "../../services/ChatService";

export function chatModuls(io: Server) {
  const chatService = new ChatService();

  io.on("connection", (socket: Socket & { user?: any }) => {
    console.log("Connected:", socket.user);

    socket.on("private_message", async ({ to, message, fileUrl, fileType }) => {
      const msg = await chatService.saveMessage({
        from: socket.user?.id,
        to: to,
        message: message,
        fileUrl: fileUrl,
        fileType: fileType
      });

      const targetSocket = Array.from(io.sockets.sockets.values()).find(
        s => (s as any).user?.id === to
      );
      if (targetSocket) {
        targetSocket.emit("private_message", msg);
      }

      socket.emit("private_message", msg);
    });

    socket.on("mark_as_read", async ({ messageId }) => {
      const updatedMsg = await chatService.markAsRead(messageId, socket.user?.id);
      if (updatedMsg) {
        socket.emit("message_read", updatedMsg);
        const targetSocket = Array.from(io.sockets.sockets.values()).find(
          s => (s as any).user?.id === updatedMsg.to
        );
        if (targetSocket) {
          targetSocket.emit("message_read", updatedMsg);
        }
      }
    });

    socket.on("typing", ({ to, isTyping }) => {
      const targetSocket = Array.from(io.sockets.sockets.values()).find(
        s => (s as any).user?.id === to
      );
      if (targetSocket) {
        targetSocket.emit("typing", { from: socket.user?.id, isTyping });
      }
    });
    socket.on("stop_typing", ({ to }) => {
      const targetSocket = Array.from(io.sockets.sockets.values()).find(
        s => (s as any).user?.id === to
      );
      if (targetSocket) {
        targetSocket.emit("stop_typing", { from: socket.user?.id });
      }
    });

    socket.on("disconnect", () => {
      console.log("Disconnected:", socket.user);
    });
  });
}
