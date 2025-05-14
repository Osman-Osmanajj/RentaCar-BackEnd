import express from 'express';
import { maintenanceController } from '../controllers/maintenancerecordController.js';

const router = express.Router();

router.post('/:id/maintenance-records', maintenanceController.createRecord.bind(maintenanceController));
router.get('/:id/maintenance-records', maintenanceController.getAllRecords.bind(maintenanceController));
router.get('/:id/maintenance-records/:recordId', maintenanceController.getRecordById.bind(maintenanceController));
router.delete('/:id/maintenance-records/:recordId', maintenanceController.deleteRecord.bind(maintenanceController));

export default router;
