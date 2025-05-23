import express from 'express';
import { authController } from '../controllers/authController.js';

const router = express.Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Autentikimi i përdoruesit (login)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login i suksesshëm, kthen userin dhe access token
 *       401:
 *         description: Kredencialet janë të pasakta
 */
router.post('/login', authController.login.bind(authController));

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout (dalja nga sistemi)
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout u krye me sukses
 */
router.post('/logout', authController.logout.bind(authController));

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Gjeneron një access token të ri nga refresh token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Access token i ri u gjenerua me sukses
 *       401:
 *         description: Refresh token mungon ose është i pavlefshëm
 */
router.post('/refresh', authController.refresh.bind(authController));

export default router;
