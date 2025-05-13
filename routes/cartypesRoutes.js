import {carTypeController} from '../controllers/CartypesController.js';

import express from 'express';
const router = express.Router();

router.post('/create/:id', carTypeController.createCarType.bind(carTypeController));

export default router;