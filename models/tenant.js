'use strict';
import { Model, DataTypes } from 'sequelize';

export default (sequelize, options = {}) => {
  class Tenant extends Model {
    static associate(models) {
      Tenant.hasMany(models.UsersAdmin, {
        foreignKey: 'tenantid',
        onDelete: 'CASCADE',
      });
    }
  }

  Tenant.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      schema_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: 'Tenant',
      tableName: 'tenants',
      underscored: true,
      timestamps: true,
      schema:      options.schema,
      searchPath:  options.searchPath
    }
  );

  return Tenant;
};
