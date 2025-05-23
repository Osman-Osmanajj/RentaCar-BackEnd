// __tests__/models/CarImage.test.js
import { Sequelize, DataTypes } from 'sequelize';
import carImageModel from '../../models/CarImage.js';

describe('CarImage Model', () => {
  let sequelize;
  let CarImage;

  beforeAll(() => {
    // In-memory SQLite for introspection
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false
    });
    CarImage = carImageModel(sequelize, {
      schema:     'myschema',
      searchPath: 'myschema'
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('defines the correct attributes', () => {
    const attrs = CarImage.rawAttributes;

    expect(attrs).toHaveProperty('car_id');
    expect(attrs.car_id.type.key).toBe('INTEGER');
    expect(attrs.car_id.allowNull).toBe(false);

    expect(attrs).toHaveProperty('image_url');
    expect(attrs.image_url.type.key).toBe('TEXT');
    expect(attrs.image_url.allowNull).toBe(false);
  });

  it('has the correct model options', () => {
    expect(CarImage.tableName).toBe('car_images');
    expect(CarImage.options.underscored).toBe(true);
    expect(CarImage.options.timestamps).toBe(false);
    expect(CarImage.options.schema).toBe('myschema');
    expect(CarImage.options.searchPath).toBe('myschema');
  });

  describe('associate()', () => {
    it('references belongsTo(models.Car) with foreignKey car_id', () => {
      const src = CarImage.associate.toString();
      expect(src).toMatch(
        /CarImage\.belongsTo\s*\(\s*models\.Car\s*,\s*\{\s*foreignKey:\s*['"]car_id['"]\s*\}\)/
      );
    });
  });
});
