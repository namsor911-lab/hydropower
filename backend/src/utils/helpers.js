import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export const generateId = () => uuidv4();

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = (password, hash) => {
  return bcrypt.compare(password, hash);
};

export const generateToken = (userId, email, role) => {
  return jwt.sign(
    { userId, email, role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
};

export const calculateLaoTax = (income) => {
  // Lao progressive tax brackets
  if (income <= 3_000_000) return 0;
  if (income <= 9_000_000) return (income - 3_000_000) * 0.05;
  if (income <= 15_000_000) return 300_000 + (income - 9_000_000) * 0.10;
  return 900_000 + (income - 15_000_000) * 0.15;
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('lo-LA', {
    style: 'currency',
    currency: 'LAK',
    minimumFractionDigits: 0
  }).format(amount);
};

export default {
  generateId,
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
  calculateLaoTax,
  formatCurrency
};
