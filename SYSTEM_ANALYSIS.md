# Hydropower Accounting System - Comprehensive Analysis

**Project:** Namsor Hydropower Accounting & HR Management System  
**Version:** 3.0  
**Language:** Lao  
**Technology:** Vanilla HTML5 + CSS3 + JavaScript (No frameworks)  
**Storage:** localStorage + IndexedDB  

---

## 1. SYSTEM OVERVIEW

This is a **fully offline-capable accounting and HR management system** for Namsor Hydropower facility in Vientiane, Bolikhamxai Province, Laos. The system has two main applications:

- **index.html** - Accounting, Budget Planning, Purchase Order, Dashboard & Reporting
- **hr.html** - HR Payroll Management with Tax Calculation

### Key Characteristics:
- ✅ **No backend/API** - Fully client-side
- ✅ **No authentication** - Local browser storage only
- ✅ **Lao language** - Full Lao UI
- ✅ **Dark theme** - GitHub-inspired color scheme
- ✅ **Progressive data persistence** - localStorage + IndexedDB hybrid
- ✅ **Digital signatures** - Canvas-based signature capture
- ✅ **Receipt images** - Base64 embedded in IndexedDB
- ✅ **Export functionality** - CSV export for all modules
- ✅ **Responsive design** - Works on mobile/tablet

---

## 2. DATA STRUCTURE & ENTITIES

### 2.1 localStorage Keys & Schemas

#### **Accounting Module (acc_v2)**
```javascript
// Key: 'acc_v2'
// Type: Array of Transaction objects

Transaction {
  id: string,                  // Unique ID (timestamp)
  date: string,                // ISO date: "2025-06-15"
  desc: string,                // Description/category
  income: number,              // Amount received (₭)
  expense: number,             // Amount spent (₭)
  balance: number,             // Calculated running balance
  note: string,                // Optional notes
  receiptId: string            // Reference to IndexedDB image (t_<timestamp>)
}
```

**Example:**
```json
[
  {
    "id": "1717305600000",
    "date": "2025-06-15",
    "desc": "ລາຍຮັບຈາກການຜະລິດໄຟຟ້າ",
    "income": 50000000,
    "expense": 0,
    "balance": 50000000,
    "note": "ຮັບຕາມใບໂອນເງິນ",
    "receiptId": "t_1717305600000"
  },
  {
    "id": "1717392000000",
    "date": "2025-06-16",
    "desc": "ຈ່າຍຄ່າເຊື້ອໄຟ",
    "income": 0,
    "expense": 12000000,
    "balance": 38000000,
    "note": "ກຸ່ມເຊື້ອໄຟ",
    "receiptId": "t_1717392000000"
  }
]
```

#### **Purchase Items (namSorPurchaseItems)**
```javascript
// Key: 'namSorPurchaseItems'
// Type: Array of Purchase objects

Purchase {
  date: string,                // ISO date
  name: string,                // Item name/description
  qty: number,                 // Quantity
  price: number,               // Unit price (₭)
  unit: string,                // Unit (ອັນ, ຊຸດ, ກະປ໋ອ, etc.)
  note: string,                // Optional notes
  receiptId: string            // Reference to IndexedDB image (p_<timestamp>)
}
```

**Example:**
```json
[
  {
    "date": "2025-06-15",
    "name": "ສະຫລິກໄຟຟ້າ 500V",
    "qty": 10,
    "price": 25000,
    "unit": "ອັນ",
    "note": "ຄຸນນະພາບດີ",
    "receiptId": "p_1717305600000"
  }
]
```

#### **Budget Planning (namSorBudget_v1)**
```javascript
// Key: 'namSorBudget_v1'
// Type: Object with keys like "2025_06" (YYYY_MM)

BudgetItems[year_month] = [
  {
    name: string,              // Item name
    cat: string,               // Category (ອຸປະກອນ, ວັດສະດຸ, ເຄື່ອງຈັກ, ອາຫານ, ນ້ຳມັນ, ອື່ນໆ)
    plan: number,              // Budgeted amount (₭)
    used: number,              // Actual spending (₭)
    status: string,            // ວາງແຜນ, ກຳລັງດຳເນີນ, ສຳເລັດ, ຍົກເລີກ
    note: string,              // Optional notes
    receiptId: string          // Reference to IndexedDB image (b_<timestamp>)
  }
]
```

