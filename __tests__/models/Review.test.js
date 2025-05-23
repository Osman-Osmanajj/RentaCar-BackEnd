// __tests__/models/Review.test.js
import { Sequelize, DataTypes } from 'sequelize';
import reviewModel from '../../models/Review.js';

describe('Review Model', () => {
  let sequelize;
  let Review;

  beforeAll(() => {
    // Use in-memory SQLite without URL warning
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false
    });
    Review = reviewModel(sequelize, {
      schema:     'myschema',
      searchPath: 'myschema'
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('defines the correct attributes', () => {
    const attrs = Review.rawAttributes;

    expect(attrs).toHaveProperty('user_id');
    expect(attrs.user_id.type.key).toBe('INTEGER');
    expect(attrs.user_id.allowNull).toBe(false);

    expect(attrs).toHaveProperty('car_id');
    expect(attrs.car_id.type.key).toBe('INTEGER');
    expect(attrs.car_id.allowNull).toBe(false);

    expect(attrs).toHaveProperty('rating');
    expect(attrs.rating.type.key).toBe('INTEGER');
    expect(attrs.rating.allowNull).toBe(false);
    expect(attrs.rating.validate).toEqual(
      expect.objectContaining({ min: 1, max: 5 })
    );

    expect(attrs).toHaveProperty('comment');
    expect(attrs.comment.type.key).toBe('TEXT');

    expect(attrs).toHaveProperty('created_at');
    expect(attrs.created_at.type.key).toBe('DATE');
    // defaultValue is DataTypes.NOW
    expect(attrs.created_at.defaultValue).toBeDefined();
  });

  it('has the correct model options', () => {
    expect(Review.tableName).toBe('reviews');
    expect(Review.options.underscored).toBe(true);
    expect(Review.options.timestamps).toBe(false);
    expect(Review.options.schema).toBe('myschema');
    expect(Review.options.searchPath).toBe('myschema');
  });

  describe('associate()', () => {
    it('references belongsTo(models.Car) with foreignKey car_id', () => {
      const src = Review.associate.toString();
      expect(src).toMatch(
        /Review\.belongsTo\s*\(\s*models\.Car\s*,\s*\{\s*foreignKey:\s*['"]car_id['"]\s*\}\)/
      );
    });
  });
});
