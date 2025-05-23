// __tests__/models/UsersAdmin.test.js
import { Sequelize, DataTypes } from 'sequelize';
import usersAdminModel from '../../models/useradmin.js';

describe('UsersAdmin Model', () => {
  let sequelize;
  let UsersAdmin;

  beforeAll(() => {
    // In-memory SQLite without URL parsing warnings
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false
    });
    UsersAdmin = usersAdminModel(sequelize, {
      schema:     'myschema',
      searchPath: 'myschema'
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('defines the correct attributes', () => {
    const attrs = UsersAdmin.rawAttributes;

    // id field
    expect(attrs).toHaveProperty('id');
    expect(attrs.id.type.key).toBe('INTEGER');
    expect(attrs.id.allowNull).toBe(false);
    expect(attrs.id.primaryKey).toBe(true);
    expect(attrs.id.references).toEqual({
      model: 'users',
      key:   'id'
    });
    expect(attrs.id.onDelete).toBe('CASCADE');

    // tenantid field
    expect(attrs).toHaveProperty('tenantid');
    expect(attrs.tenantid.type.key).toBe('INTEGER');
    expect(attrs.tenantid.allowNull).toBe(false);
    expect(attrs.tenantid.references).toEqual({
      model: 'tenants',
      key:   'id'
    });
    expect(attrs.tenantid.onDelete).toBe('CASCADE');
  });

  it('has the correct model options', () => {
    expect(UsersAdmin.tableName).toBe('users_admin');
    expect(UsersAdmin.options.timestamps).toBe(false);
    expect(UsersAdmin.options.schema).toBe('myschema');
    expect(UsersAdmin.options.searchPath).toBe('myschema');
  });

  describe('associate()', () => {
    it('references both belongsTo(models.User) and belongsTo(models.Tenant)', () => {
      const src = UsersAdmin.associate.toString();

      // Check the User association
      expect(src).toMatch(
        /UsersAdmin\.belongsTo\s*\(\s*models\.User\s*,\s*\{\s*foreignKey:\s*['"]id['"]/
      );

      // Check the Tenant association
      expect(src).toMatch(
        /UsersAdmin\.belongsTo\s*\(\s*models\.Tenant\s*,\s*\{\s*foreignKey:\s*['"]tenantid['"]/
      );
    });
  });
});
