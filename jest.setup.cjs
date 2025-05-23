// jest.setup.cjs
const { createRequire } = require('module');
const requireEsm = createRequire(__filename);
const { sequelize } = requireEsm('./config/database.js');

beforeAll(async () => {
  await sequelize.sync({ force: true });
  jest.spyOn(console, 'log').mockImplementation(() => {});

  jest.spyOn(console, 'error').mockImplementation(() => {});
});

