import express from 'express';
import { superAdminController } from '../controllers/superAdminController.js';
import { authenticateJWT } from '../middlewares/authenticateJWT.js';

const router = express.Router();
router.use(authenticateJWT);

// Tenant CRUD
router.get   ('/tenants',      superAdminController.getAllTenants.bind(superAdminController));
router.post  ('/tenants',      superAdminController.createTenant.bind(superAdminController));
router.patch ('/tenants/:id',  superAdminController.updateTenant.bind(superAdminController));
router.delete('/tenants/:id',  superAdminController.deleteTenant.bind(superAdminController));

// Global Users + Bookings
router.get('/users',    superAdminController.getAllUsers.bind(superAdminController));
router.get('/bookings', superAdminController.getAllBookings.bind(superAdminController));

export default router;