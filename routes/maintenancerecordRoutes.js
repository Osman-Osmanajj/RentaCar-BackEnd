import express from 'express';
import { maintenanceController } from '../controllers/maintenancerecordController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Maintenance
 *     description: Endpoints për menaxhimin e maintenance records
 */

/**
 * @swagger
 * /maintenance/create:
 *   post:
 *     summary: Krijon një maintenance record të ri
 *     tags: [Maintenance]
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
 *               - service_type
 *               - service_date
 *               - cost
 *             properties:
 *               car_id:
 *                 type: integer
 *                 example: 7
 *               service_type:
 *                 type: string
 *                 example: "Oil Change"
 *               service_date:
 *                 type: string
 *                 format: date
 *                 example: "2025-05-24"
 *               description:
 *                 type: string
 *                 example: "Changed oil and filter"
 *               cost:
 *                 type: number
 *                 example: 50.00
 *     responses:
 *       201:
 *         description: Maintenance record u krijua me sukses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 record:
 *                   type: object
 */
router.post('/create', maintenanceController.createRecord.bind(maintenanceController));

/**
 * @swagger
 * /maintenance/all:
 *   get:
 *     summary: Kthen të gjitha maintenance records e tenant-it
 *     tags: [Maintenance]
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
 *         description: Lista e maintenance records
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 records:
 *                   type: array
 *                   items:
 *                     type: object
 */
router.get('/all', maintenanceController.getAllRecords.bind(maintenanceController));

/**
 * @swagger
 * /maintenance/{recordId}:
 *   get:
 *     summary: Kthen një maintenance record sipas ID-së
 *     tags: [Maintenance]
 *     security:
 *       - TenantHeader: []
 *     parameters:
 *       - in: header
 *         name: X-Tenant-ID
 *         schema:
 *           type: string
 *         required: true
 *         description: ID e tenant-it
 *       - name: recordId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID e maintenance record që kërkohet
 *     responses:
 *       200:
 *         description: Maintenance record u kthye me sukses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 record:
 *                   type: object
 *       404:
 *         description: Maintenance record nuk u gjet
 */
router.get('/:recordId', maintenanceController.getRecordById.bind(maintenanceController));

/**
 * @swagger
 * /maintenance/invoice/{recordId}:
 *   get:
 *     summary: Kthen një maintenance record të formatuar si invoice
 *     tags: [Maintenance]
 *     security:
 *       - TenantHeader: []
 *     parameters:
 *       - in: header
 *         name: X-Tenant-ID
 *         schema:
 *           type: string
 *         required: true
 *         description: ID e tenant-it
 *       - name: recordId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID e maintenance record që do të formatohet si invoice
 *     responses:
 *       200:
 *         description: Invoice u kthye me sukses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 invoice:
 *                   type: object
 *       404:
 *         description: Maintenance record nuk u gjet
 */
router.get('/invoice/:recordId', maintenanceController.getRecordInvoice.bind(maintenanceController));

/**
 * @swagger
 * /maintenance/{recordId}:
 *   delete:
 *     summary: Fshin një maintenance record sipas ID-së
 *     tags: [Maintenance]
 *     security:
 *       - TenantHeader: []
 *     parameters:
 *       - in: header
 *         name: X-Tenant-ID
 *         schema:
 *           type: string
 *         required: true
 *         description: ID e tenant-it
 *       - name: recordId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID e maintenance record që do të fshihet
 *     responses:
 *       200:
 *         description: Maintenance record u fshi me sukses
 *       404:
 *         description: Maintenance record nuk u gjet
 */
router.delete('/:recordId', maintenanceController.deleteRecord.bind(maintenanceController));

export default router;
