// __tests__/controllers/reviewController.test.js
import { reviewController } from '../../controllers/reviewController.js';

describe('ReviewController', () => {
  let req, res, next;
  let Car, Review, User;

  beforeEach(() => {
    Car    = { findByPk: jest.fn() };
    Review = { create: jest.fn(), findAll: jest.fn(), findByPk: jest.fn() };
    User   = { findByPk: jest.fn() };

    req = {
      params: {},
      body: {},
      tenantModels: { Car, Review },
      app: { get: jest.fn(() => ({ User })) },
      user: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json:   jest.fn()
    };
    next = jest.fn();

    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createReview', () => {
    it('400 when no user_id anywhere', async () => {
      req.body = { car_id: 1, rating: 5, comment: 'Great!' };
      // no req.user.id
      await reviewController.createReview(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'user_id is required' });
    });

    it('400 when invalid car_id', async () => {
      req.body = { car_id: 2, rating: 4, comment: 'Ok', user_id: 7 };
      Car.findByPk.mockResolvedValue(null);
      await reviewController.createReview(req, res, next);

      expect(Car.findByPk).toHaveBeenCalledWith(2);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid car_id' });
    });

    it('400 when invalid user_id', async () => {
      req.body = { car_id: 3, rating: 3, comment: 'Meh', user_id: 8 };
      Car.findByPk.mockResolvedValue({ id: 3 });
      User.findByPk.mockResolvedValue(null);
      await reviewController.createReview(req, res, next);

      expect(User.findByPk).toHaveBeenCalledWith(8);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid user_id' });
    });

    it('uses req.user.id if no body user_id and creates review', async () => {
      req.body = { car_id: 4, rating: 5, comment: 'Nice' };
      req.user = { id: 9 };
      Car.findByPk.mockResolvedValue({ id: 4 });
      User.findByPk.mockResolvedValue({ id: 9 });
      const fake = { id: 100, user_id: 9, car_id: 4, rating: 5, comment: 'Nice' };
      Review.create.mockResolvedValue(fake);

      await reviewController.createReview(req, res, next);

      expect(Review.create).toHaveBeenCalledWith({
        user_id: 9,
        car_id: 4,
        rating: 5,
        comment: 'Nice'
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Review created successfully',
        review: fake
      });
    });

    it('forwards creation errors', async () => {
      req.body = { car_id: 5, rating: 2, comment: 'Bad', user_id: 10 };
      Car.findByPk.mockResolvedValue({ id: 5 });
      User.findByPk.mockResolvedValue({ id: 10 });
      const boom = new Error('create failed');
      Review.create.mockRejectedValue(boom);

      await reviewController.createReview(req, res, next);

      expect(next).toHaveBeenCalledWith(boom);
    });
  });

  describe('getReviews', () => {
    it('returns all reviews', async () => {
      const arr = [{ id: 1 }, { id: 2 }];
      Review.findAll.mockResolvedValue(arr);

      await reviewController.getReviews(req, res, next);

      expect(Review.findAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(arr);
    });

    it('forwards findAll errors', async () => {
      const boom = new Error('findAll fail');
      Review.findAll.mockRejectedValue(boom);

      await reviewController.getReviews(req, res, next);

      expect(next).toHaveBeenCalledWith(boom);
    });
  });

  describe('deleteReview', () => {
    it('404 if not found', async () => {
      req.params.id = 11;
      Review.findByPk.mockResolvedValue(null);

      await reviewController.deleteReview(req, res, next);

      expect(Review.findByPk).toHaveBeenCalledWith(11);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Review not found' });
    });

    it('destroys and returns success', async () => {
      req.params.id = 12;
      const review = { destroy: jest.fn() };
      Review.findByPk.mockResolvedValue(review);

      await reviewController.deleteReview(req, res, next);

      expect(review.destroy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Review deleted successfully' });
    });

    it('forwards destroy errors', async () => {
      req.params.id = 13;
      const boom = new Error('destroy fail');
      const review = { destroy: jest.fn().mockRejectedValue(boom) };
      Review.findByPk.mockResolvedValue(review);

      await reviewController.deleteReview(req, res, next);

      expect(next).toHaveBeenCalledWith(boom);
    });
  });
});
