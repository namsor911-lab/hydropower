import { Transaction, BudgetPlan } from '../models/index.js';
import { calculateLaoTax } from '../utils/helpers.js';

export const createTransaction = async (req, res) => {
  try {
    const { type, amount, date, description, category, reference, receiptId } = req.body;

    if (!type || !amount || !date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const transaction = await Transaction.create({
      type,
      amount,
      date,
      description,
      category,
      reference,
      receiptId,
      createdBy: req.user.userId
    });

    // Update budget actual amount if category is set
    if (category) {
      const currentDate = new Date(date);
      const budgets = await BudgetPlan.findByYearMonth(currentDate.getFullYear(), currentDate.getMonth() + 1);
      const budget = budgets.find(b => b.category === category);
      
      if (budget) {
        const transactions = await Transaction.findAll({ 
          category,
          startDate: `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-01`
        });
        const totalAmount = transactions.reduce((sum, t) => sum + (t.type === 'expense' ? t.amount : 0), 0);
        
        await BudgetPlan.update(budget.id, { actualAmount: totalAmount });
      }
    }

    res.status(201).json(transaction);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const { type, startDate, endDate } = req.query;
    
    const filters = {};
    if (type) filters.type = type;
    if (startDate && endDate) {
      filters.startDate = startDate;
      filters.endDate = endDate;
    }

    const transactions = await Transaction.findAll(filters);
    res.json(transactions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};

export const getTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findById(id);
    
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json(transaction);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch transaction' });
  }
};

export const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, amount, date, description, category, reference, receiptId, signature1Id, signature2Id } = req.body;

    const updates = {};
    if (type) updates.type = type;
    if (amount !== undefined) updates.amount = amount;
    if (date) updates.date = date;
    if (description) updates.description = description;
    if (category) updates.category = category;
    if (reference) updates.reference = reference;
    if (receiptId) updates.receiptId = receiptId;
    if (signature1Id) updates.signature1Id = signature1Id;
    if (signature2Id) updates.signature2Id = signature2Id;

    const transaction = await Transaction.update(id, updates);
    res.json(transaction);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update transaction' });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    await Transaction.delete(id);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
};

export const getTransactionSummary = async (req, res) => {
  try {
    const { month, year } = req.query;
    
    if (!month || !year) {
      return res.status(400).json({ error: 'Month and year required' });
    }

    const summary = await Transaction.getSummary(month, year);
    res.json(summary || { totalIncome: 0, totalExpense: 0, totalTransactions: 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch summary' });
  }
};

export const getMonthlyChart = async (req, res) => {
  try {
    const { year } = req.query;
    
    if (!year) {
      return res.status(400).json({ error: 'Year required' });
    }

    const data = [];
    for (let month = 1; month <= 12; month++) {
      const summary = await Transaction.getSummary(month, year);
      data.push({
        month,
        income: summary?.totalIncome || 0,
        expense: summary?.totalExpense || 0
      });
    }

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch chart data' });
  }
};

export default {
  createTransaction,
  getTransactions,
  getTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionSummary,
  getMonthlyChart
};
