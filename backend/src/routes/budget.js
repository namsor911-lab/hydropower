import express from 'express';
import * as budgetController from '../controllers/budgetController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// All budget routes require authentication
router.use(authenticate);

router.post('/', authorize(['admin', 'accountant']), budgetController.createBudgetPlan);
router.get('/', budgetController.getBudgetPlans);
router.get('/:id', budgetController.getBudgetPlan);
router.put('/:id', authorize(['admin', 'accountant']), budgetController.updateBudgetPlan);
router.delete('/:id', authorize(['admin']), budgetController.deleteBudgetPlan);

export default router;
