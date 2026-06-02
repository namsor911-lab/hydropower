import express from 'express';
import * as employeeController from '../controllers/employeeController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// All employee routes require authentication
router.use(authenticate);

router.post('/', authorize(['admin', 'accountant']), employeeController.createEmployee);
router.get('/', employeeController.getEmployees);
router.get('/:id', employeeController.getEmployee);
router.put('/:id', authorize(['admin', 'accountant']), employeeController.updateEmployee);
router.delete('/:id', authorize(['admin']), employeeController.deleteEmployee);

export default router;
