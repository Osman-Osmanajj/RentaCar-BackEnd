'use strict';
import { Model, DataTypes } from 'sequelize';

export default (sequelize, options = {}) => {
  class Review extends Model {
    static associate(models) {
      Review.belongsTo(models.Car, { foreignKey: 'car_id' });
    }
  }

  Review.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      car_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 5,
        },
      },
      comment: {
        type: DataTypes.TEXT,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Review',
      tableName: 'reviews',
      underscored: true,
      schema:      options.schema,
      searchPath:  options.searchPath

    }
  );

  return Review;
};