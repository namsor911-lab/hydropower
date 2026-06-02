import express from 'express';
import * as authController from '../controllers/authController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', authController.login);
router.post('/register', authController.register);

// Protected routes
router.get('/me', authenticate, authController.me);
router.get('/users', authenticate, authorize(['admin']), authController.getAllUsers);
router.put('/users/:id', authenticate, authorize(['admin']), authController.updateUser);

export default router;
