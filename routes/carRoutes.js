import express from 'express';
import { carController } from '../controllers/carController.js';

const router = express.Router();

router.post('/create',  carController.createCar.bind(carController));
router.get('/all',      carController.getCars.bind(carController)); 
router.get('/img-type', carController.getCarsTypesImages.bind(carController));
router.get('/:id',      carController.getCarById.bind(carController)); 
router.patch('/:id',    carController.updateCarById.bind(carController));
router.delete('/:id',   carController.deleteCar.bind(carController));

export default router;

