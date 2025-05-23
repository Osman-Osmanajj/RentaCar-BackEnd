// __tests__/models/CarDamageReport.test.js
import { Sequelize, DataTypes } from 'sequelize';
import carDamageReportModel from '../../models/CarDamageReport.js';

describe('CarDamageReport Model', () => {
  let sequelize;
  let CarDamageReport;

  beforeAll(() => {
    // use in-memory SQLite for model introspection
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false
    });
    CarDamageReport = carDamageReportModel(sequelize, {
      schema:     'myschema',
      searchPath: 'myschema'
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('defines the correct attributes', () => {
    const attrs = CarDamageReport.rawAttributes;

    expect(attrs).toHaveProperty('car_id');
    expect(attrs.car_id.type.key).toBe('INTEGER');
    expect(attrs.car_id.allowNull).toBe(false);

    expect(attrs).toHaveProperty('damage_type');
    expect(attrs.damage_type.type.key).toBe('STRING');

    expect(attrs).toHaveProperty('description');
    expect(attrs.description.type.key).toBe('TEXT');

    expect(attrs).toHaveProperty('cost');
    expect(attrs.cost.type.key).toBe('DECIMAL');

    expect(attrs).toHaveProperty('status');
    expect(attrs.status.type.key).toBe('STRING');
  });

  it('has the correct model options', () => {
    expect(CarDamageReport.tableName).toBe('car_damage_reports');
    expect(CarDamageReport.options.underscored).toBe(true);
    expect(CarDamageReport.options.timestamps).toBe(false);
    expect(CarDamageReport.options.schema).toBe('myschema');
    expect(CarDamageReport.options.searchPath).toBe('myschema');
  });

  describe('associate()', () => {
    it('references belongsTo(models.Car) with foreignKey car_id', () => {
      const src = CarDamageReport.associate.toString();
      expect(src).toMatch(
        /CarDamageReport\.belongsTo\s*\(\s*models\.Car\s*,\s*\{\s*foreignKey:\s*['"]car_id['"]\s*\}\)/
      );
    });
  });
});
