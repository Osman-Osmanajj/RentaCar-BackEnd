
const { Sequelize } = require("sequelize");
const DB_NAME= "rentacar"
const DB_USER="postgres"
const DB_PASS="password"
const DB_HOST="localhost"
const DB_DIALECT="postgres"
const DB_PORT = 5432

const sequelize = new Sequelize(
  DB_NAME,
  DB_USER,
  DB_PASS,
  {
    host: DB_HOST,
    port: DB_PORT || 5432,
    dialect: "postgres",
    logging: false,
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(" PostgreSQL Database Connected!");
  } catch (error) {
    console.error(" Database Connection Failed:", error);
  }
};

module.exports = { sequelize, connectDB };