import { DataTypes, Optional } from 'sequelize';
import sequelize from '../database/Database';
import { BaseModel } from '../utils/BaseModel';

interface TodoAttributes {
  id: number;
  title: string;
  des: string;
  img?: string;
  userId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

type TodoCreationAttributes = Optional<TodoAttributes, 'id' | 'img' | 'createdAt' | 'updatedAt'>;

class ToDo extends BaseModel<TodoAttributes, TodoCreationAttributes> implements TodoAttributes {
  public id!: number;
  public title!: string;
  public des!: string;
  public img?: string;
  public userId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ToDo.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    des: { type: DataTypes.STRING, allowNull: false },
    img: { type: DataTypes.STRING, allowNull: true },
    userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  },
  {
    sequelize,
    tableName: 'todos',
    timestamps: true,
  }
);

export default ToDo;
