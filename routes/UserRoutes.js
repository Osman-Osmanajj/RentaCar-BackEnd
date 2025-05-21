import express from 'express';
import { userController } from '../controllers/userController.js';
import { authenticateJWT }      from '../middlewares/authenticateJWT.js';


const router = express.Router();

router.post('/users', userController.createUser.bind(userController));
router.delete('/users/:id', authenticateJWT, userController.deleteUser.bind(userController));
router.get('/users', authenticateJWT, userController.getUsers.bind(userController));
router.patch('/users/:id', authenticateJWT, userController.updateUser.bind(userController));
router.get('/users/:id', authenticateJWT, userController.getUsersById.bind(userController));

export default router;