#### **HR Payroll (nhr_v2 & nhr_sigs_v1)**
```javascript
// Key: 'nhr_v2'
// Structure: Object with keys like "2025_06" (YYYY_MM)

PayrollData[year_month] = [
  {
    name: string,              // Full name
    role: string,              // Position/role
    basic: number,             // Base salary (₭)
    ot: number,                // Overtime allowance (₭)
    living: number,            // Living allowance (₭)
    other: number,             // Other allowances (₭)
    deduct: number             // Deduction under memo 35 (₭)
    // Calculated fields (not stored):
    // gross = basic + ot + living + other
    // before = Math.max(0, gross - deduct)
    // exempt = Min(before, 1,300,000)
    // taxable_5% = Max(0, Min(before, 5M) - 1.3M)
    // taxable_10% = Max(0, Min(before, 15M) - 5M)
    // tax_total = (taxable_5% * 0.05) + (taxable_10% * 0.10) + ...
    // net = gross - tax_total
  }
]

// Key: 'nhr_sigs_v1'
// Signature storage by employee and month
SignatureData[year_month_empIdx] = dataUrl  // Canvas.toDataURL() base64
```

#### **Accounting Signatures (sigData_v2)**
```javascript
// Key: 'sigData_v2'
// Type: Object with role-based keys

SignatureData[year_month_role] = {
  dataUrl: string,             // Canvas signature as base64
  name: string,                // Signer name
  approved: boolean,           // Flag if approved
  ts: string                   // Timestamp
}

// Roles: 'ຜູ້ອຳນວຍການ', 'ຫົວໜ້າເຂື່ອນ', 'ບັນຊີ-ການເງິນ', 'ຜູ້ສະຫຼຸບ'
```

#### **Budget Signatures (sigData_v2 with budget_ prefix)**
```javascript
// Same sigData_v2 but with keys like:
// 'budget_2025_06_ຜູ້ຮັບຜິດຊອບ'
// 'budget_2025_06_ຜູ້ອຳນວຍການ'
// 'budget_2025_06_ຫົວໜ້າເຂື່ອນ'
// 'budget_2025_06_ຜູ້ອະນຸມັດ'
```

---

## 3. INDEXEDDB DATABASE (Image Storage)

### Database: `NamSorReceipts`
- **Version:** 1
- **Object Store:** `receipts`
- **Key Path:** `id`

```javascript
Receipt {
  id: string,                  // t_<timestamp> | p_<timestamp> | b_<timestamp>
  dataUrl: string              // Base64 image data URL (PNG/JPG)
}
```

**Operations:**
- `saveReceipt(id, dataUrl)` - Store image
- `getReceipt(id)` - Retrieve image
- `deleteReceipt(id)` - Remove image

---

## 4. MAIN MODULES & FEATURES

### 4.1 Dashboard (`page-dashboard`)
**Purpose:** Overview of monthly financial performance

**Components:**
- 💰 Monthly income total & transaction count
- 💸 Monthly expense total & transaction count
- 📊 Monthly net (income - expense)
- 🏦 Total balance (all transactions)
- 📊 Bar chart: 12-month income/expense comparison
- 🕐 Recent transactions (last 8)
- 📈 Income/Expense percentage breakdown
- 📋 Statistics: Total transactions, months recorded, average net/month

**Data Flow:**
```
calculateBalance() → recalc() → renderBarChart()
                   → updateDash()
```

### 4.2 Accounting (`page-accounting`)
**Purpose:** Detailed transaction ledger by month

**Features:**
- Month & year selector
- Search functionality (by description or note)
- Transaction table with:
  - Date, Description, Income, Expense, Running Balance, Notes, Receipt
  - Edit/Delete buttons
