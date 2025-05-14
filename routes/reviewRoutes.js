import express from 'express';
import { reviewController } from '../controllers/reviewController.js';

const router = express.Router();

router.post('/:id/reviews', reviewController.createReview.bind(reviewController));
router.get('/:id/reviews', reviewController.getReviews.bind(reviewController));
router.delete('/:id/reviews/:reviewId', reviewController.deleteReview.bind(reviewController));

export default router;
