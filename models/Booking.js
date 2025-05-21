'use strict';
import { Model, DataTypes } from 'sequelize';

export default (sequelize, options = {}) => {
  class Booking extends Model {
    static associate(models) {
      Booking.belongsTo(models.Car, { foreignKey: 'car_id' });
      Booking.hasMany(models.CarImage, {
            foreignKey: 'car_id',   // The field in CarImage table
            sourceKey: 'car_id',    // The field in Booking table
          });

    }
  }

  Booking.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      car_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      start_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      end_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('Pending', 'Confirmed', 'Cancelled', 'Completed'),
        allowNull: false,
      },
      total_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Booking',
      tableName: 'bookings',
      underscored: true,
      timestamps:false,
      schema:      options.schema,
      searchPath:  options.searchPath
    }
  );  
  return Booking;
};