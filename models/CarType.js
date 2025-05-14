'use strict';
import { Model, DataTypes } from 'sequelize';

export default (sequelize, options = {}) => {
  class CarType extends Model {
    static associate(models) {
      CarType.hasMany(models.Car, { foreignKey: 'car_type_id' });
    }
  }

  CarType.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
    },
    {
      sequelize,
      modelName: 'CarType',
      tableName: 'car_types',
      underscored: true,
      timestamps: false,
      schema:      options.schema,
      searchPath:  options.searchPath
    }
  );

  return CarType;
};