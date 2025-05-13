// models/User.js
'use strict';
import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class User extends Model {
    static associate(models) {
      User.hasOne(models.UsersAdmin, {
        foreignKey: 'id',
        as: 'adminRecord',
      });
    }
  }

  User.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, unique: true, allowNull: false },
      password: { type: DataTypes.TEXT, allowNull: false },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      underscored: true, 
    }
  );

  return User;
};
