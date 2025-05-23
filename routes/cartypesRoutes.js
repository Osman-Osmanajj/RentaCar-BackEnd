import express from 'express';
import { carTypeController } from '../controllers/CartypesController.js';

const router = express.Router();

/**
 * @swagger
 * /cartypes/create:
 *   post:
 *     summary: Krijon një lloj të ri të veturës
 *     tags: [CarType]
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
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Sedan"
 *               description:
 *                 type: string
 *                 example: "Automjet me 4 dyer, komod për udhëtime të gjata."
 *     responses:
 *       201:
 *         description: Car type u krijua me sukses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 carType:
 *                   type: object
 */
router.post('/create',  carTypeController.createCarType.bind(carTypeController));

/**
 * @swagger
 * /cartypes/all:
 *   get:
 *     summary: Kthen të gjitha llojet e veturave
 *     tags: [CarType]
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
 *         description: Lista e car types
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       404:
 *         description: Nuk u gjet asnjë car type
 */
router.get('/all', carTypeController.getCarTypes.bind(carTypeController));

/**
 * @swagger
 * /cartypes/{id}:
 *   get:
 *     summary: Kthen një car type sipas ID-së
 *     tags: [CarType]
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
 *         description: ID e car type
 *     responses:
 *       200:
 *         description: Car type u kthye me sukses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Car type nuk u gjet
 */
router.get('/:id', carTypeController.getCarTypeById.bind(carTypeController));

/**
 * @swagger
 * /cartypes/{id}:
 *   patch:
 *     summary: Përditëson një car type sipas ID-së
 *     tags: [CarType]
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
 *         description: ID e car type që do të përditësohet
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "SUV"
 *               description:
 *                 type: string
 *                 example: "Makina të mëdha, të përshtatshme për terrene të vështira."
 *     responses:
 *       200:
 *         description: Car type u përditësua me sukses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 carType:
 *                   type: object
 *       404:
 *         description: Car type nuk u gjet
 */
router.patch('/:id', carTypeController.updateCarTypeById.bind(carTypeController));

export default router;
