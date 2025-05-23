// controllers/reviewController.js
class ReviewController {
  /* ───────── POST /api/review ───────── */
  async createReview(req, res, next) {
    try {
      const {
        car_id,
        rating,
        comment,
        user_id: bodyUserId,          
      } = req.body;

      
      const user_id = bodyUserId ?? req.user?.id;
      if (!user_id) {
        return res.status(400).json({ message: 'user_id is required' });
      }

      /* ── validate parent rows ────────────────────────── */
      const { Car, Review } = req.tenantModels;
      const { User } = req.app.get('models');

      if (!(await Car.findByPk(car_id))) {
        return res.status(400).json({ message: 'Invalid car_id' });
      }
      if (!(await User.findByPk(user_id))) {
        return res.status(400).json({ message: 'Invalid user_id' });
      }

      /* ── create review ──────────────────────────────── */
      const review = await Review.create({
        user_id,
        car_id,
        rating,
        comment,
      });

      return res
        .status(201)
        .json({ message: 'Review created successfully', review });
    } catch (err) {
      next(err);
    }
  }

  /* ───────── GET /api/review/all ───────── */
  async getReviews(req, res, next) {
    try {
      const { Review } = req.tenantModels;
      const reviews = await Review.findAll();
      return res.status(200).json(reviews);
    } catch (err) {
      next(err);
    }
  }

  async getReviewsByCarId(req, res, next) {
    try {
      const { car_id } = req.params;
      const { Review } = req.tenantModels;
      if (!car_id) {
        return res.status(400).json({ message: 'car_id is required' });
      }

      const reviews = await Review.findAll({
        where: { car_id },
        
        order: [['created_at', 'DESC']],
      });

      if (!reviews.length) {
        return res.status(200).json({ message: 'No reviews found' });
      }

      return res.status(200).json(reviews);
    } catch (err) {
      next(err);
    }

  }
}

export const reviewController = new ReviewController();
