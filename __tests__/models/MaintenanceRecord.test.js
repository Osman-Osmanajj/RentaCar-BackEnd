// __tests__/models/MaintenanceRecord.test.js
import { Sequelize, DataTypes } from 'sequelize';
import maintenanceRecordModel from '../../models/MaintenanceRecord.js';

describe('MaintenanceRecord Model', () => {
  let sequelize;
  let MaintenanceRecord;

  beforeAll(() => {
    // In-memory SQLite for model introspection
   sequelize = new Sequelize({
  dialect:  'sqlite',
  storage:  ':memory:',
  logging:  false
});
    MaintenanceRecord = maintenanceRecordModel(sequelize, {
      schema:     'myschema',
      searchPath: 'myschema'
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('defines the correct attributes', () => {
    const attrs = MaintenanceRecord.rawAttributes;

    expect(attrs).toHaveProperty('car_id');
    expect(attrs.car_id.type.key).toBe('INTEGER');
    expect(attrs.car_id.allowNull).toBe(false);

    expect(attrs).toHaveProperty('service_type');
    expect(attrs.service_type.type.key).toBe('STRING');

    expect(attrs).toHaveProperty('service_date');
    expect(attrs.service_date.type.key).toBe('DATE');

    expect(attrs).toHaveProperty('description');
    expect(attrs.description.type.key).toBe('TEXT');

    expect(attrs).toHaveProperty('cost');
    expect(attrs.cost.type.key).toBe('DECIMAL');
  });

  it('has the correct model options', () => {
    expect(MaintenanceRecord.tableName).toBe('maintenance_records');
    expect(MaintenanceRecord.options.underscored).toBe(true);
    expect(MaintenanceRecord.options.timestamps).toBe(false);
    expect(MaintenanceRecord.options.schema).toBe('myschema');
    expect(MaintenanceRecord.options.searchPath).toBe('myschema');
  });

  describe('associate()', () => {
    it('references belongsTo(models.Car) with foreignKey car_id', () => {
      const src = MaintenanceRecord.associate.toString();
      expect(src).toMatch(
        /MaintenanceRecord\.belongsTo\s*\(\s*models\.Car\s*,\s*\{\s*foreignKey:\s*['"]car_id['"]\s*\}\)/
      );
    });
  });
});
