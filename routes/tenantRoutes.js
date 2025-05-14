import express from 'express';
import { tenantController } from '../controllers/tenantController.js';

const router = express.Router();    

router.post('/tenants', tenantController.createTenant.bind(tenantController));
router.get('/tenants', tenantController.getTenants.bind(tenantController));
router.delete('/tenants/:id', tenantController.deleteTenants.bind(tenantController));
router.get('/tenants/:id', tenantController.getTenantsbyId.bind(tenantController));
export default router;  