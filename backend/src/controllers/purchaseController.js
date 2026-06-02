import { PurchaseItem } from '../models/index.js';

export const createPurchaseItem = async (req, res) => {
  try {
    const { itemName, quantity, unitPrice, unit, date, notes, receiptId } = req.body;

    if (!itemName || !quantity || !unitPrice || !date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const item = await PurchaseItem.create({
      itemName,
      quantity,
      unitPrice,
      unit,
      date,
      notes,
      receiptId,
      createdBy: req.user.userId
    });

    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create purchase item' });
  }
};

export const getPurchaseItems = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const filters = {};
    if (startDate && endDate) {
      filters.startDate = startDate;
      filters.endDate = endDate;
    }

    const items = await PurchaseItem.findAll(filters);
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch purchase items' });
  }
};

export const getPurchaseItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await PurchaseItem.findById(id);
    
    if (!item) {
      return res.status(404).json({ error: 'Purchase item not found' });
    }

    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch purchase item' });
  }
};

export const updatePurchaseItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { itemName, quantity, unitPrice, unit, date, notes, receiptId } = req.body;

    const updates = {};
    if (itemName) updates.itemName = itemName;
    if (quantity !== undefined) updates.quantity = quantity;
    if (unitPrice !== undefined) updates.unitPrice = unitPrice;
    if (unit) updates.unit = unit;
    if (date) updates.date = date;
    if (notes) updates.notes = notes;
    if (receiptId) updates.receiptId = receiptId;

    const item = await PurchaseItem.update(id, updates);
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update purchase item' });
  }
};

export const deletePurchaseItem = async (req, res) => {
  try {
    const { id } = req.params;
    await PurchaseItem.delete(id);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete purchase item' });
  }
};

export default {
  createPurchaseItem,
  getPurchaseItems,
  getPurchaseItem,
  updatePurchaseItem,
  deletePurchaseItem
};
