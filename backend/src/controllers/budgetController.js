import { BudgetPlan } from '../models/index.js';

export const createBudgetPlan = async (req, res) => {
  try {
    const { category, plannedAmount, month, year, notes } = req.body;

    if (!category || !plannedAmount || !month || !year) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const plan = await BudgetPlan.create({
      category,
      plannedAmount,
      month,
      year,
      notes,
      createdBy: req.user.userId
    });

    res.status(201).json(plan);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create budget plan' });
  }
};

export const getBudgetPlans = async (req, res) => {
  try {
    const { year, month } = req.query;

    if (!year || !month) {
      return res.status(400).json({ error: 'Year and month required' });
    }

    const plans = await BudgetPlan.findByYearMonth(year, month);
    res.json(plans);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch budget plans' });
  }
};

export const getBudgetPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const plan = await BudgetPlan.findById(id);
    
    if (!plan) {
      return res.status(404).json({ error: 'Budget plan not found' });
    }

    res.json(plan);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch budget plan' });
  }
};

export const updateBudgetPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, plannedAmount, actualAmount, notes, signature1Id, signature2Id } = req.body;

    const updates = {};
    if (category) updates.category = category;
    if (plannedAmount !== undefined) updates.plannedAmount = plannedAmount;
    if (actualAmount !== undefined) updates.actualAmount = actualAmount;
    if (notes) updates.notes = notes;
    if (signature1Id) updates.signature1Id = signature1Id;
    if (signature2Id) updates.signature2Id = signature2Id;

    const plan = await BudgetPlan.update(id, updates);
    res.json(plan);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update budget plan' });
  }
};

export const deleteBudgetPlan = async (req, res) => {
  try {
    const { id } = req.params;
    await BudgetPlan.delete(id);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete budget plan' });
  }
};

export default {
  createBudgetPlan,
  getBudgetPlans,
  getBudgetPlan,
  updateBudgetPlan,
  deleteBudgetPlan
};
