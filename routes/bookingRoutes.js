import express from 'express';
import { bookingController } from '../controllers/bookingController.js';

const router = express.Router();

router.post('/create/:userId',bookingController.createBooking.bind(bookingController));
router.get('/all', bookingController.getAllBookings.bind(bookingController));
router.get('/costumers', bookingController.getCostumersBasedOnbooking.bind(bookingController));
router.delete('/:id', bookingController.deleteBooking.bind(bookingController));
router.patch('/:id', bookingController.updateBooking.bind(bookingController));


export default router;
