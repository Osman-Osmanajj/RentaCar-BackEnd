// __tests__/models/User.test.js
import { Sequelize, DataTypes } from 'sequelize';
import userModel from '../../models/User.js';

describe('User Model', () => {
  let sequelize;
  let User;

  beforeAll(() => {
    // Use in-memory SQLite to avoid URL warnings
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false
    });
    User = userModel(sequelize, {
      schema:     'myschema',
      searchPath: 'myschema'
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('defines the correct attributes', () => {
    const attrs = User.rawAttributes;

    // id
    expect(attrs).toHaveProperty('id');
    expect(attrs.id.type.key).toBe('INTEGER');
    expect(attrs.id.primaryKey).toBe(true);
    expect(attrs.id.autoIncrement).toBe(true);

    // name
    expect(attrs).toHaveProperty('name');
    expect(attrs.name.type.key).toBe('STRING');
    expect(attrs.name.allowNull).toBe(false);

    // email
    expect(attrs).toHaveProperty('email');
    expect(attrs.email.type.key).toBe('STRING');
    expect(attrs.email.allowNull).toBe(false);
    expect(attrs.email.unique).toBe(true);

    // password
    expect(attrs).toHaveProperty('password');
    expect(attrs.password.type.key).toBe('TEXT');
    expect(attrs.password.allowNull).toBe(false);

    // role
    expect(attrs).toHaveProperty('role');
    expect(attrs.role.type.key).toBe('ENUM');
    expect(attrs.role.type.options.values).toEqual(
      expect.arrayContaining(['Admin','Customer','Manager'])
    );
    expect(attrs.role.allowNull).toBe(false);
    expect(attrs.role.defaultValue).toBe('Customer');

    // tenant_id
    expect(attrs).toHaveProperty('tenant_id');
    expect(attrs.tenant_id.type.key).toBe('INTEGER');
    expect(attrs.tenant_id.allowNull).toBe(true);
  });

  it('has the correct model options', () => {
    expect(User.tableName).toBe('users');
    expect(User.options.underscored).toBe(true);
    expect(User.options.schema).toBe('myschema');
    expect(User.options.searchPath).toBe('myschema');

    // timestamps and custom field names
    expect(User.options.timestamps).toBe(true);
    expect(User.options.createdAt).toBe('created_at');
    expect(User.options.updatedAt).toBe('updated_at');
  });

  describe('associate()', () => {
    it('contains the correct belongsTo(models.Tenant) call', () => {
      const src = User.associate.toString();
      expect(src).toMatch(
        /User\.belongsTo\s*\(\s*models\.Tenant\s*,\s*\{\s*foreignKey:\s*['"]tenant_id['"]\s*,\s*onDelete:\s*['"]CASCADE['"]\s*\}\)/
      );
    });

    it('contains the correct hasOne(models.UsersAdmin) call', () => {
      const src = User.associate.toString();
      expect(src).toMatch(
        /User\.hasOne\s*\(\s*models\.UsersAdmin\s*,\s*\{\s*foreignKey:\s*['"]id['"]\s*,\s*as:\s*['"]adminRecord['"]\s*\}\)/
      );
    });
  });
});
