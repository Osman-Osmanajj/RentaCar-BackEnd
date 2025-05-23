import 'dotenv/config';

const {
  DB_NAME,
  DB_USER,
  DB_PASSWORD = '',
  DB_HOST,
  DB_PORT
} = process.env;

export default {
  development: {
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    host:     DB_HOST,
    port:     DB_PORT,
    dialect:  'postgres'
  },
  test: {
    dialect:  'sqlite',
    storage:  ':memory:',
    logging:  false
  },
  production: {
    username: DB_USER,
    password: DB_PASSWORD,
    database: `${DB_NAME}_prod`,
    host:     DB_HOST,
    port:     DB_PORT,
    dialect:  'postgres'
  }
};
