class ReviewController {
  async createReview(req, res, next) {
    try {
      const { user_id, car_id, rating, comment } = req.body;
      const { Review } = req.tenantModels;

      const review = await Review.create({
        user_id,
        car_id,
        rating,
        comment,
      });

      res.status(201).json({ message: 'Review created successfully', review });
    } catch (error) {
      next(error);
    }
  }

  async getReviews(req, res, next) {
    try {
      const { Review } = req.tenantModels;

      const reviews = await Review.findAll();
      res.status(200).json(reviews);
    } catch (error) {
      next(error);
    }
  }

  async deleteReview(req, res, next) {
    try {
      const { reviewId } = req.params;
      const { Review } = req.tenantModels;

      const review = await Review.findByPk(reviewId);

      if (!review) {
        return res.status(404).json({ message: 'Review not found' });
      }

      await review.destroy();

      res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

export const reviewController = new ReviewController();
