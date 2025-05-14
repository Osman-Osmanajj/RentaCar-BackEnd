'use strict';
import { Model, DataTypes } from 'sequelize';

export default (sequelize, options = {}) => {
  class CarImage extends Model {
    static associate(models) {
      CarImage.belongsTo(models.Car, { foreignKey: 'car_id' });
    }
  }

  CarImage.init(
    {
      car_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      image_url: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'CarImage',
      tableName: 'car_images',
      underscored: true,
      schema:      options.schema,
      searchPath:  options.searchPath
    }
  );

  return CarImage;
};