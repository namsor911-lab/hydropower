# 📝 Integration Guide - Connecting Your Original HTML to the New API

## Quick Reference: Convert localStorage to API

### Before & After Examples

#### Example 1: Loading Transactions

**BEFORE (localStorage):**
```javascript
function loadTransactions() {
  const data = JSON.parse(localStorage.getItem('acc_v2') || '{}');
  const transactions = data.transactions || [];
  renderTransactionTable(transactions);
}
```

**AFTER (API):**
```javascript
async function loadTransactions() {
  try {
    const today = new Date();
    const startDate = `${today.getFullYear()}-01-01`;
    const endDate = today.toISOString().split('T')[0];
    
    const transactions = await apiTransactions.getAll({
      startDate,
      endDate
    });
    renderTransactionTable(transactions);
  } catch (err) {
    showError('Failed to load transactions');
  }
}

// Call on page load
window.addEventListener('load', loadTransactions);
```

#### Example 2: Saving Transaction

**BEFORE (localStorage):**
```javascript
function saveTransaction(type, amount, description) {
  let data = JSON.parse(localStorage.getItem('acc_v2') || '{}');
  data.transactions = data.transactions || [];
  data.transactions.push({
    id: Date.now(),
    type,
    amount,
    description,
    date: new Date(),
    balance: calculateBalance(data.transactions)
  });
  localStorage.setItem('acc_v2', JSON.stringify(data));
  showSuccess('Saved!');
}
```

**AFTER (API):**
```javascript
async function saveTransaction(type, amount, description) {
  try {
    const result = await apiTransactions.create({
      type,
      amount,
      description,
      date: new Date().toISOString().split('T')[0]
    });
    showSuccess('Saved!');
    loadTransactions(); // Refresh list
  } catch (err) {
    showError('Failed to save transaction');
  }
}
```

#### Example 3: File Upload

**BEFORE (localStorage - Base64):**
```javascript
fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = (evt) => {
    localStorage.setItem('receipt_' + Date.now(), evt.target.result);
    showSuccess('Image saved');
  };
  reader.readAsDataURL(file);
});
```

**AFTER (API - Upload):**
```javascript
fileInput.addEventListener('change', async (e) => {
  try {
    const file = e.target.files[0];
    const result = await apiUpload(file);
    
    // Store the fileId with your transaction
    currentTransactionFileId = result.fileId;
    showSuccess('Image uploaded');
  } catch (err) {
    showError('Upload failed');
  }
});
```

#### Example 4: Employee Data

**BEFORE (localStorage):**
```javascript
function loadEmployees() {
  const data = JSON.parse(localStorage.getItem('nhr_v2') || '{}');
  const employees = data.employees || [];
  
  employees.forEach(emp => {
    emp.tax = calculateTax(emp.salary);
    emp.net = emp.salary - emp.tax;
  });
  
  renderEmployeeTable(employees);
}
```

**AFTER (API - Tax calculated server-side):**
```javascript
async function loadEmployees() {
  try {
    const employees = await apiEmployees.getAll();
    // Tax already calculated in response
    renderEmployeeTable(employees);
  } catch (err) {
    showError('Failed to load employees');
  }
}
```

---

## Step-by-Step Integration for index.html

### Step 1: Add Integration Script
At the top of your `<head>` section:

```html
<head>
  <!-- Existing meta tags -->
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- Add these -->
  <script type="module">
    import { Transactions, Budget, Purchase, Auth, uploadFile, uploadBase64 } from './js/api.js';
    window.api = { Transactions, Budget, Purchase, Auth, uploadFile, uploadBase64 };
  </script>
  
  <!-- ... rest of head ... -->
</head>
```

### Step 2: Add Auth Check at Page Start
In your main JavaScript (near the beginning):

```javascript
// Check user is logged in
window.addEventListener('load', async function() {
  const token = localStorage.getItem('authToken');
  if (!token) {
    window.location.href = '/login.html';
    return;
  }
  
  try {
    const user = await window.api.Auth.getCurrentUser();
    // Update UI with user info
    if (document.getElementById('userName')) {
      document.getElementById('userName').textContent = user.fullName;
    }
    
    // Load initial data
    await updateDashboard();
  } catch (err) {
    localStorage.removeItem('authToken');
    window.location.href = '/login.html';
  }
});
```

### Step 3: Replace Dashboard Data Loading
Find your `updateDash()` or equivalent function:

```javascript
// REPLACE THIS:
async function updateDash() {
  try {
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    
    // Get monthly summary
    const summary = await window.api.Transactions.getSummary(month, year);
    document.getElementById('dashInc').textContent = formatCurrency(summary.totalIncome || 0);
    document.getElementById('dashExp').textContent = formatCurrency(summary.totalExpense || 0);
    
    // Get 12-month chart
    const chartData = await window.api.Transactions.getMonthlyChart(year);
    renderBarChart(chartData);
    
    // Load recent transactions
    const transactions = await window.api.Transactions.getAll();
    renderRecentTransactions(transactions);
    
  } catch (err) {
    console.error('Dashboard error:', err);
  }
}
```

### Step 4: Replace CRUD Operations
For each form (transaction, purchase, budget):

