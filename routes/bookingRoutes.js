import express from 'express';
import { bookingController } from '../controllers/bookingController.js';

const router = express.Router();

/**
 * @swagger
 * /booking/create/{userId}:
 *   post:
 *     summary: Krijon një rezervim të ri për një përdorues
 *     tags: [Booking]
 *     security:
 *       - TenantHeader: []
 *     parameters:
 *       - in: header
 *         name: X-Tenant-ID
 *         schema:
 *           type: string
 *         required: true
 *         description: ID e tenant-it
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID e përdoruesit që bën rezervimin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - car_id
 *               - start_date
 *               - end_date
 *             properties:
 *               car_id:
 *                 type: integer
 *                 example: 6
 *               start_date:
 *                 type: string
 *                 format: date
 *                 example: "2025-05-30"
 *               end_date:
 *                 type: string
 *                 format: date
 *                 example: "2025-06-01"
 *               status:
 *                 type: string
 *                 example: "Pending"
 *     responses:
 *       201:
 *         description: Rezervimi u krijua me sukses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 booking:
 *                   type: object
 *       409:
 *         description: Vetura është e zënë në ato data
 */
router.post('/create/:userId', bookingController.createBooking.bind(bookingController));

/**
 * @swagger
 * /booking/all:
 *   get:
 *     summary: Kthen të gjitha rezervimet (për tenant)
 *     tags: [Booking]
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
 *         description: Lista e rezervimeve
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/all', bookingController.getAllBookings.bind(bookingController));

/**
 * @swagger
 * /booking/costumers:
 *   get:
 *     summary: Kthen klientët që kanë pasur rezervime të përfunduara (Completed)
 *     tags: [Booking]
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
 *         description: Lista e klientëve unikë me rezervimet përkatëse
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 customers:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *                 bookings:
 *                   type: array
 *                   items:
 *                     type: object
 */
router.get('/costumers', bookingController.getCostumersBasedOnbooking.bind(bookingController));

/**
 * @swagger
 * /booking/my/{userId}:
 *   get:
 *     summary: Kthen rezervimet për një përdorues të caktuar
 *     tags: [Booking]
 *     security:
 *       - TenantHeader: []
 *     parameters:
 *       - in: header
 *         name: X-Tenant-ID
 *         schema:
 *           type: string
 *         required: true
 *         description: ID e tenant-it
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID e përdoruesit
 *     responses:
 *       200:
 *         description: Lista e rezervimeve për përdoruesin
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/my/:userId', bookingController.getUserBookings.bind(bookingController));

/**
 * @swagger
 * /booking/{id}:
 *   delete:
 *     summary: Fshin një rezervim sipas ID-së
 *     tags: [Booking]
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
 *         description: ID e rezervimit që do të fshihet
 *     responses:
 *       200:
 *         description: Rezervimi u fshi me sukses
 *       404:
 *         description: Rezervimi nuk u gjet
 */
router.delete('/:id', bookingController.deleteBooking.bind(bookingController));

/**
 * @swagger
 * /booking/{id}:
 *   patch:
 *     summary: Përditëson një rezervim sipas ID-së
 *     tags: [Booking]
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
 *         description: ID e rezervimit që do të përditësohet
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               start_date:
 *                 type: string
 *                 format: date
 *               end_date:
 *                 type: string
 *                 format: date
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Rezervimi u përditësua me sukses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 booking:
 *                   type: object
 *       404:
 *         description: Rezervimi nuk u gjet
 *       409:
 *         description: Vetura është e zënë në ato data
 */
router.patch('/:id', bookingController.updateBooking.bind(bookingController));

export default router;