- Monthly totals (income, expense, net)
- Opening balance (start of month)
- Ending balance (computed)
- All-time total balance
- Multi-role signature section (4 roles)
- CSV export

**Tax Calculation (Lao Progressive Tax):**
```javascript
Income Brackets:
- 0 - 1,300,000 ₭ = 0% (exempt)
- 1,300,001 - 5,000,000 ₭ = 5%
- 5,000,001 - 15,000,000 ₭ = 10%
- 15,000,001 - 25,000,000 ₭ = 15%
- 25,000,001 - 65,000,000 ₭ = 20%
- 65,000,001+ ₭ = 25%
```

### 4.3 Budget Planning (`page-budget`)
**Purpose:** Plan & track monthly purchase budget

**Features:**
- Month/Year selector
- Add budget items with:
  - Name, Category (dropdown), Planned amount, Actual spent, Status, Notes, Receipt image
- Summary cards: Planned, Used, Remaining
- Budget items table with:
  - Progress bar showing % spent
  - Status indicator
  - Receipt thumbnail (clickable to zoom)
- 4-role signature section (separate from accounting)
- Budget detail modal with breakdown

**Status Options:**
- 📝 ວາງແຜນ (Planned)
- 🔄 ກຳລັງດຳເນີນ (In Progress)
- ✅ ສຳເລັດ (Completed)
- ❌ ຍົກເລີກ (Cancelled)

### 4.4 Purchase Orders (`page-purchase`)
**Purpose:** Track all purchases of equipment & materials

**Features:**
- Inline form to add purchase items:
  - Date, Item name, Quantity, Price, Unit, Notes, Receipt image
- Table display: Date, Item, Qty, Price, Total, Unit, Notes, Receipt, Delete
- Grand total calculation
- Receipt thumbnails with zoom viewer
- CSV export (not yet visible in code, but structure supports it)

### 4.5 HR Payroll (`hr.html`)
**Purpose:** Manage employee salaries & calculate taxes

**Features:**
- Month/Year selector
- Add/Edit employee with:
  - Name, Position/Role
  - Basic salary, OT allowance, Living allowance, Other allowances, Memo 35 deductions
  - Real-time tax preview
- Payroll table with columns:
  - Employee name/role
  - Salary components (4 income columns)
  - Total gross, Deductions, Taxable amounts (5% and 10%), Total tax, Net salary
  - Signature cells (canvas-based)
  - Edit/Delete buttons
- Summary: Employee count, Total gross, Total deductions, Total tax, Total net
- Editable inline cells (numbers update in real-time)
- Per-employee signature canvas
- Print/PDF export
- CSV export

**Tax Calculation:**
```javascript
Gross Salary = Basic + OT + Living + Other
Deductible Amount = Memo 35 (non-taxable)
Taxable Income = Max(0, Gross - Deductible)
Exempt Amount = Min(Taxable, 1,300,000)
Taxable @ 5% = Max(0, Min(Taxable, 5M) - 1,300,000)
Taxable @ 10% = Max(0, Min(Taxable, 15M) - 5,000,000)
Total Tax = (Taxable_5% × 0.05) + (Taxable_10% × 0.10) + ...
Net Salary = Gross - Total Tax
```

### 4.6 Quarterly Report (`page-quarterly`)
**Purpose:** Summarize performance by quarters

**Features:**
- 4 quarterly summary cards (Q1, Q2, Q3, Q4)
- Detail table: Quarter, Month, Income, Expense, Net
- Year selector
- All data computed from transactions in db

### 4.7 Annual Report (`page-annual`)
**Purpose:** Year-end comprehensive report

**Features:**
- Year selector
- Summary stats: Total income, Total expense, Total net for year
- 12-month table with:
  - Monthly income/expense/net
  - Cumulative running balance
  - Mini bar charts per row
- CSV export by year

### 4.8 Settings (`page-settings`)
**Purpose:** System info & configuration

**Features:**
- Data size display (KB)
- System version: v3.0
- Organization: Namsor Hydropower
- Features list

---

## 5. FORMS & INPUT FIELDS

