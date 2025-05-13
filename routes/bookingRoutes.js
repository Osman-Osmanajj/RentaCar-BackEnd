import { bookingController } from '../controllers/bookingController.js';

import express from 'express';

const router = express.Router();

router.post('/create/:id/:userid', bookingController.createBooking.bind(bookingController));

export default router;

