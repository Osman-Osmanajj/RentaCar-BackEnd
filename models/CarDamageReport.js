'use strict';
import { Model, DataTypes } from 'sequelize';

export default (sequelize, options = {}) => {
  class CarDamageReport extends Model {
    static associate(models) {
      CarDamageReport.belongsTo(models.Car, { foreignKey: 'car_id' });
    }
  }

  CarDamageReport.init(
    {
      car_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      damage_type: {
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.TEXT,
      },
      cost: {
        type: DataTypes.DECIMAL(10, 2),
      },
      status: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName:  'CarDamageReport',
      tableName:  'car_damage_reports',
      underscored: true,
      timestamps: false,
      schema:     options.schema,
      searchPath: options.searchPath
    }
  );

  return CarDamageReport;
};
