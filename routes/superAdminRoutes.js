import express from 'express';
import { superAdminController } from '../controllers/superAdminController.js';
import { authenticateJWT } from '../middlewares/authenticateJWT.js';

const router = express.Router();
router.use(authenticateJWT);

/**
 * @swagger
 * /super/tenants:
 *   get:
 *     summary: Kthen të gjithë tenant-at
 *     tags: [SuperAdmin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista e tenantëve
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tenants:
 *                   type: array
 *                   items:
 *                     type: object
 */
router.get('/tenants', superAdminController.getAllTenants.bind(superAdminController));

/**
 * @swagger
 * /super/tenants:
 *   post:
 *     summary: Krijon një tenant të ri
 *     tags: [SuperAdmin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone
 *               - address
 *               - city
 *               - country
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               country:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tenant u krijua me sukses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 tenant:
 *                   type: object
 *       409:
 *         description: Tenant me këtë email ekziston
 */
router.post('/tenants', superAdminController.createTenant.bind(superAdminController));

/**
 * @swagger
 * /super/tenants/{id}:
 *   patch:
 *     summary: Përditëson një tenant
 *     tags: [SuperAdmin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID e tenant-it
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               country:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tenant u përditësua me sukses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 tenant:
 *                   type: object
 *       404:
 *         description: Tenant nuk u gjet
 */
router.patch('/tenants/:id', superAdminController.updateTenant.bind(superAdminController));

/**
 * @swagger
 * /super/tenants/{id}:
 *   delete:
 *     summary: Fshin një tenant
 *     tags: [SuperAdmin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID e tenant-it
 *     responses:
 *       200:
 *         description: Tenant u fshi me sukses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Tenant nuk u gjet
 */
router.delete('/tenants/:id', superAdminController.deleteTenant.bind(superAdminController));

/**
 * @swagger
 * /super/users:
 *   get:
 *     summary: Kthen të gjithë përdoruesit globalisht
 *     tags: [SuperAdmin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista e të gjithë përdoruesve
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 */
router.get('/users', superAdminController.getAllUsers.bind(superAdminController));

/**
 * @swagger
 * /super/bookings:
 *   get:
 *     summary: Kthen të gjitha booking-et globalisht
 *     tags: [SuperAdmin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista e të gjitha booking-ve
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 bookings:
 *                   type: array
 *                   items:
 *                     type: object
 */
router.get('/bookings', superAdminController.getAllBookings.bind(superAdminController));

export default router;
