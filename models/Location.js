'use strict';
import { Model, DataTypes } from 'sequelize';

export default (sequelize, options = {}) => {
  class Location extends Model {
    static associate(models) {
      Location.hasMany(models.LocationInventory, { foreignKey: 'location_id' });
    }
  }

  Location.init(
    {
      address: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
      },
      country: {
        type: DataTypes.STRING,
      },
      phone_number: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: 'Location',
      tableName: 'locations',
      underscored: true,
      timestamps: false,
      schema:      options.schema,
      searchPath:  options.searchPath
    }
  );

  return Location;
};