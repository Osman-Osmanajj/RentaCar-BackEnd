import express from 'express';
import { reviewController } from '../controllers/reviewController.js';

const router = express.Router();

router.post('/create', reviewController.createReview.bind(reviewController));
router.get('/all', reviewController.getReviews.bind(reviewController));
router.delete('/:reviewId', reviewController.deleteReview.bind(reviewController));

export default router;
