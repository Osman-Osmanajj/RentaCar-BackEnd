import express from 'express';
import { tenantController } from '../controllers/tenantController.js';

const router = express.Router();    

router.post('/tenants', tenantController.createTenant.bind(tenantController));

export default router;