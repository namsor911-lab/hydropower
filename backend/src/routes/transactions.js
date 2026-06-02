import express from 'express';
import * as transactionController from '../controllers/transactionController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { uploadReceipt } from '../middleware/upload.js';

const router = express.Router();

// All transaction routes require authentication
router.use(authenticate);

router.post('/', transactionController.createTransaction);
router.get('/', transactionController.getTransactions);
router.get('/summary', transactionController.getTransactionSummary);
router.get('/chart/monthly', transactionController.getMonthlyChart);
router.get('/:id', transactionController.getTransaction);
router.put('/:id', authorize(['admin', 'accountant']), transactionController.updateTransaction);
router.delete('/:id', authorize(['admin', 'accountant']), transactionController.deleteTransaction);

export default router;
