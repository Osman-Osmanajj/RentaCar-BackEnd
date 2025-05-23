'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash('StrongP@ssw0rd!', 10); 

    await queryInterface.bulkInsert('users', [{
      name: 'Super Admin',
      email: 'admin@driveeasy.com',
      password: hashedPassword,
      role: 'Admin',
      created_at: new Date(),
      updated_at: new Date()
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', { email: 'admin@driveeasy.com' });
  }
};
