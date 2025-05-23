// __tests__/models/Car.test.js
import { Sequelize, DataTypes } from 'sequelize';
import carModel from '../../models/Car.js';

describe('Car Model', () => {
  let sequelize;
  let Car;

  beforeAll(() => {
    // Use in-memory SQLite for introspection
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false
    });
    Car = carModel(sequelize, {
      schema:     'myschema',
      searchPath: 'myschema'
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('defines the correct attributes', () => {
    const attrs = Car.rawAttributes;

    expect(attrs).toHaveProperty('make');
    expect(attrs.make.type.key).toBe('STRING');
    expect(attrs.make.allowNull).toBe(false);

    expect(attrs).toHaveProperty('model');
    expect(attrs.model.type.key).toBe('STRING');
    expect(attrs.model.allowNull).toBe(false);

    expect(attrs).toHaveProperty('year');
    expect(attrs.year.type.key).toBe('INTEGER');
    expect(attrs.year.allowNull).toBe(false);

    expect(attrs).toHaveProperty('license_plate');
    expect(attrs.license_plate.type.key).toBe('STRING');
    expect(attrs.license_plate.unique).toBe(true);
    expect(attrs.license_plate.allowNull).toBe(false);

    expect(attrs).toHaveProperty('status');
    expect(attrs.status.type.options.values).toEqual(
      expect.arrayContaining(['Available','Rented','Maintenance'])
    );

    expect(attrs).toHaveProperty('car_type_id');
    expect(attrs.car_type_id.type.key).toBe('INTEGER');

    expect(attrs).toHaveProperty('price');
    expect(attrs.price.type.key).toBe('DECIMAL');
    expect(attrs.price.allowNull).toBe(false);
  });

  it('has the correct model options', () => {
    expect(Car.tableName).toBe('cars');
    expect(Car.options.underscored).toBe(true);
    expect(Car.options.timestamps).toBe(false);
    expect(Car.options.schema).toBe('myschema');
    expect(Car.options.searchPath).toBe('myschema');
  });

  describe('associate()', () => {
    it('contains all association calls', () => {
      const src = Car.associate.toString();

      // belongsTo CarType
      expect(src).toMatch(
        /Car\.belongsTo\s*\(\s*models\.CarType\s*,\s*\{\s*foreignKey:\s*['"]car_type_id['"]/
      );

      // hasMany CarImage
      expect(src).toMatch(
        /Car\.hasMany\s*\(\s*models\.CarImage[\s\S]*foreignKey:\s*['"]car_id['"]/
      );

      // hasMany Booking
      expect(src).toMatch(
        /Car\.hasMany\s*\(\s*models\.Booking[\s\S]*foreignKey:\s*['"]car_id['"]/
      );

      // hasMany MaintenanceRecord
      expect(src).toMatch(
        /Car\.hasMany\s*\(\s*models\.MaintenanceRecord[\s\S]*foreignKey:\s*['"]car_id['"]/
      );

      // hasMany CarDamageReport
      expect(src).toMatch(
        /Car\.hasMany\s*\(\s*models\.CarDamageReport[\s\S]*foreignKey:\s*['"]car_id['"]/
      );
    });
  });
});
