import express from 'express';
import { userController } from '../controllers/userController.js';

const router = express.Router();

router.post('/users', userController.createUser.bind(userController));
router.delete('/users/:id', userController.deleteUser.bind(userController));
router.get('/users', userController.getUsers.bind(userController));
router.patch('/users/:id',        userController.updateUser.bind(userController));
router.get('/users/:id', userController.getUsersById.bind(userController));

export default router;
