import { locationController } from '../controllers/locationController.js';
import express from 'express';

const router = express.Router();


router.post('/create', locationController.createLocation.bind(locationController));
router.get('/all', locationController.getLocations.bind(locationController));
router.get('/:id', locationController.getLocationById.bind(locationController));
router.patch('/:id', locationController.updateLocationById.bind(locationController));
router.delete('/:id', locationController.deleteLocation.bind(locationController));

export default router;
