import fs from 'fs';
import path from 'path';
import { sequelize } from '../config/database.js';
import { DataTypes } from 'sequelize';

const basename = path.basename(__filename);
const db = {};

fs
  .readdirSync(__dirname)
  .filter(file =>
     file !== basename &&
     file.slice(-3) === '.js' &&
     !file.endsWith('.test.js')
  )
  .forEach(file => {
    const modelDef = require(path.join(__dirname, file)).default;
    const model = modelDef(sequelize, DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(name => {
  if (db[name].associate) db[name].associate(db);
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
