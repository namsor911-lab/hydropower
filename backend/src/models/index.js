import { getAsync, allAsync, runAsync } from '../database/db.js';
import { generateId, hashPassword } from '../utils/helpers.js';

export class User {
  static async create(userData) {
    const id = generateId();
    const hashedPassword = await hashPassword(userData.password);
    
    const sql = `
      INSERT INTO users (id, email, password, fullName, role, department)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    await runAsync(sql, [
      id,
      userData.email,
      hashedPassword,
      userData.fullName,
      userData.role || 'viewer',
      userData.department
    ]);
    
    return this.findById(id);
  }

  static async findById(id) {
    const sql = 'SELECT * FROM users WHERE id = ? AND isActive = 1';
    return getAsync(sql, [id]);
  }

  static async findByEmail(email) {
    const sql = 'SELECT * FROM users WHERE email = ? AND isActive = 1';
    return getAsync(sql, [email]);
  }

  static async findAll() {
    const sql = 'SELECT id, email, fullName, role, department, lastLogin, createdAt FROM users WHERE isActive = 1 ORDER BY createdAt DESC';
    return allAsync(sql, []);
  }

  static async update(id, updates) {
    const fields = Object.keys(updates).map(k => `${k} = ?`).join(', ');
    const values = [...Object.values(updates), id];
    const sql = `UPDATE users SET ${fields}, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`;
    await runAsync(sql, values);
    return this.findById(id);
  }

  static async updateLastLogin(id) {
    const sql = 'UPDATE users SET lastLogin = CURRENT_TIMESTAMP WHERE id = ?';
    await runAsync(sql, [id]);
  }
}

export class Transaction {
  static async create(data) {
    const id = generateId();
    const sql = `
      INSERT INTO transactions (id, type, amount, date, description, category, reference, receiptId, createdBy)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    await runAsync(sql, [
      id,
      data.type,
      data.amount,
      data.date,
      data.description,
      data.category,
      data.reference,
      data.receiptId,
      data.createdBy
    ]);
    
    return this.findById(id);
  }

  static async findById(id) {
    const sql = 'SELECT * FROM transactions WHERE id = ?';
    return getAsync(sql, [id]);
  }

  static async findAll(filters = {}) {
    let sql = 'SELECT * FROM transactions WHERE 1=1';
    const params = [];

    if (filters.type) {
      sql += ' AND type = ?';
      params.push(filters.type);
    }

    if (filters.startDate && filters.endDate) {
      sql += ' AND date BETWEEN ? AND ?';
      params.push(filters.startDate, filters.endDate);
    }

    sql += ' ORDER BY date DESC';

    return allAsync(sql, params);
  }

  static async update(id, updates) {
    const fields = Object.keys(updates).map(k => `${k} = ?`).join(', ');
    const values = [...Object.values(updates), id];
    const sql = `UPDATE transactions SET ${fields}, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`;
    await runAsync(sql, values);
    return this.findById(id);
  }

  static async delete(id) {
    const sql = 'DELETE FROM transactions WHERE id = ?';
    await runAsync(sql, [id]);
  }

  static async getSummary(month, year) {
    const sql = `
      SELECT 
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as totalIncome,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as totalExpense,
        COUNT(*) as totalTransactions
      FROM transactions
      WHERE strftime('%m', date) = ? AND strftime('%Y', date) = ?
    `;
    return getAsync(sql, [String(month).padStart(2, '0'), String(year)]);
  }
}

export class PurchaseItem {
  static async create(data) {
    const id = generateId();
    const sql = `
      INSERT INTO purchase_items (id, itemName, quantity, unitPrice, unit, date, notes, receiptId, createdBy)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    await runAsync(sql, [
      id,
      data.itemName,
      data.quantity,
      data.unitPrice,
      data.unit,
      data.date,
      data.notes,
      data.receiptId,
      data.createdBy
    ]);
    
    return this.findById(id);
  }

  static async findById(id) {
    const sql = 'SELECT * FROM purchase_items WHERE id = ?';
    return getAsync(sql, [id]);
  }

  static async findAll(filters = {}) {
    let sql = 'SELECT * FROM purchase_items WHERE 1=1';
    const params = [];

    if (filters.startDate && filters.endDate) {
      sql += ' AND date BETWEEN ? AND ?';
      params.push(filters.startDate, filters.endDate);
    }

    sql += ' ORDER BY date DESC';

    return allAsync(sql, params);
  }

  static async update(id, updates) {
    const fields = Object.keys(updates).map(k => `${k} = ?`).join(', ');
    const values = [...Object.values(updates), id];
    const sql = `UPDATE purchase_items SET ${fields}, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`;
    await runAsync(sql, values);
    return this.findById(id);
  }

  static async delete(id) {
    const sql = 'DELETE FROM purchase_items WHERE id = ?';
    await runAsync(sql, [id]);
  }
}

export class BudgetPlan {
  static async create(data) {
    const id = generateId();
    const sql = `
      INSERT INTO budget_plans (id, category, plannedAmount, month, year, notes, createdBy)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    await runAsync(sql, [
      id,
      data.category,
      data.plannedAmount,
      data.month,
      data.year,
      data.notes,
      data.createdBy
    ]);
    
    return this.findById(id);
  }

  static async findById(id) {
    const sql = 'SELECT * FROM budget_plans WHERE id = ?';
    return getAsync(sql, [id]);
  }

  static async findByYearMonth(year, month) {
    const sql = 'SELECT * FROM budget_plans WHERE year = ? AND month = ? ORDER BY category';
    return allAsync(sql, [year, month]);
  }

  static async update(id, updates) {
    const fields = Object.keys(updates).map(k => `${k} = ?`).join(', ');
    const values = [...Object.values(updates), id];
    const sql = `UPDATE budget_plans SET ${fields}, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`;
    await runAsync(sql, values);
    return this.findById(id);
  }

  static async delete(id) {
    const sql = 'DELETE FROM budget_plans WHERE id = ?';
    await runAsync(sql, [id]);
  }
}

export class Employee {
  static async create(data) {
    const id = generateId();
    const sql = `
      INSERT INTO employees (id, firstName, lastName, email, phone, position, department, salary, hireDate)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    await runAsync(sql, [
      id,
      data.firstName,
      data.lastName,
      data.email,
      data.phone,
      data.position,
      data.department,
      data.salary,
      data.hireDate
    ]);
    
    return this.findById(id);
  }

  static async findById(id) {
    const sql = 'SELECT * FROM employees WHERE id = ? AND isActive = 1';
    return getAsync(sql, [id]);
  }

  static async findAll() {
    const sql = 'SELECT * FROM employees WHERE isActive = 1 ORDER BY lastName, firstName';
    return allAsync(sql, []);
  }

  static async update(id, updates) {
    const fields = Object.keys(updates).map(k => `${k} = ?`).join(', ');
    const values = [...Object.values(updates), id];
    const sql = `UPDATE employees SET ${fields}, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`;
    await runAsync(sql, values);
    return this.findById(id);
  }

  static async delete(id) {
    const sql = 'UPDATE employees SET isActive = 0, updatedAt = CURRENT_TIMESTAMP WHERE id = ?';
    await runAsync(sql, [id]);
  }
}

export default {
  User,
  Transaction,
  PurchaseItem,
  BudgetPlan,
  Employee
};
