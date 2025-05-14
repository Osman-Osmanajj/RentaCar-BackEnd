import express from 'express';
import { carTypeController } from '../controllers/CartypesController.js';

const router = express.Router();
router.post('/create',  carTypeController.createCarType.bind(carTypeController));
router.get('/all',      carTypeController.getCarTypes.bind(carTypeController));
router.get('/:id',      carTypeController.getCarTypeById.bind(carTypeController));
router.patch('/:id',    carTypeController.updateCarTypeById.bind(carTypeController));
router.delete('/:id',   carTypeController.deleteCarTypeById.bind(carTypeController));

export default router;
