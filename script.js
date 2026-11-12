// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const totalIncomeEl = document.getElementById('totalIncome');
const totalExpensesEl = document.getElementById('totalExpenses');
const currentBalanceEl = document.getElementById('currentBalance');

const summaryMonthInput = document.getElementById('summaryMonth');
const monthlyIncomeEl = document.getElementById('monthlyIncome');
const monthlyExpensesEl = document.getElementById('monthlyExpenses');
const monthlyChartEl = document.getElementById('monthlyChart');

const transactionForm = document.getElementById('transactionForm');
const formHeading = document.getElementById('formHeading');
const editTransactionId = document.getElementById('editTransactionId');
const titleInput = document.getElementById('title');
const amountInput = document.getElementById('amount');
const typeInput = document.getElementById('type');
const categoryInput = document.getElementById('category');
const dateInput = document.getElementById('date');
const submitButton = document.getElementById('submitButton');
const cancelEditBtn = document.getElementById('cancelEdit');
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');

const filterButtons = document.querySelectorAll('.filter-btn');
const searchInput = document.getElementById('searchInput');
const transactionList = document.getElementById('transactionList');
const emptyState = document.getElementById('emptyState');

const deleteDialog = document.getElementById('deleteDialog');
const cancelDeleteBtn = document.getElementById('cancelDelete');
const confirmDeleteBtn = document.getElementById('confirmDelete');

// App State
let transactions = JSON.parse(localStorage.getItem('expenseflow_transactions')) || [];
let currentFilter = 'all';
let transactionToDeleteId = null;

// Set Default Dates (Today & Current Month)
const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, '0');
const dd = String(today.getDate()).padStart(2, '0');

dateInput.value = `${yyyy}-${mm}-${dd}`;
summaryMonthInput.value = `${yyyy}-${mm}`;

// Theme Toggle (Light / Dark)
const savedTheme = localStorage.getItem('expenseflow_theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', nextTheme);
  localStorage.setItem('expenseflow_theme', nextTheme);
});

// Save Data to LocalStorage
function saveTransactions() {
  localStorage.setItem('expenseflow_transactions', JSON.stringify(transactions));
}

// Show Feedback Messages
function showFeedback(type, text) {
  successMessage.classList.remove('show');
  errorMessage.classList.remove('show');

  const target = type === 'success' ? successMessage : errorMessage;
  target.textContent = text;
  target.classList.add('show');

  setTimeout(() => {
    target.classList.remove('show');
  }, 3200);
}

