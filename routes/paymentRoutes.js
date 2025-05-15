import express from 'express';
import { paymentController } from '../controllers/paymentController.js';

const router = express.Router();

router.post('/create', paymentController.createPayment.bind(paymentController));
router.get('/all', paymentController.getPayments.bind(paymentController));
router.delete('/:paymentId', paymentController.deletePayment.bind(paymentController));

export default router;
