import express from 'express';
import { locationInventoryController } from '../controllers/LocationInventoryController.js';

const router = express.Router();

router.post('/:id/inventory', locationInventoryController.createInventory.bind(locationInventoryController));
router.get('/:id/inventory', locationInventoryController.getInventories.bind(locationInventoryController));

export default router;
