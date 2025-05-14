import { sequelize } from '../config/database.js';
import { TenantModelService } from '../services/TenantModelService.js';
import { PublicModelService } from '../services/PublicModelService.js';

class ReviewController {
  async createReview(req, res) {
    try {
      const { id } = req.params;
      const { user_id, car_id, rating, comment } = req.body;

      const publicModelService = new PublicModelService(sequelize);
      const tenantModelService = new TenantModelService(publicModelService);
      const { models, schemaName } = await tenantModelService.getTenantModels(id);
      const { Review } = models;

      await sequelize.query(`SET search_path TO ${schemaName};`);

      const review = await Review.create({
        user_id,
        car_id,
        rating,
        comment,
      });

      res.status(201).json({ message: 'Review created successfully', review });
    } catch (error) {
      console.error('Error creating review:', error);
      res.status(500).json({ message: 'Internal server error while creating review' });
    }
  }

  async getReviews(req, res) {
    try {
      const { id } = req.params; // tenant id

      const publicModelService = new PublicModelService(sequelize);
      const tenantModelService = new TenantModelService(publicModelService);
      const { models, schemaName } = await tenantModelService.getTenantModels(id);
      const { Review } = models;

      await sequelize.query(`SET search_path TO ${schemaName};`);

      const reviews = await Review.findAll();

      res.status(200).json(reviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      res.status(500).json({ message: 'Internal server error while fetching reviews' });
    }
  }

  async deleteReview(req, res) {
    try {
      const { id, reviewId } = req.params;

      const publicModelService = new PublicModelService(sequelize);
      const tenantModelService = new TenantModelService(publicModelService);
      const { models, schemaName } = await tenantModelService.getTenantModels(id);
      const { Review } = models;

      await sequelize.query(`SET search_path TO ${schemaName};`);

      const review = await Review.findByPk(reviewId);

      if (!review) {
        return res.status(404).json({ message: 'Review not found' });
      }

      await review.destroy();

      res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
      console.error('Error deleting review:', error);
      res.status(500).json({ message: 'Internal server error while deleting review' });
    }
  }
}

export const reviewController = new ReviewController();