// Format BDT Currency
function formatBDT(amount) {
  return `৳${amount.toLocaleString('en-BD', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}

// 1. Update Dashboard Totals
function updateDashboard() {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const currentBalance = totalIncome - totalExpenses;

  totalIncomeEl.textContent = formatBDT(totalIncome);
  totalExpensesEl.textContent = formatBDT(totalExpenses);
  currentBalanceEl.textContent = formatBDT(currentBalance);
}

// Bonus: Update Monthly Summary & Visual Bar Chart
function updateMonthlySummary() {
  const selectedMonth = summaryMonthInput.value; // Format: YYYY-MM
  const monthlyItems = transactions.filter(t => t.date.startsWith(selectedMonth));

  const mIncome = monthlyItems
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const mExpenses = monthlyItems
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  monthlyIncomeEl.textContent = formatBDT(mIncome);
  monthlyExpensesEl.textContent = formatBDT(mExpenses);

  if (mIncome === 0 && mExpenses === 0) {
    monthlyChartEl.innerHTML = `<div class="chart-empty">No monthly data available for this month.</div>`;
    return;
  }

  const maxVal = Math.max(mIncome, mExpenses, 1);
  const incomePercent = Math.round((mIncome / maxVal) * 100);
  const expensePercent = Math.round((mExpenses / maxVal) * 100);

  monthlyChartEl.innerHTML = `
    <div class="bar-group">
      <div class="bar-label">
        <span>Income</span>
        <span>${formatBDT(mIncome)}</span>
      </div>
      <div class="bar-track">
        <div class="bar-fill income" style="width: ${incomePercent}%"></div>
      </div>
    </div>
    <div class="bar-group">
      <div class="bar-label">
        <span>Expenses</span>
        <span>${formatBDT(mExpenses)}</span>
      </div>
      <div class="bar-track">
        <div class="bar-fill expense" style="width: ${expensePercent}%"></div>
      </div>
    </div>
  `;
}

// 3. Render Transaction History (with Filter & Search)
function renderTransactions() {
  const query = searchInput.value.toLowerCase().trim();

  const filtered = transactions.filter(t => {
    const matchesFilter = currentFilter === 'all' || t.type === currentFilter;
    const matchesSearch = t.title.toLowerCase().includes(query);
    return matchesFilter && matchesSearch;
  });

  transactionList.innerHTML = '';

  if (filtered.length === 0) {
    emptyState.classList.remove('hidden');
    return;
  }

  emptyState.classList.add('hidden');

  filtered.forEach(t => {
    const row = document.createElement('tr');
    const amountClass = t.type === 'income' ? 'amount-income' : 'amount-expense';
    const prefix = t.type === 'income' ? '+' : '-';

    row.innerHTML = `
      <td><strong>${t.title}</strong></td>
      <td>${t.category}</td>
      <td>${t.date}</td>
      <td><span class="badge ${t.type}">${t.type}</span></td>
      <td class="${amountClass}">${prefix}${formatBDT(t.amount)}</td>
      <td>
        <button type="button" class="action-btn edit-btn" onclick="editTransaction(${t.id})">Edit</button>
        <button type="button" class="action-btn delete-btn" onclick="openDeleteDialog(${t.id})">Delete</button>
      </td>
    `;
    transactionList.appendChild(row);
  });
}

// Refresh Full Application
function refreshUI() {
  updateDashboard();
  updateMonthlySummary();
  renderTransactions();
}

// 2. Add & Bonus: Edit Transaction Form Submission
transactionForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const title = titleInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const type = typeInput.value;
  const category = categoryInput.value;
  const date = dateInput.value;
  const editId = editTransactionId.value;

  // Input Validation
  if (!title) {
    showFeedback('error', 'Please enter a valid transaction title.');
    return;
  }
  if (isNaN(amount) || amount <= 0) {
    showFeedback('error', 'Please enter a valid amount greater than 0.');
    return;
  }
  if (!type) {
    showFeedback('error', 'Please select a transaction type (Income or Expense).');
    return;
  }
  if (!category) {
    showFeedback('error', 'Please select a category.');
    return;
  }
  if (!date) {
    showFeedback('error', 'Please select a transaction date.');
    return;
  }

  if (editId) {
    transactions = transactions.map(t =>
      t.id === Number(editId) ? { id: t.id, title, amount, type, category, date } : t
    );
    showFeedback('success', 'Transaction updated successfully!');
    resetFormState();
  } else {
    const newTransaction = {
      id: Date.now(),
      title,
      amount,
      type,
      category,
      date
    };
    transactions.unshift(newTransaction);
    showFeedback('success', 'Transaction added successfully!');
    transactionForm.reset();
    dateInput.value = `${yyyy}-${mm}-${dd}`;
  }

  saveTransactions();
  refreshUI();
});

// Bonus: Edit Transaction
window.editTransaction = function (id) {
  const item = transactions.find(t => t.id === id);
  if (!item) return;

  editTransactionId.value = item.id;
  titleInput.value = item.title;
  amountInput.value = item.amount;
  typeInput.value = item.type;
  categoryInput.value = item.category;
  dateInput.value = item.date;

  formHeading.textContent = 'Edit Transaction';
  submitButton.textContent = 'Update Transaction';
  cancelEditBtn.hidden = false;

  document.getElementById('add-transaction').scrollIntoView({ behavior: 'smooth' });
};

function resetFormState() {
  editTransactionId.value = '';
  formHeading.textContent = 'Add New Transaction';
  submitButton.textContent = '+ Add Transaction';
  cancelEditBtn.hidden = true;
  transactionForm.reset();
  dateInput.value = `${yyyy}-${mm}-${dd}`;
}

cancelEditBtn.addEventListener('click', resetFormState);

// 4. Delete Transaction & Bonus: Custom Dialog Confirmation
window.openDeleteDialog = function (id) {
  transactionToDeleteId = id;
  if (typeof deleteDialog.showModal === 'function') {
    deleteDialog.showModal();
  } else {
    // Fallback for older browsers
    if (confirm('Are you sure you want to delete this transaction?')) {
      confirmDeletion();
    }
  }
};

function confirmDeletion() {
  if (transactionToDeleteId === null) return;
  transactions = transactions.filter(t => t.id !== transactionToDeleteId);
  transactionToDeleteId = null;
  saveTransactions();
  refreshUI();
  showFeedback('success', 'Transaction deleted successfully.');
}

cancelDeleteBtn.addEventListener('click', () => {
  transactionToDeleteId = null;
  deleteDialog.close();
});

confirmDeleteBtn.addEventListener('click', () => {
  confirmDeletion();
  deleteDialog.close();
});

// 5. Filter Buttons
filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderTransactions();
  });
});

// Bonus: Search Input & Month Selector
searchInput.addEventListener('input', renderTransactions);
summaryMonthInput.addEventListener('change', updateMonthlySummary);

// Initial Render
refreshUI();
