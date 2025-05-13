import { userAdminController } from '../controllers/adminController.js';
import express, { application } from "express";

const router = express.Router();

router.post('/user-admin', userAdminController.createUserAdmin.bind(userAdminController));

export default router;