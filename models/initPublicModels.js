
import UserDef from './User.js';
import TenantDef from './tenant.js';
import UsersAdminDef from './useradmin.js';

export function initPublicModels(sequelize) {
  if (!sequelize) throw new Error('Sequelize instance is missing');

  const models = {
    User: UserDef(sequelize),
    Tenant: TenantDef(sequelize),
    UsersAdmin: UsersAdminDef(sequelize),
  };

  Object.values(models).forEach((model) => {
    if (typeof model.associate === 'function') {
      model.associate(models);
    }
  });

  return models;
}
