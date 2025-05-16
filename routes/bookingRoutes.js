import express from 'express';
import { bookingController } from '../controllers/bookingController.js';

const router = express.Router();

router.post('/create/:userId',bookingController.createBooking.bind(bookingController));
router.get('/all', bookingController.getAllBookings.bind(bookingController));


export default router;
