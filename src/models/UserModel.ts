import { DataTypes, Optional } from 'sequelize';
import sequelize from '../database/Database';
import { BaseModel } from '../utils/BaseModel';

interface UserAttributes {
  id: number;
  username: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

type UserCreationAttributes = Optional<UserAttributes, 'id' | 'createdAt' | 'updatedAt'>;

class User extends BaseModel<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public username!: string;
  public email!: string;
  public password!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
  }
);

export default User;