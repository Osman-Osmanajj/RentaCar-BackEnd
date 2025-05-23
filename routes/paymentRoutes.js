import express from 'express';
import { paymentController } from '../controllers/paymentController.js';

const router = express.Router();

/**
 * @swagger
 * /payment/create/{booking_id}:
 *   post:
 *     summary: Krijon një pagesë të re për një booking të caktuar
 *     tags: [Payment]
 *     security:
 *       - TenantHeader: []
 *     parameters:
 *       - in: header
 *         name: X-Tenant-ID
 *         schema:
 *           type: string
 *         required: true
 *         description: ID e tenant-it për të cilën kryhet pagesa
 *       - name: booking_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID e booking-ut për të cilin bëhet pagesa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - payment_method
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 79.99
 *               payment_method:
 *                 type: string
 *                 example: "Credit Card"
 *     responses:
 *       201:
 *         description: Pagesa u krijua me sukses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 payment:
 *                   type: object
 *       400:
 *         description: Kërkesë jo valide
 */
router.post('/create/:booking_id', paymentController.createPayment.bind(paymentController));

/**
 * @swagger
 * /payment/all:
 *   get:
 *     summary: Kthen të gjitha pagesat e tenant-it
 *     tags: [Payment]
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
 *         description: Lista e pagesave
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/all', paymentController.getPayments.bind(paymentController));

/**
 * @swagger
 * /payment/{paymentId}:
 *   delete:
 *     summary: Fshin një pagesë sipas ID-së
 *     tags: [Payment]
 *     security:
 *       - TenantHeader: []
 *     parameters:
 *       - in: header
 *         name: X-Tenant-ID
 *         schema:
 *           type: string
 *         required: true
 *         description: ID e tenant-it
 *       - name: paymentId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID e pagesës që do të fshihet
 *     responses:
 *       200:
 *         description: Pagesa u fshi me sukses
 *       404:
 *         description: Pagesa nuk u gjet
 */
router.delete('/:paymentId', paymentController.deletePayment.bind(paymentController));

export default router;
