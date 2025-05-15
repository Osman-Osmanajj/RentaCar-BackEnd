import express from 'express';
import { maintenanceController } from '../controllers/maintenancerecordController.js';

const router = express.Router();

router.post('/create', maintenanceController.createRecord.bind(maintenanceController));
router.get('/all', maintenanceController.getAllRecords.bind(maintenanceController));
router.get('/:recordId', maintenanceController.getRecordById.bind(maintenanceController));
router.delete('/:recordId', maintenanceController.deleteRecord.bind(maintenanceController));

export default router;