### 5.1 Transaction Form (Accounting)
```
- Date (date input)
- Description (text input)
- Type (select: income/expense)
- Amount (number input, > 0)
- Note (text input)
- Receipt Image (file upload → IndexedDB)
```

### 5.2 Purchase Item Form
```
- Date (date input)
- Item Name (text input)
- Quantity (number input, >= 1)
- Price (number input, >= 0)
- Unit (text input: ອັນ, ຊຸດ, etc.)
- Note (text input)
- Receipt Image (file upload → IndexedDB)
```

### 5.3 Budget Item Form
```
- Item Name (text input)
- Category (select: 6 options)
- Planned Amount (number input, >= 0)
- Actual Used (number input, >= 0)
- Status (select: 4 options)
- Note (text input)
- Receipt Image (file upload → IndexedDB)
```

### 5.4 Employee Form (HR)
```
- Name (text input, required)
- Role/Position (text input)
- Basic Salary (number input, >= 0)
- OT Allowance (number input, >= 0)
- Living Allowance (number input, >= 0)
- Other Allowances (number input, >= 0)
- Memo 35 Deduction (number input, >= 0)
```

---

## 6. JAVASCRIPT FUNCTIONS & ARCHITECTURE

### 6.1 Core Data Management Functions

| Function | Purpose |
|----------|---------|
| `save()` | Persist accounting data to localStorage |
| `saveBudget()` | Persist budget data to localStorage |
| `saveSigs()` | Persist signatures to localStorage |
| `saveReceipt(id, dataUrl)` | Store image in IndexedDB |
| `getReceipt(id)` | Retrieve image from IndexedDB |
| `deleteReceipt(id)` | Remove image from IndexedDB |
| `recalc()` | Sort transactions, calculate running balance |
| `openingBal(year, month)` | Get balance at start of month |
| `totalBal()` | Get all-time total balance |

### 6.2 Accounting Functions

| Function | Purpose |
|----------|---------|
| `openAdd()` | Open add transaction modal |
| `editTrans(id)` | Open edit transaction modal |
| `saveTrans()` | Save/update transaction, store receipt |
| `delTrans(id)` | Delete transaction & receipt |
| `updateAcc()` | Render accounting table for month |
| `exportCSV()` | Export month to CSV |
| `exportAnnualCSV()` | Export year to CSV |

### 6.3 Budget Functions

| Function | Purpose |
|----------|---------|
| `getBudgetKey()` | Get current budget key (YYYY_MM) |
| `getBudgetItems()` | Get items for current month |
| `renderBudget()` | Render budget table with progress bars |
| `openBudgetItemModal()` | Open add/edit budget item |
| `saveBudgetItem()` | Save budget item, store receipt |
| `deleteBudgetItem(idx)` | Delete budget item |
| `viewBudgetDetail(idx)` | Show detail modal for item |

### 6.4 Purchase Functions

| Function | Purpose |
|----------|---------|
| `calcInlineTotal()` | Calculate qty × price |
| `addPurchaseRow()` | Add purchase item, store receipt |
| `deletePurchaseItem(idx)` | Delete purchase item |
| `renderPurchaseTable()` | Display all purchase items |

### 6.5 HR Payroll Functions (hr.html)

| Function | Purpose |
|----------|---------|
| `calcTax(before)` | Calculate Lao progressive tax |
| `calcRow(r)` | Calculate all tax fields for employee |
| `render()` | Render payroll table |
| `openAdd()` | Open add employee modal |
| `openEdit(idx)` | Open edit employee modal |
| `saveEmp()` | Save employee data |
| `delRow(idx)` | Delete employee |
| `updCell(i, f, v)` | Inline update text field |
| `updNum(i, f, inp)` | Inline update number field (with real-time calc) |
| `doExportCSV()` | Export payroll to CSV |

### 6.6 Signature Functions

