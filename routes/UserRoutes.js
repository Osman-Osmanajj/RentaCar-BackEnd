import express from 'express';
import { userController } from '../controllers/userController.js';
import { authenticateJWT } from '../middlewares/authenticateJWT.js';

const router = express.Router();

/**
 * @swagger
 * /user/users:
 *   post:
 *     summary: Krijon një përdorues të ri
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 example: Customer
 *               tenant_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: User u krijua me sukses
 *       409:
 *         description: User me atë email ekziston
 */
router.post('/users', userController.createUser.bind(userController));

/**
 * @swagger
 * /user/users/{id}:
 *   delete:
 *     summary: Fshin një përdorues
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID e përdoruesit
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User u fshi me sukses
 *       404:
 *         description: User nuk u gjet
 */
router.delete('/users/:id', authenticateJWT, userController.deleteUser.bind(userController));

/**
 * @swagger
 * /user/users:
 *   get:
 *     summary: Kthen të gjithë përdoruesit
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista e përdoruesve
 */
router.get('/users', authenticateJWT, userController.getUsers.bind(userController));

/**
 * @swagger
 * /user/users/{id}:
 *   patch:
 *     summary: Përditëson të dhënat e një përdoruesi
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID e përdoruesit
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *               tenant_id:
 *                 type: integer
 *               oldpassword:
 *                 type: string
 *                 description: Fjalëkalimi aktual për verifikim
 *               newPassword:
 *                 type: string
 *                 description: Fjalëkalimi i ri
 *     responses:
 *       200:
 *         description: Përdoruesi u përditësua me sukses
 *       404:
 *         description: Përdoruesi nuk u gjet
 */
router.patch('/users/:id', authenticateJWT, userController.updateUser.bind(userController));

/**
 * @swagger
 * /user/users/{id}:
 *   get:
 *     summary: Merr të dhënat për një përdorues sipas ID-së
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Informacioni për përdoruesin
 *       404:
 *         description: Përdoruesi nuk u gjet
 */
router.get('/users/:id', authenticateJWT, userController.getUsersById.bind(userController));

export default router;
