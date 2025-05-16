import express from 'express';
import { tenantController } from '../controllers/tenantController.js';

const router = express.Router();    

router.post('/tenants', tenantController.createTenant.bind(tenantController));
router.get('/tenants', tenantController.getTenants.bind(tenantController));
router.patch('/tenants/:id', tenantController.updateTenant.bind(tenantController));
router.delete('/tenants/:id', tenantController.deleteTenant.bind(tenantController));

export default router;  