
import UserDef       from './User.js';
import TenantDef     from './tenant.js';
import UsersAdminDef from './useradmin.js';

/**
 * Initialise the three public-schema models exactly once.
 * @param {Sequelize} sequelize
 */
export function initPublicModels(sequelize) {
  const models = {
    User:       UserDef(sequelize),
    Tenant:     TenantDef(sequelize),
    UsersAdmin: UsersAdminDef(sequelize),
  };

  Object.values(models).forEach(m => m.associate?.(models));
  return models;
}
