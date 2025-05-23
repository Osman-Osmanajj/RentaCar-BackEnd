// jest.config.cjs
module.exports = {
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  // <-- add this
  transformIgnorePatterns: [
    'node_modules/(?!sequelize-test-helpers)'
  ],
  verbose: true,
  testEnvironment:      'node',
  clearMocks:           true,
  moduleFileExtensions: ['js','json'],
  testMatch:            ['**/?(*.)+(spec|test).[jt]s'],
  setupFilesAfterEnv:   ['<rootDir>/jest.setup.cjs'],
};
