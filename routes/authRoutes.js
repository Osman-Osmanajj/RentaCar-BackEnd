// routes/authRoutes.js
import express from 'express';
import { authController } from '../controllers/authController.js';

const router = express.Router();

router.post('/login',   authController.login.bind(authController));
router.post('/logout',  authController.logout.bind(authController));
router.post('/refresh', authController.refresh.bind(authController));

export default router;
