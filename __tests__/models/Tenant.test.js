// __tests__/models/Tenant.test.js
import { Sequelize, DataTypes } from 'sequelize';
import tenantModel from '../../models/tenant.js';

describe('Tenant Model', () => {
  let sequelize;
  let Tenant;

  beforeAll(() => {
    // In-memory SQLite without URL parsing warnings
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false
    });
    Tenant = tenantModel(sequelize, {
      schema:     'myschema',
      searchPath: 'myschema'
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('defines the correct attributes', () => {
    const attrs = Tenant.rawAttributes;

    expect(attrs).toHaveProperty('id');
    expect(attrs.id.type.key).toBe('INTEGER');
    expect(attrs.id.autoIncrement).toBe(true);
    expect(attrs.id.primaryKey).toBe(true);

    expect(attrs).toHaveProperty('name');
    expect(attrs.name.type.key).toBe('STRING');
    expect(attrs.name.allowNull).toBe(false);

    expect(attrs).toHaveProperty('email');
    expect(attrs.email.type.key).toBe('STRING');
    expect(attrs.email.allowNull).toBe(false);
    expect(attrs.email.unique).toBe(true);

    expect(attrs).toHaveProperty('phone');
    expect(attrs.phone.type.key).toBe('STRING');
    expect(attrs.phone.allowNull).toBe(false);

    expect(attrs).toHaveProperty('address');
    expect(attrs.address.type.key).toBe('STRING');
    expect(attrs.address.allowNull).toBe(false);

    expect(attrs).toHaveProperty('city');
    expect(attrs.city.type.key).toBe('STRING');
    expect(attrs.city.allowNull).toBe(false);

    expect(attrs).toHaveProperty('country');
    expect(attrs.country.type.key).toBe('STRING');
    expect(attrs.country.allowNull).toBe(false);

    expect(attrs).toHaveProperty('schema_name');
    expect(attrs.schema_name.type.key).toBe('STRING');
    expect(attrs.schema_name.allowNull).toBe(false);
    expect(attrs.schema_name.unique).toBe(true);
  });

  it('has the correct model options', () => {
    expect(Tenant.tableName).toBe('tenants');
    expect(Tenant.options.underscored).toBe(true);
    expect(Tenant.options.timestamps).toBe(true);
    expect(Tenant.options.schema).toBe('myschema');
    expect(Tenant.options.searchPath).toBe('myschema');
  });

  describe('associate()', () => {
    it('references hasMany(models.UsersAdmin) with foreignKey tenantid and onDelete CASCADE', () => {
      const src = Tenant.associate.toString();
      expect(src).toMatch(
        /Tenant\.hasMany\s*\(\s*models\.UsersAdmin\s*,\s*\{\s*foreignKey:\s*['"]tenantid['"]\s*,\s*onDelete:\s*['"]CASCADE['"]\s*\}\)/
      );
    });
  });
});
