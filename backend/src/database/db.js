import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '..', 'database', 'namsor.db');

let db;

export const initDatabase = async () => {
  if (!fs.existsSync(path.dirname(DB_PATH))) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  }

  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) reject(err);
      else {
        console.log('✓ Connected to SQLite database');
        createTables();
        resolve(db);
      }
    });
  });
};

const createTables = () => {
  db.serialize(() => {
    // Users table with role-based access
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        fullName TEXT NOT NULL,
        role TEXT CHECK(role IN ('admin', 'accountant', 'viewer')) DEFAULT 'viewer',
        department TEXT,
        isActive BOOLEAN DEFAULT 1,
        lastLogin DATETIME,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Transactions (Income/Expense)
    db.run(`
      CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY,
        type TEXT CHECK(type IN ('income', 'expense')) NOT NULL,
        amount REAL NOT NULL,
        date DATE NOT NULL,
        description TEXT,
        category TEXT,
        reference TEXT,
        receiptId TEXT,
        balance REAL,
        signature1Id TEXT,
        signature2Id TEXT,
        createdBy TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (createdBy) REFERENCES users(id)
      )
    `);

    // Purchase Items
    db.run(`
      CREATE TABLE IF NOT EXISTS purchase_items (
        id TEXT PRIMARY KEY,
        itemName TEXT NOT NULL,
        quantity REAL NOT NULL,
        unitPrice REAL NOT NULL,
        unit TEXT,
        date DATE NOT NULL,
        notes TEXT,
        receiptId TEXT,
        createdBy TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (createdBy) REFERENCES users(id)
      )
    `);

    // Budget Plans
    db.run(`
      CREATE TABLE IF NOT EXISTS budget_plans (
        id TEXT PRIMARY KEY,
        category TEXT NOT NULL,
        plannedAmount REAL NOT NULL,
        actualAmount REAL DEFAULT 0,
        month INTEGER NOT NULL,
        year INTEGER NOT NULL,
        notes TEXT,
        signature1Id TEXT,
        signature2Id TEXT,
        createdBy TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (createdBy) REFERENCES users(id)
      )
    `);

    // Employees (HR)
    db.run(`
      CREATE TABLE IF NOT EXISTS employees (
        id TEXT PRIMARY KEY,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        position TEXT,
        department TEXT,
        salary REAL,
        taxBracket REAL DEFAULT 0,
        bankAccount TEXT,
        isActive BOOLEAN DEFAULT 1,
        hireDate DATE,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Payroll Records
    db.run(`
      CREATE TABLE IF NOT EXISTS payroll_records (
        id TEXT PRIMARY KEY,
        employeeId TEXT NOT NULL,
        month INTEGER NOT NULL,
        year INTEGER NOT NULL,
        baseSalary REAL NOT NULL,
        allowances REAL DEFAULT 0,
        deductions REAL DEFAULT 0,
        taxableIncome REAL,
        taxAmount REAL DEFAULT 0,
        netSalary REAL,
        status TEXT CHECK(status IN ('draft', 'approved', 'paid')) DEFAULT 'draft',
        approvedBy TEXT,
        approvedAt DATETIME,
        paidAt DATETIME,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (employeeId) REFERENCES employees(id),
        FOREIGN KEY (approvedBy) REFERENCES users(id)
      )
    `);

    // Files/Receipts/Signatures
    db.run(`
      CREATE TABLE IF NOT EXISTS files (
        id TEXT PRIMARY KEY,
        fileName TEXT NOT NULL,
        filePath TEXT NOT NULL,
        mimeType TEXT,
        fileSize INTEGER,
        fileType TEXT CHECK(fileType IN ('receipt', 'signature', 'document')) NOT NULL,
        reference TEXT,
        base64Data LONGTEXT,
        uploadedBy TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (uploadedBy) REFERENCES users(id)
      )
    `);

    // Audit Log
    db.run(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id TEXT PRIMARY KEY,
        action TEXT NOT NULL,
        entity TEXT NOT NULL,
        entityId TEXT,
        oldValue TEXT,
        newValue TEXT,
        userId TEXT NOT NULL,
        ipAddress TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id)
      )
    `);

    // Create indexes for performance
    db.run('CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date)');
    db.run('CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type)');
    db.run('CREATE INDEX IF NOT EXISTS idx_purchase_date ON purchase_items(date)');
    db.run('CREATE INDEX IF NOT EXISTS idx_budget_year_month ON budget_plans(year, month)');
    db.run('CREATE INDEX IF NOT EXISTS idx_payroll_employee ON payroll_records(employeeId)');
    db.run('CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(userId)');

    console.log('✓ Database tables created');
  });
};

export const getDatabase = () => {
  if (!db) throw new Error('Database not initialized');
  return db;
};

export const runAsync = promisify((sql, params, callback) => {
  db.run(sql, params, function(err) {
    if (err) callback(err);
    else callback(null, { id: this.lastID, changes: this.changes });
  });
});

export const getAsync = promisify((sql, params, callback) => {
  db.get(sql, params, (err, row) => {
    if (err) callback(err);
    else callback(null, row);
  });
});

export const allAsync = promisify((sql, params, callback) => {
  db.all(sql, params, (err, rows) => {
    if (err) callback(err);
    else callback(null, rows);
  });
});

export default {
  initDatabase,
  getDatabase,
  runAsync,
  getAsync,
  allAsync
};
