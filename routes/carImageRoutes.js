import express from 'express';
import { carImageController } from '../controllers/carImageController.js';

const router = express.Router();

/**
 * @swagger
 * /carimage/create:
 *   post:
 *     summary: Shton një imazh të ri për veturë
 *     tags: [CarImage]
 *     security:
 *       - TenantHeader: []
 *     parameters:
 *       - in: header
 *         name: X-Tenant-ID
 *         schema:
 *           type: string
 *         required: true
 *         description: ID e tenant-it
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - car_id
 *               - image_url
 *             properties:
 *               car_id:
 *                 type: integer
 *                 example: 5
 *               image_url:
 *                 type: string
 *                 example: "https://imgur.com/photo.jpg"
 *     responses:
 *       201:
 *         description: Imazhi u shtua me sukses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 carImage:
 *                   type: object
 */
router.post('/create', carImageController.createCarImage.bind(carImageController));

/**
 * @swagger
 * /carimage/all:
 *   get:
 *     summary: Kthen të gjitha imazhet e veturave të tenant-it
 *     tags: [CarImage]
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
 *         description: Lista e imazheve të veturave
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/all', carImageController.getCarImages.bind(carImageController));

/**
 * @swagger
 * /carimage/{id}:
 *   delete:
 *     summary: Fshin një imazh të veturës sipas ID-së
 *     tags: [CarImage]
 *     security:
 *       - TenantHeader: []
 *     parameters:
 *       - in: header
 *         name: X-Tenant-ID
 *         schema:
 *           type: string
 *         required: true
 *         description: ID e tenant-it
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID e imazhit për të fshirë
 *     responses:
 *       200:
 *         description: Imazhi u fshi me sukses
 *       404:
 *         description: Imazhi nuk u gjet
 */
router.delete('/:id', carImageController.deleteCarImage.bind(carImageController));

/**
 * @swagger
 * /carimage/{id}:
 *   patch:
 *     summary: Përditëson një imazh të veturës sipas ID-së
 *     tags: [CarImage]
 *     security:
 *       - TenantHeader: []
 *     parameters:
 *       - in: header
 *         name: X-Tenant-ID
 *         schema:
 *           type: string
 *         required: true
 *         description: ID e tenant-it
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID e imazhit për të përditësuar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - image_url
 *             properties:
 *               image_url:
 *                 type: string
 *                 example: "https://imgur.com/updated.jpg"
 *     responses:
 *       200:
 *         description: Imazhi u përditësua me sukses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 image:
 *                   type: object
 *       404:
 *         description: Imazhi nuk u gjet
 */
router.patch('/:id', carImageController.updateCarImage.bind(carImageController));

export default router;
