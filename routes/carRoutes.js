import express from 'express';
import { carController } from '../controllers/carController.js';

const router = express.Router();

/**
 * @swagger
 * /car/create:
 *   post:
 *     summary: Krijon një veturë të re
 *     tags: [Car]
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
 *               - make
 *               - model
 *               - year
 *               - license_plate
 *               - car_type_id
 *               - price
 *               - image_url
 *             properties:
 *               make:
 *                 type: string
 *                 example: "BMW"
 *               model:
 *                 type: string
 *                 example: "320d"
 *               year:
 *                 type: integer
 *                 example: 2022
 *               license_plate:
 *                 type: string
 *                 example: "01-123-AB"
 *               status:
 *                 type: string
 *                 example: "Available"
 *               car_type_id:
 *                 type: integer
 *                 example: 1
 *               price:
 *                 type: number
 *                 example: 49.99
 *               image_url:
 *                 type: string
 *                 example: "https://imgur.com/123.jpg"
 *     responses:
 *       201:
 *         description: Car u krijua me sukses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 car:
 *                   type: object
 *       409:
 *         description: Veturë me këtë targa ekziston
 */
router.post('/create',  carController.createCar.bind(carController));

/**
 * @swagger
 * /car/all:
 *   get:
 *     summary: Kthen të gjitha veturat
 *     tags: [Car]
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
 *         description: Lista e veturave
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       404:
 *         description: Nuk u gjet asnjë veturë
 */
router.get('/all', carController.getCars.bind(carController));

/**
 * @swagger
 * /car/img-type:
 *   get:
 *     summary: Kthen veturat me imazhet dhe tipin për secilën
 *     tags: [Car]
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
 *         description: Lista e veturave me imazhe dhe tip
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       404:
 *         description: Nuk u gjet asnjë veturë
 */
router.get('/img-type', carController.getCarsTypesImages.bind(carController));

/**
 * @swagger
 * /car/{id}:
 *   get:
 *     summary: Kthen një veturë sipas ID-së
 *     tags: [Car]
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
 *         description: ID e veturës që kërkohet
 *     responses:
 *       200:
 *         description: Veturë u kthye me sukses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Veturë nuk u gjet
 */
router.get('/:id', carController.getCarById.bind(carController));

/**
 * @swagger
 * /car/{id}:
 *   patch:
 *     summary: Përditëson një veturë sipas ID-së
 *     tags: [Car]
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
 *         description: ID e veturës që do të përditësohet
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               make:
 *                 type: string
 *               model:
 *                 type: string
 *               year:
 *                 type: integer
 *               license_plate:
 *                 type: string
 *               status:
 *                 type: string
 *               car_type_id:
 *                 type: integer
 *               price:
 *                 type: number
 *               image_url:
 *                 type: string
 *     responses:
 *       200:
 *         description: Veturë u përditësua me sukses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 car:
 *                   type: object
 *       404:
 *         description: Veturë nuk u gjet
 */
router.patch('/:id', carController.updateCarById.bind(carController));

/**
 * @swagger
 * /car/{id}:
 *   delete:
 *     summary: Fshin një veturë sipas ID-së
 *     tags: [Car]
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
 *         description: ID e veturës që do të fshihet
 *     responses:
 *       200:
 *         description: Veturë u fshi me sukses
 *       404:
 *         description: Veturë nuk u gjet
 */
router.delete('/:id', carController.deleteCar.bind(carController));

export default router;
