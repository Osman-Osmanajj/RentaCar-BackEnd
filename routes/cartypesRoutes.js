import express from 'express';
import { carTypeController } from '../controllers/CartypesController.js';

const router = express.Router();
router.post('/create', carTypeController.createCarType.bind(carTypeController));

export default router;
