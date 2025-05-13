'use strict';
import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class LocationInventory extends Model {
    static associate(models) {
      LocationInventory.belongsTo(models.Location, { foreignKey: 'location_id' });
      LocationInventory.belongsTo(models.Car, { foreignKey: 'car_id' });
    }
  }

  LocationInventory.init(
    {
      location_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      car_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      quantity_available: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: 'LocationInventory',
      tableName: 'location_inventory',
      underscored: true,
    }
  );

  return LocationInventory;
};