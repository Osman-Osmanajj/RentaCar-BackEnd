// __tests__/models/Payment.test.js
import { Sequelize, DataTypes } from 'sequelize';
import paymentModel from '../../models/Payment.js';

describe('Payment Model', () => {
  let sequelize;
  let Payment;

  beforeAll(() => {
    // In-memory SQLite without URL parsing warnings
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false
    });
    Payment = paymentModel(sequelize, {
      schema:     'myschema',
      searchPath: 'myschema'
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('defines the correct attributes', () => {
    const attrs = Payment.rawAttributes;

    expect(attrs).toHaveProperty('booking_id');
    expect(attrs.booking_id.type.key).toBe('INTEGER');
    expect(attrs.booking_id.allowNull).toBe(false);

    expect(attrs).toHaveProperty('amount');
    expect(attrs.amount.type.key).toBe('DECIMAL');
    expect(attrs.amount.allowNull).toBe(false);

    expect(attrs).toHaveProperty('status');
    expect(attrs.status.type.options.values).toEqual(
      expect.arrayContaining(['Pending','Completed','Failed'])
    );
    expect(attrs.status.allowNull).toBe(false);

    expect(attrs).toHaveProperty('payment_method');
    expect(attrs.payment_method.type.options.values).toEqual(
      expect.arrayContaining(['Card','Cash','PayPal'])
    );
    expect(attrs.payment_method.allowNull).toBe(false);
  });

  it('has the correct model options', () => {
    expect(Payment.tableName).toBe('payments');
    expect(Payment.options.underscored).toBe(true);
    expect(Payment.options.timestamps).toBe(false);
    expect(Payment.options.schema).toBe('myschema');
    expect(Payment.options.searchPath).toBe('myschema');
  });

  describe('associate()', () => {
    it('references belongsTo(models.Booking) with foreignKey booking_id', () => {
      const src = Payment.associate.toString();
      expect(src).toMatch(
        /Payment\.belongsTo\s*\(\s*models\.Booking\s*,\s*\{\s*foreignKey:\s*['"]booking_id['"]\s*\}\)/
      );
    });
  });
});
