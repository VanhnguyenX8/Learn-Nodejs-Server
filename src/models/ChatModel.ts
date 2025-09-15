import { DataTypes, Optional } from "sequelize";
import sequelize from "../database/Database";
import { BaseModel } from "../utils/BaseModel";

interface ChatMessageAttributes {
  id: number;
  from: string;
  to: string;
  message: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ChatMessageCreation extends Optional<ChatMessageAttributes, "id"> { }

class ChatModel extends BaseModel<ChatMessageAttributes, ChatMessageCreation>
  implements ChatMessageAttributes {
  public id!: number;
  public from!: string;
  public to!: string;
  public message!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ChatModel.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    from: { type: DataTypes.STRING, allowNull: false },
    to: { type: DataTypes.STRING, allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false },
  },
  {
    sequelize,
    tableName: "chat_messages",
    timestamps: true,
  }
);

export default ChatModel;