```javascript
// Example: Saving new transaction
async function handleSaveTransaction() {
  const formData = {
    type: document.getElementById('transType').value,
    amount: parseFloat(document.getElementById('transAmount').value),
    description: document.getElementById('transDesc').value,
    date: document.getElementById('transDate').value,
    category: document.getElementById('transCategory').value,
    reference: document.getElementById('transRef').value
  };
  
  try {
    // If there's a file, upload it first
    if (selectedFile) {
      const uploadResult = await window.api.uploadFile(selectedFile);
      formData.receiptId = uploadResult.fileId;
    }
    
    // Create transaction
    const result = await window.api.Transactions.create(formData);
    
    showSuccess('Transaction saved!');
    closeModal();
    updateDash(); // Refresh dashboard
  } catch (err) {
    showError('Failed to save: ' + err.message);
  }
}
```

### Step 5: Replace Delete/Edit
```javascript
// Delete transaction
async function deleteTransaction(transactionId) {
  if (!confirm('Sure?')) return;
  
  try {
    await window.api.Transactions.delete(transactionId);
    showSuccess('Deleted');
    updateDash();
  } catch (err) {
    showError('Delete failed');
  }
}

// Edit transaction
async function editTransaction(transactionId) {
  try {
    const transaction = await window.api.Transactions.get(transactionId);
    
    // Populate form with data
    document.getElementById('transType').value = transaction.type;
    document.getElementById('transAmount').value = transaction.amount;
    // ... etc
    
    showModal();
    
    // On save
    const updated = await window.api.Transactions.update(transactionId, formData);
    showSuccess('Updated');
    updateDash();
  } catch (err) {
    showError('Update failed');
  }
}
```

---

## Step-by-Step Integration for hr.html

### Employee Management
```javascript
// Load employees
async function loadEmployees() {
  try {
    const employees = await window.api.Employees.getAll();
    
    employees.forEach(emp => {
      // emp already has taxAmount and netSalary calculated
      renderEmployeeRow(emp);
    });
  } catch (err) {
    showError('Failed to load employees');
  }
}

// Save new employee
async function saveEmployee(formData) {
  try {
    const result = await window.api.Employees.create({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      position: formData.position,
      department: formData.department,
      salary: parseFloat(formData.salary),
      hireDate: formData.hireDate
    });
    
    showSuccess('Employee added');
    closeModal();
    loadEmployees();
  } catch (err) {
    showError('Failed to add employee');
  }
}

// Update employee
async function updateEmployee(empId, formData) {
  try {
    const result = await window.api.Employees.update(empId, formData);
    showSuccess('Employee updated');
    loadEmployees();
  } catch (err) {
    showError('Failed to update');
  }
}
```

### Payroll/Salary Handling
```javascript
// Get monthly payroll
async function getMonthlyPayroll(year, month) {
  try {
    // For payroll, we need to aggregate employee data with transactions
    const employees = await window.api.Employees.getAll();
    
    // Build payroll summary
    const payroll = employees.map(emp => ({
      ...emp,
      // Tax is already calculated in emp.taxAmount
      // Net is already calculated in emp.netSalary
      status: 'draft'
    }));
    
    return payroll;
  } catch (err) {
    console.error('Payroll error:', err);
    return [];
  }
}

// Process payroll (generate records)
async function processPayroll(year, month) {
  try {
    const employees = await window.api.Employees.getAll();
    
    // Create payroll records for each employee
    for (const emp of employees) {
      const taxAmount = calculateTax(emp.salary);
      const netSalary = emp.salary - taxAmount;
      
      // Store payroll record (if you add this endpoint)
      // await window.api.Payroll.create({
      //   employeeId: emp.id,
      //   month,
      //   year,
      //   baseSalary: emp.salary,
      //   taxAmount,
      //   netSalary
      // });
    }
    
    showSuccess('Payroll processed');
  } catch (err) {
    showError('Payroll processing failed');
  }
}
```

### Signature Handling
```javascript
// Save signature to transaction/payroll
async function saveSignature(canvasElement, signatureType) {
  try {
    const dataUrl = canvasElement.toDataURL('image/png');
    
    const result = await window.api.uploadBase64(
      dataUrl,
      `signature-${Date.now()}.png`,
      signatureType
    );
    
    return result.fileId;
  } catch (err) {
    showError('Failed to save signature');
    return null;
  }
}
```

---

## Testing Your Integration

### 1. Verify Authentication
```bash
# Browser console
localStorage.getItem('authToken')
# Should show a long JWT token
```

### 2. Test API Call
```javascript
// In browser console
await window.api.Transactions.getAll()
// Should return array of transactions
```

### 3. Check Backend Logs
```
# Backend terminal should show:
POST /api/transactions 200
GET /api/transactions 200
# etc.
```

---

## Common Issues & Fixes

### "Failed to fetch" or 401 error
→ Backend not running or token expired  
→ Solution: Restart backend, clear localStorage, re-login

### "CORS error"
→ CORS_ORIGIN not set correctly  
→ Solution: Edit `backend/.env`: `CORS_ORIGIN=http://localhost:3000`

### "API not defined"
→ forgot to import API module  
→ Solution: Add the `<script type="module">` with imports

### Data not saving
→ Missing user ID or authentication  
→ Solution: Check browser console for errors, verify token

---

## Files to Modify

1. **frontend/index.html**
   - Add API imports to `<head>`
   - Replace all `localStorage.getItem/setItem` calls
   - Replace form handlers with API calls
   - Add auth check on page load

2. **frontend/hr.html**
   - Same as above for HR-specific code
   - Replace employee data loading
   - Update salary calculations to use API response

3. **frontend/login.html**
   - Already ready! No changes needed

---

## Next Steps

1. ✅ Copy this guide to your team
2. ✅ Open frontend/index.html in editor
3. ✅ Follow examples above
4. ✅ Replace localStorage calls one function at a time
5. ✅ Test after each change
6. ✅ Deploy to production

Good luck! 🚀
