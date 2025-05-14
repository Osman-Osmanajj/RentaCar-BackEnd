import express from 'express';
import { carImageController } from '../controllers/carImageController.js';

const router = express.Router();

router.post('/:id/car-images', carImageController.createCarImage.bind(carImageController));
router.get('/:id/car-images', carImageController.getCarImages.bind(carImageController));
router.delete('/:id/car-images/:imageId', carImageController.deleteCarImage.bind(carImageController));

export default router;
