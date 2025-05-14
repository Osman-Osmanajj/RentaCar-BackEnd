import { Sequelize } from 'sequelize';
import dbConfig from './config.js';     
import 'dotenv/config';

const env = process.env.NODE_ENV || 'development';
const { database, username, password, host, port, dialect } = dbConfig[env];

export const sequelize = new Sequelize(database, username, password, {
  host,
  port,
  dialect,
  logging: false,
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL connected');
  } catch (err) {
    console.error('DB connection error:', err);
  }
};
