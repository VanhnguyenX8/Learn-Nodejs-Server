import { DataTypes, Optional } from "sequelize";
import sequelize from "../database/Database";
import { BaseModel } from "../utils/BaseModel";

interface ChatMessageAttributes {
  id: number;
  from: string;         // userId người gửi
  to: string;           // userId người nhận
  message?: string;     // nội dung text
  fileUrl?: string;     // link file/ảnh (nếu có)
  fileType?: string;    // loại file (image, pdf, etc.)
  isRead: boolean;      // tin nhắn đã đọc hay chưa
  readAt?: Date;        // thời điểm đọc
  createdAt?: Date;
  updatedAt?: Date;
}

interface ChatMessageCreation
  extends Optional<
    ChatMessageAttributes,
    "id" | "message" | "fileUrl" | "fileType" | "isRead" | "readAt"
  > { }

class ChatModel
  extends BaseModel<ChatMessageAttributes, ChatMessageCreation>
  implements ChatMessageAttributes {
  public id!: number;
  public from!: string;
  public to!: string;
  public message?: string;
  public fileUrl?: string;
  public fileType?: string;
  public isRead!: boolean;
  public readAt?: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ChatModel.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    from: { type: DataTypes.STRING, allowNull: false },
    to: { type: DataTypes.STRING, allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: true },
    fileUrl: { type: DataTypes.STRING, allowNull: true },
    fileType: { type: DataTypes.STRING, allowNull: true },
    isRead: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    readAt: { type: DataTypes.DATE, allowNull: true },
  },
  {
    sequelize,
    tableName: "chat_messages",
    timestamps: true,
  }
);

export default ChatModel;
