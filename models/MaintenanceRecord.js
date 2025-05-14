'use strict';
import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class MaintenanceRecord extends Model {
    static associate(models) {
      MaintenanceRecord.belongsTo(models.Car, { foreignKey: 'car_id' });
    }
  }

  MaintenanceRecord.init(
    {
      car_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      service_type: {
        type: DataTypes.STRING,
      },
      service_date: {
        type: DataTypes.DATE,
      },
      description: {
        type: DataTypes.TEXT,
      },
      cost: {
        type: DataTypes.DECIMAL(10, 2),
      },
    },
    {
      sequelize,
      modelName: 'MaintenanceRecord',
      tableName: 'maintenance_records',
      underscored: true,
      timestamps: false,
    }
  );

  return MaintenanceRecord;
};