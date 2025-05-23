import express from 'express';
import { reviewController } from '../controllers/reviewController.js';

const router = express.Router();

/**
 * @swagger
 * /review/create:
 *   post:
 *     summary: Shton një review të ri për një makinë
 *     tags: [Review]
 *     security:
 *       - TenantHeader: []
 *     parameters:
 *       - in: header
 *         name: X-Tenant-ID
 *         schema:
 *           type: string
 *         required: true
 *         description: ID e tenant-it për të cilën krijohet review
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - car_id
 *               - rating
 *               - comment
 *             properties:
 *               car_id:
 *                 type: integer
 *                 example: 3
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 4
 *               comment:
 *                 type: string
 *                 example: "Very clean and comfortable car."
 *               user_id:
 *                 type: integer
 *                 example: 11
 *                 description: ID e përdoruesit (opsionale, merret nga token nëse mungon)
 *     responses:
 *       201:
 *         description: Review u krijua me sukses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 review:
 *                   type: object
 *       400:
 *         description: Kërkesë jo valide
 */
router.post('/create', reviewController.createReview.bind(reviewController));

/**
 * @swagger
 * /review/all:
 *   get:
 *     summary: Kthen të gjitha review-t (për të gjithë makinën)
 *     tags: [Review]
 *     security:
 *       - TenantHeader: []
 *     parameters:
 *       - in: header
 *         name: X-Tenant-ID
 *         schema:
 *           type: string
 *         required: true
 *         description: ID e tenant-it
 *     responses:
 *       200:
 *         description: Lista e review-ve
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/all', reviewController.getReviews.bind(reviewController));

/**
 * @swagger
 * /review/{car_id}:
 *   get:
 *     summary: Kthen të gjitha review-t për një makinë të caktuar
 *     tags: [Review]
 *     security:
 *       - TenantHeader: []
 *     parameters:
 *       - in: header
 *         name: X-Tenant-ID
 *         schema:
 *           type: string
 *         required: true
 *         description: ID e tenant-it
 *       - name: car_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID e makinës për të cilën kërkohen review-t
 *     responses:
 *       200:
 *         description: Lista e review-ve për makinën
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       400:
 *         description: car_id mungon ose është jo valid
 */
router.get('/:car_id', reviewController.getReviewsByCarId.bind(reviewController));

export default router;
