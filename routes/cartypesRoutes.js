import {carTypeController} from '../controllers/CartypesController.js';

import express from 'express';
const router = express.Router();

router.post('/create/:id', carTypeController.createCarType.bind(carTypeController));
router.delete('/tenants/:id/car-types/:carTypeId', carTypeController.deleteCarTypeById.bind(carTypeController));
router.get('/tenants/:id/car-types', carTypeController.getCarTypes.bind(carTypeController));
router.get('/tenants/:id/car-types/:carTypeId', carTypeController.getCarTypeById.bind(carTypeController));
router.put('/tenants/:id/cartypes/:carTypeId', carTypeController.updateCarTypeById.bind(carTypeController));


export default router;