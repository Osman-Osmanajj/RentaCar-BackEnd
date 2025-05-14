import express from 'express';
import { carDamageReportController } from '../controllers/cardamageController.js';

const router = express.Router();

router.post('/:id/damage-reports', carDamageReportController.createDamageReport.bind(carDamageReportController));
router.get('/:id/damage-reports', carDamageReportController.getDamageReports.bind(carDamageReportController));
router.get('/tenants/:id/damage-reports/:reportId', carDamageReportController.getDamageReportById.bind(carDamageReportController));
router.put('/tenants/:id/damage-reports/:reportId', carDamageReportController.updateDamageReport.bind(carDamageReportController));
router.delete('/:id/damage-reports/:reportId', carDamageReportController.deleteDamageReport.bind(carDamageReportController));

export default router;