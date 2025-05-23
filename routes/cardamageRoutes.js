import express from 'express';
import { carDamageReportController } from '../controllers/cardamageController.js';

const router = express.Router();

/**
 * @swagger
 * /cardamage/create:
 *   post:
 *     summary: Krijon një raport të dëmtimit të veturës
 *     tags: [CarDamageReport]
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
 *               - damage_type
 *               - description
 *               - cost
 *               - status
 *             properties:
 *               car_id:
 *                 type: integer
 *                 example: 11
 *               damage_type:
 *                 type: string
 *                 example: "Front bumper"
 *               description:
 *                 type: string
 *                 example: "Cracked front bumper from minor collision"
 *               cost:
 *                 type: number
 *                 example: 150.50
 *               status:
 *                 type: string
 *                 example: "Reported"
 *     responses:
 *       201:
 *         description: Raporti u krijua me sukses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 report:
 *                   type: object
 */
router.post('/create', carDamageReportController.createDamageReport.bind(carDamageReportController));

/**
 * @swagger
 * /cardamage/all:
 *   get:
 *     summary: Kthen të gjitha raportet e dëmtimit të veturave
 *     tags: [CarDamageReport]
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
 *         description: Lista e raporteve të dëmtimit
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       404:
 *         description: Nuk u gjet asnjë raport dëmtimi
 */
router.get('/all', carDamageReportController.getDamageReports.bind(carDamageReportController));

/**
 * @swagger
 * /cardamage/{id}:
 *   get:
 *     summary: Kthen një raport dëmtimi sipas ID-së
 *     tags: [CarDamageReport]
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
 *         description: ID e raportit të dëmtimit që kërkohet
 *     responses:
 *       200:
 *         description: Raporti u kthye me sukses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Raporti nuk u gjet
 */
router.get('/:id', carDamageReportController.getDamageReportById.bind(carDamageReportController));

/**
 * @swagger
 * /cardamage/{id}:
 *   patch:
 *     summary: Përditëson një raport dëmtimi sipas ID-së
 *     tags: [CarDamageReport]
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
 *         description: ID e raportit për përditësim
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               damage_type:
 *                 type: string
 *               description:
 *                 type: string
 *               cost:
 *                 type: number
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Raporti u përditësua me sukses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 report:
 *                   type: object
 *       404:
 *         description: Raporti nuk u gjet
 */
router.patch('/:id', carDamageReportController.updateDamageReport.bind(carDamageReportController));

/**
 * @swagger
 * /cardamage/{id}:
 *   delete:
 *     summary: Fshin një raport dëmtimi sipas ID-së
 *     tags: [CarDamageReport]
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
 *         description: ID e raportit që do të fshihet
 *     responses:
 *       200:
 *         description: Raporti u fshi me sukses
 *       404:
 *         description: Raporti nuk u gjet
 */
router.delete('/:id', carDamageReportController.deleteDamageReport.bind(carDamageReportController));

export default router;