| Function | Purpose |
|----------|---------|
| `openSigModal(role)` | Open signature canvas modal |
| `closeSigModal()` | Close modal |
| `initDrawCanvas()` | Setup canvas for drawing |
| `approveSig()` | Save signature to sigData |
| `clearSig(role)` | Delete signature |
| `renderSigSection()` | Render signature boxes |
| `paintSig(role, dataUrl)` | Draw stored signature on canvas |
| `updateSigName(role, name)` | Update signer name |

### 6.7 Dashboard Functions

| Function | Purpose |
|----------|---------|
| `updateDash()` | Update all dashboard cards |
| `renderBarChart(year)` | Render 12-month bar chart |

### 6.8 Report Functions

| Function | Purpose |
|----------|---------|
| `updateQ()` | Render quarterly summary |
| `updateA()` | Render annual summary |

### 6.9 Utility Functions

| Function | Purpose |
|----------|---------|
| `fmt(n)` | Format number with ₭ symbol |
| `fmtAbs(n)` | Format absolute value |
| `esc(s)` | HTML escape string |
| `go(id)` | Navigate to page |
| `toggleSidebar()` | Collapse/expand sidebar |
| `showToast(msg)` | Show notification toast |
| `previewReceipt(...)` | Preview uploaded image |
| `clearReceipt(...)` | Clear preview |
| `viewReceiptImg(src)` | Open image fullscreen |

---

## 7. FILE UPLOAD & IMAGE STORAGE

### Upload Flow:
1. User selects image via file input
2. `FileReader.readAsDataURL()` converts to base64
3. Display as preview in modal
4. On save, send to IndexedDB via `saveReceipt(id, dataUrl)`
5. Store reference ID in transaction/purchase/budget item

### Receipt ID Naming:
- `t_<timestamp>` = Transaction receipt
- `p_<timestamp>` = Purchase receipt
- `b_<timestamp>` = Budget receipt

### Image Size Consideration:
- Base64 dataURLs can be large (50KB-500KB per image)
- IndexedDB has no explicit size limit but browser quota applies
- SessionStorage shows "ຂະໜາດ: X.XX KB" for all accounting data

---

## 8. AUTHENTICATION & USER ROLES

**Current System:** No authentication
- All data stored in browser localStorage & IndexedDB
- No login/password
- No user identification beyond signature names
- Signature names are stored but not linked to users

**Signature Roles (Accounting):**
- ຜູ້ອຳນວຍການ (Manager)
- ຫົວໜ້າເຂື່ອນ (Plant Manager)
- ບັນຊີ-ການເງິນ (Accountant)
- ຜູ້ສະຫຼຸບ (Auditor)

**Signature Roles (Budget):**
- ຜູ້ຮັບຜິດຊອບ (Responsible)
- ຜູ້ອຳນວຍການ (Manager)
- ຫົວໜ້າເຂື່ອນ (Plant Manager)
- ຜູ້ອະນຸມັດ (Approver)

---

## 9. BROWSER STORAGE CONSUMPTION

### localStorage Usage:
- `acc_v2`: Array of ~100-500 transactions → ~10-50 KB
- `namSorPurchaseItems`: Array of items → ~5-20 KB
- `namSorBudget_v1`: Objects by month → ~5-20 KB
- `sigData_v2`: Signatures by month/role → ~50-200 KB (depends on signature size)
- `nhr_v2`: Payroll data by month → ~10-30 KB
- `nhr_sigs_v1`: HR signatures by month/employee → ~20-100 KB

**Total Typical:** 100-450 KB (well within browser localStorage limit of 5-10MB)

### IndexedDB Usage:
- Images stored as base64 in `NamSorReceipts` database
- Each receipt image: ~20-200 KB
- Browser storage quota: ~10-50% of available disk

---

## 10. DATA PERSISTENCE & RECOVERY

### Persistent Data:
✅ Survives browser refresh
✅ Survives tab close
✅ Survives browser restart (localStorage)

### Data Loss Scenarios:
- Clear browser cache/localStorage
- Incognito mode session ends
- Browser data reset
- IndexedDB quota exceeded

### No Built-in Backup:
- Manual CSV export recommended
- JSON export feature present in settings (code shows function)
- Import function available for recovery

---

## 11. RESPONSIVE DESIGN & UI/UX

