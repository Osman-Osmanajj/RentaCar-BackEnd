// __tests__/models/CarType.test.js
import { Sequelize, DataTypes } from 'sequelize';
import carTypeModel from '../../models/CarType.js';

describe('CarType Model', () => {
  let sequelize;
  let CarType;

  beforeAll(() => {
    // Use in-memory SQLite for model introspection
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false
    });
    CarType = carTypeModel(sequelize, {
      schema:     'myschema',
      searchPath: 'myschema'
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('defines the correct attributes', () => {
    const attrs = CarType.rawAttributes;

    expect(attrs).toHaveProperty('name');
    expect(attrs.name.type.key).toBe('STRING');
    expect(attrs.name.allowNull).toBe(false);

    expect(attrs).toHaveProperty('description');
    expect(attrs.description.type.key).toBe('TEXT');
  });

  it('has the correct model options', () => {
    expect(CarType.tableName).toBe('car_types');
    expect(CarType.options.underscored).toBe(true);
    expect(CarType.options.timestamps).toBe(false);
    expect(CarType.options.schema).toBe('myschema');
    expect(CarType.options.searchPath).toBe('myschema');
  });

  describe('associate()', () => {
    it('references hasMany(models.Car) with foreignKey car_type_id', () => {
      const src = CarType.associate.toString();
      expect(src).toMatch(
        /CarType\.hasMany\s*\(\s*models\.Car\s*,\s*\{\s*foreignKey:\s*['"]car_type_id['"]\s*\}\)/
      );
    });
  });
});
