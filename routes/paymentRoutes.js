import express from 'express';
import { paymentController } from '../controllers/paymentController.js';

const router = express.Router();

router.post('/:id/payments', paymentController.createPayment.bind(paymentController));
router.get('/:id/payments', paymentController.getPayments.bind(paymentController));
router.delete('/:id/payments/:paymentId', paymentController.deletePayment.bind(paymentController));

export default router;
