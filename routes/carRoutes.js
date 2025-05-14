import express from 'express';
import { carController } from '../controllers/carController.js';

const router = express.Router();

router.post('/create', carController.createCar.bind(carController));

router.delete('/:carId', carController.deleteCar.bind(carController));

router.get('/all', carController.getCars.bind(carController));

export default router;
