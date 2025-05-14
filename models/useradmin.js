'use strict';
import { Model, DataTypes } from 'sequelize';

export default (sequelize, options = {}) => {
  class UsersAdmin extends Model {
    static associate(models) {
      UsersAdmin.belongsTo(models.User, { foreignKey: 'id' });
      UsersAdmin.belongsTo(models.Tenant, { foreignKey: 'tenantid' });
    }
  }

  UsersAdmin.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      tenantid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'tenants',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
    },
    {
      sequelize,
      modelName: 'UsersAdmin',
      tableName: 'users_admin',
      timestamps: false,
      schema:      options.schema,
      searchPath:  options.searchPath
    }
  );

  return UsersAdmin;
};
