import express from 'express';
import { carImageController } from '../controllers/carImageController.js';

const router = express.Router();

router.post('/create', carImageController.createCarImage.bind(carImageController));
router.get('/all', carImageController.getCarImages.bind(carImageController));
router.delete('/:id', carImageController.deleteCarImage.bind(carImageController));

export default router;
