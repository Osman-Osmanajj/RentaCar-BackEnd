import { Sequelize, DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Tenant = sequelize.define('tenant', {
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
  }
});


Tenant.associate = function (models) {
  Tenant.hasMany(models.User, {
    foreignKey: 'tenant_id',
    onDelete: 'CASCADE',
  });
};


export default Tenant;
