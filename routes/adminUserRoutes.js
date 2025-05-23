import { userAdminController } from '../controllers/adminController.js';
import express from "express";

const router = express.Router();

/**
 * @swagger
 * /useradmin/user-admin:
 *   post:
 *     summary: Promovon një përdorues si admin për një tenant të caktuar
 *     tags: [UserAdmin]
 *     security:
 *       - TenantHeader: []
 *     parameters:
 *       - in: header
 *         name: X-Tenant-ID
 *         schema:
 *           type: string
 *         required: true
 *         description: ID e tenant-it (obligative për multi-tenant API)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - tenantid
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 11
 *                 description: ID e përdoruesit që do promovohet në admin
 *               tenantid:
 *                 type: integer
 *                 example: 5
 *                 description: ID e tenant-it për të cilin bëhet admin
 *     responses:
 *       201:
 *         description: User u promovua me sukses si admin
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 userAdmin:
 *                   type: object
 *       200:
 *         description: User është tashmë admin për këtë tenant
 *       404:
 *         description: Tenant ose përdoruesi nuk u gjet
 */
router.post('/user-admin', userAdminController.createUserAdmin.bind(userAdminController));

export default router;
