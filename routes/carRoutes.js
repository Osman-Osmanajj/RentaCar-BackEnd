import { carController } from '../controllers/carController.js';

import express from 'express';

const router = express.Router();

router.post('/:id/cars', carController.createCar.bind(carController));
router.delete('/cars', carController.deleteCars.bind(carController));
router.get('/:id/cars', carController.getCars.bind(carController));
router.get('/tenants/:id/cars/:carId', carController.getCarById.bind(carController));
router.put('/tenants/:id/cars/:carId', carController.updateCarById.bind(carController));



export default router;