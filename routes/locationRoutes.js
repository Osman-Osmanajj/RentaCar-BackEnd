import { locationController } from '../controllers/locationController.js';
import express from 'express';

const router = express.Router();


router.post('/:id/locations', locationController.createLocation.bind(locationController));
router.get('/:id/locations', locationController.getLocations.bind(locationController));
router.get('/tenants/:id/locations/:locationId', locationController.getLocationById.bind(locationController));
router.put('/tenants/:id/locations/:locationId', locationController.updateLocationById.bind(locationController));
router.delete('/:id/locations/:locationId', locationController.deleteLocation.bind(locationController));

export default router;
