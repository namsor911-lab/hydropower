import express from 'express';
import * as purchaseController from '../controllers/purchaseController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// All purchase routes require authentication
router.use(authenticate);

router.post('/', purchaseController.createPurchaseItem);
router.get('/', purchaseController.getPurchaseItems);
router.get('/:id', purchaseController.getPurchaseItem);
router.put('/:id', authorize(['admin', 'accountant']), purchaseController.updatePurchaseItem);
router.delete('/:id', authorize(['admin', 'accountant']), purchaseController.deletePurchaseItem);

export default router;
