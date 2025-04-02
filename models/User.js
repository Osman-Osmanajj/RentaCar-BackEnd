const { Sequelize, Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

class User extends Model {}  // Kjo duhet të zgjerojë Model, jo 'models'

User.init(
  {
    userid: {
      type: DataTypes.INTEGER,
      primaryKey: true, 
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true 
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true 
        }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize, 
    modelName: "user", 
    timestamps: true 
  }
);

module.exports = User;