### Breakpoints:
- Mobile: < 768px - Single column, collapsed sidebar
- Tablet: 768px-1024px - Flexible layout
- Desktop: > 1024px - Full layout

### Color Scheme (CSS Variables):
```css
--bg: #0d1117 (main background)
--bg2: #161b22 (secondary)
--bg3: #1c2128 (tertiary)
--border: #30363d
--txt: #e6edf3 (main text)
--txt2: #8b949e (secondary text)
--green: #3fb950 (income/success)
--red: #f85149 (expense/error)
--blue: #58a6ff (balance/info)
--yellow: #d29922 (warning)
```

### UI Components:
- Sidebar navigation
- Top header with date
- Modal dialogs (dark themed)
- Tables (Excel-style with hover effects)
- Cards (stats, summary)
- Buttons (4 types: green, blue, outline, red)
- Toast notifications
- Progress bars
- Bar charts
- Signature canvases

---

## 12. KEY ARCHITECTURAL PATTERNS

### Pattern 1: Module-per-page
Each page (dashboard, accounting, budget, etc.) has:
- Dedicated HTML container
- Update function (updateDash, updateAcc, etc.)
- Render function
- Navigation trigger via `go(pageId)`

### Pattern 2: Hybrid Storage
- **Fast access:** localStorage for structured data
- **Bulk storage:** IndexedDB for binary (images)
- **Functions:** Promise-based async for IndexedDB

### Pattern 3: Real-time Calculations
- Forms with `oninput` handlers recalc on every keystroke
- Tax calculations computed on demand (not cached)
- Balance recalculated on every transaction change

### Pattern 4: Canvas Signatures
- Drawing on HTML5 Canvas
- Convert to DataURL (base64) on approval
- Store in localStorage
- Replay on load by drawing image onto canvas

### Pattern 5: Modal-based Editing
- All add/edit operations via modal overlay
- Modal removed from DOM on close
- Data validation before save
- Toast notification on success

---

## 13. CURRENT LIMITATIONS & GAPS

### No Backend:
- No multi-user sync
- No real-time collaboration
- No cloud backup
- No API integrations

### No Authentication:
- Anyone with browser access sees all data
- No user-specific data isolation
- Signatures are just names + images

### Limited Validation:
- No duplicate transaction prevention
- No audit trail/history
- No undo functionality
- No concurrent edit prevention

### Storage Limits:
- Browser quota ~10-50 MB total
- No automatic cleanup of old data
- No data archival mechanism

### Missing Features:
- No recurring transactions
- No bulk import (except JSON)
- No email notifications
- No printing with proper formatting
- No dashboard customization

---

## 14. SUMMARY

| Aspect | Details |
|--------|---------|
| **Architecture** | Client-side MPA (Multi-Page App) |
| **Data Storage** | localStorage (structured) + IndexedDB (images) |
| **Modules** | 8 main modules (Dashboard, Accounting, Budget, Purchase, HR, Quarterly, Annual, Settings) |
| **Main Entities** | Transactions, Budget Items, Purchase Orders, Employees, Signatures |
| **Key Logic** | Tax calculation, balance tracking, real-time preview |
| **File Handling** | Base64 images in IndexedDB with dataURL references |
| **User Roles** | 4 accounting + 4 budget signature roles (name-based, no auth) |
| **Export** | CSV, JSON (in code), Print-ready HTML |
| **Offline Capable** | ✅ Yes, fully offline |
| **Code Size** | ~15KB JS (Accounting), ~8KB JS (HR) |

---

## 15. NEXT STEPS FOR ENHANCEMENT

1. **Add Backend API** - For multi-user sync & backup
2. **Implement Authentication** - User accounts & roles
3. **Add Database** - PostgreSQL for persistent storage
4. **Version Control** - Track changes & provide undo
5. **Mobile App** - React Native or Flutter wrapper
6. **Real-time Sync** - WebSocket for collaboration
7. **Advanced Reporting** - Charts, dashboards, KPIs
8. **Audit Trail** - Log all changes for compliance
