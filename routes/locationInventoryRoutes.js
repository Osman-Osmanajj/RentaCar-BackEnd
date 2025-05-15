import express from 'express';
import { locationInventoryController } from '../controllers/LocationInventoryController.js';

const router = express.Router();

router.post('/create', locationInventoryController.createInventory.bind(locationInventoryController));
router.get('/all', locationInventoryController.getInventories.bind(locationInventoryController));

export default router;
