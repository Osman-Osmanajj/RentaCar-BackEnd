// controllers/reviewController.js
class ReviewController {
  /* ───────── POST /api/review ───────── */
  async createReview(req, res, next) {
    try {
      const {
        car_id,
        rating,
        comment,
        user_id: bodyUserId,          // optional in body
      } = req.body;

      // user id can come from JWT middleware or request body
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

  /* ───────── DELETE /api/review/:id ───────── */
  async deleteReview(req, res, next) {
    try {
      const { id } = req.params;       // id = reviewId
      const { Review } = req.tenantModels;

      const review = await Review.findByPk(id);
      if (!review) {
        return res.status(404).json({ message: 'Review not found' });
      }

      await review.destroy();
      return res
        .status(200)
        .json({ message: 'Review deleted successfully' });
    } catch (err) {
      next(err);
    }
  }
}

export const reviewController = new ReviewController();
