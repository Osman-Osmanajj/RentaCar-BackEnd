// __tests__/models/Booking.test.js
import { Sequelize, DataTypes } from 'sequelize';
import bookingModel from '../../models/Booking.js';

describe('Booking Model', () => {
  let sequelize;
  let Booking;

  beforeAll(() => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false
    });
    Booking = bookingModel(sequelize, {
      schema:     'myschema',
      searchPath: 'myschema'
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('defines the correct attributes', () => {
    const attrs = Booking.rawAttributes;
    expect(attrs.user_id.type.key).toBe('INTEGER');
    expect(attrs.car_id.type.key).toBe('INTEGER');
    expect(attrs.start_date.type.key).toBe('DATE');
    expect(attrs.end_date.type.key).toBe('DATE');
    expect(attrs.status.type.options.values).toEqual(
      expect.arrayContaining(['Pending','Confirmed','Cancelled','Completed'])
    );
    expect(attrs.total_price.type.key).toBe('DECIMAL');
  });

  it('has the correct model options', () => {
    expect(Booking.tableName).toBe('bookings');
    expect(Booking.options.underscored).toBe(true);
    expect(Booking.options.timestamps).toBe(false);
    expect(Booking.options.schema).toBe('myschema');
    expect(Booking.options.searchPath).toBe('myschema');
  });

  describe('associate()', () => {
    it('references belongsTo(models.Car) and hasMany(models.CarImage)', () => {
      const src = Booking.associate.toString();
      // check that Booking.belongsTo(models.Car, { foreignKey: 'car_id' }) appears
      expect(src).toMatch(/Booking\.belongsTo\s*\(\s*models\.Car\s*,\s*\{\s*foreignKey:\s*['"]car_id['"]/);
      // check that Booking.hasMany(models.CarImage, { foreignKey: 'car_id', sourceKey: 'car_id' }) appears
      expect(src).toMatch(
        /Booking\.hasMany\s*\(\s*models\.CarImage[\s\S]*foreignKey:\s*['"]car_id['"][\s\S]*sourceKey:\s*['"]car_id['"]/
      );
    });
  });
});
