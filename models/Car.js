'use strict';
import { Model, DataTypes } from 'sequelize';


export default (sequelize, options = {}) => {

  class Car extends Model {
    static associate(models) {
      Car.belongsTo(models.CarType, { foreignKey: 'car_type_id' });
      Car.hasMany(models.CarImage, { foreignKey: 'car_id' });
      Car.hasMany(models.Booking, { foreignKey: 'car_id' });
      Car.hasMany(models.MaintenanceRecord, { foreignKey: 'car_id' });
      Car.hasMany(models.CarDamageReport, { foreignKey: 'car_id' });
    }
  }

  Car.init(
    {
      make: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      model: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      license_plate: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('Available', 'Rented', 'Maintenance'),
        allowNull: false,
      },
      car_type_id: {
        type: DataTypes.INTEGER,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Car',
      tableName: 'cars',
      underscored: true,
      timestamps: false,
      schema:      options.schema,
      searchPath:  options.searchPath
    }
    
  );

  return Car;
};  