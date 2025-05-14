'use strict';
import { Model, DataTypes } from 'sequelize';

export default (sequelize, options = {}) => {
  class User extends Model {
    static associate(models) {
      User.belongsTo(models.Tenant, {
        foreignKey: 'tenant_id',
        onDelete:   'CASCADE',
      });

      User.hasOne(models.UsersAdmin, {
        foreignKey: 'id',
        as:         'adminRecord',
      });
    }
  }

  User.init(
    {
      id:       { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name:     { type: DataTypes.STRING,  allowNull: false },
      email:    { type: DataTypes.STRING,  allowNull: false, unique: true },
      password: { type: DataTypes.TEXT,    allowNull: false },

      role: {
        type:       DataTypes.ENUM('Admin', 'Customer', 'Manager'),
        allowNull:  false,
        defaultValue: 'Customer',          
      },

      tenant_id: {                        
        type:       DataTypes.INTEGER,
        allowNull:  false,
      },
    },
    {
      sequelize,
      modelName:   'User',
      tableName:   'users',
      underscored: true,

      schema:     options.schema,
      searchPath: options.searchPath,

      timestamps: true,
      createdAt:  'created_at',
      updatedAt:  'updated_at',
    }
  );

  return User;
};
