'use strict';
import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class User extends Model {
    static associate(models) {
      // Define associations here
      User.belongsTo(models.Tenant, { foreignKey: 'tenant_id' });
    }
  }

  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },
      password: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      role: {
        type: DataTypes.ENUM('Admin', 'Customer', 'Manager'),
        allowNull: false
      },
      tenant_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      underscored: true
    }
  );

  return User;
};
