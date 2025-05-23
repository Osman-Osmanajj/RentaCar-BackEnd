import express from 'express';
import { tenantController } from '../controllers/tenantController.js';

const router = express.Router();

/**
 * @swagger
 * /tenants/tenants:
 *   post:
 *     summary: Krijon një tenant të ri (kompani/location)
 *     tags: [Tenant]
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
 *       409:
 *         description: Tenant me këtë email ekziston
 */
router.post('/tenants', tenantController.createTenant.bind(tenantController));

/**
 * @swagger
 * /tenants/tenants:
 *   get:
 *     summary: Kthen të gjithë tenant-at
 *     tags: [Tenant]
 *     responses:
 *       200:
 *         description: Lista e tenantëve
 */
router.get('/tenants', tenantController.getTenants.bind(tenantController));

/**
 * @swagger
 * /tenants/tenants/{id}:
 *   patch:
 *     summary: Përditëson të dhënat për një tenant
 *     tags: [Tenant]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID e tenant-it
 *         required: true
 *         schema:
 *           type: integer
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
 *       404:
 *         description: Tenant nuk u gjet
 */
router.patch('/tenants/:id', tenantController.updateTenant.bind(tenantController));

/**
 * @swagger
 * /tenants/tenants/{id}:
 *   delete:
 *     summary: Fshin një tenant
 *     tags: [Tenant]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID e tenant-it
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tenant u fshi me sukses
 *       404:
 *         description: Tenant nuk u gjet
 */
router.delete('/tenants/:id', tenantController.deleteTenant.bind(tenantController));

export default router;
