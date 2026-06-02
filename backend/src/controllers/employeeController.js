import { Employee } from '../models/index.js';
import { calculateLaoTax } from '../utils/helpers.js';

export const createEmployee = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, position, department, salary, hireDate } = req.body;

    if (!firstName || !lastName || !salary) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const employee = await Employee.create({
      firstName,
      lastName,
      email,
      phone,
      position,
      department,
      salary,
      hireDate: hireDate || new Date().toISOString().split('T')[0]
    });

    res.status(201).json(employee);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create employee' });
  }
};

export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.findAll();
    res.json(employees);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
};

export const getEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findById(id);
    
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Calculate tax info
    const taxAmount = calculateLaoTax(employee.salary);
    const netSalary = employee.salary - taxAmount;

    res.json({
      ...employee,
      taxAmount,
      netSalary
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch employee' });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, phone, position, department, salary } = req.body;

    const updates = {};
    if (firstName) updates.firstName = firstName;
    if (lastName) updates.lastName = lastName;
    if (email) updates.email = email;
    if (phone) updates.phone = phone;
    if (position) updates.position = position;
    if (department) updates.department = department;
    if (salary !== undefined) updates.salary = salary;

    const employee = await Employee.update(id, updates);
    
    const taxAmount = calculateLaoTax(employee.salary);
    const netSalary = employee.salary - taxAmount;

    res.json({
      ...employee,
      taxAmount,
      netSalary
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update employee' });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    await Employee.delete(id);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete employee' });
  }
};

export default {
  createEmployee,
  getEmployees,
  getEmployee,
  updateEmployee,
  deleteEmployee
};
