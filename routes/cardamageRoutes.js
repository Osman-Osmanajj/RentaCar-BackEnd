import express from 'express';
import { carDamageReportController } from '../controllers/cardamageController.js';

const router = express.Router();

router.post('/create', carDamageReportController.createDamageReport.bind(carDamageReportController));
router.get('/all', carDamageReportController.getDamageReports.bind(carDamageReportController));
router.get('/:id', carDamageReportController.getDamageReportById.bind(carDamageReportController));
router.patch('/:id', carDamageReportController.updateDamageReport.bind(carDamageReportController));
router.delete('/:id', carDamageReportController.deleteDamageReport.bind(carDamageReportController));

export default router;