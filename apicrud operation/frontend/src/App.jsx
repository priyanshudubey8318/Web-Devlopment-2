import { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'ledgerly-practice-transactions';
const categories = ['Food', 'Travel', 'Shopping', 'Education', 'Bills', 'Salary', 'Freelance', 'Other'];
const sampleTransactions = [
  { id: 1, title: 'Monthly salary', category: 'Salary', date: '2026-10-01', amount: 65000, type: 'income' },
  { id: 2, title: 'Grocery shopping', category: 'Food', date: '2026-10-11', amount: 2450, type: 'expense' },
  { id: 3, title: 'College fees', category: 'Education', date: '2026-10-10', amount: 12000, type: 'expense' },
  { id: 4, title: 'Freelance project', category: 'Freelance', date: '2026-10-09', amount: 8500, type: 'income' },
  { id: 5, title: 'Cab and travel', category: 'Travel', date: '2026-10-08', amount: 850, type: 'expense' },
];

const today = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

const formatMoney = (amount) => new Intl.NumberFormat('en-IN', {
  style: 'currency', currency: 'INR', maximumFractionDigits: 2,
}).format(Number(amount) || 0);

function loadTransactions() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : sampleTransactions;
  } catch {
    return sampleTransactions;
  }
}

const emptyForm = () => ({ title: '', category: 'Food', date: today(), amount: '', type: 'expense' });

export default function App() {
  const [transactions, setTransactions] = useState(loadTransactions);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [message, setMessage] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  const income = useMemo(() => transactions
    .filter((item) => item.type === 'income')
    .reduce((total, item) => total + Number(item.amount), 0), [transactions]);

  const expenses = useMemo(() => transactions
    .filter((item) => item.type === 'expense')
    .reduce((total, item) => total + Number(item.amount), 0), [transactions]);

  const balance = income - expenses;

  const visibleTransactions = transactions.filter((item) => {
    const text = `${item.title} ${item.category}`.toLowerCase();
    const matchesSearch = text.includes(search.toLowerCase());
    const matchesType = filter === 'all' || item.type === filter;
    return matchesSearch && matchesType;
  }).sort((a, b) => String(b.date).localeCompare(String(a.date)));

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function submitTransaction(event) {
    event.preventDefault();
    const amount = Number(form.amount);
    if (!form.title.trim() || !Number.isFinite(amount) || amount <= 0 || !form.date) {
      setMessage('Please enter a title, date and amount greater than zero.');
      return;
    }

    const transaction = { ...form, title: form.title.trim(), amount };
    if (editingId !== null) {
      setTransactions((current) => current.map((item) => item.id === editingId ? { ...transaction, id: editingId } : item));
      setMessage('Transaction updated.');
    } else {
      setTransactions((current) => [{ ...transaction, id: Date.now() }, ...current]);
      setMessage('Transaction added.');
    }
    setForm(emptyForm());
    setEditingId(null);
  }

  function editTransaction(item) {
    setEditingId(item.id);
    setForm({ title: item.title, category: item.category, date: item.date, amount: String(item.amount), type: item.type });
    document.getElementById('transaction-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function deleteTransaction(id) {
    if (!window.confirm('Delete this transaction?')) return;
    setTransactions((current) => current.filter((item) => item.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setForm(emptyForm());
    }
    setMessage('Transaction deleted.');
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm());
    setMessage('');
  }

  function resetSampleData() {
    if (!window.confirm('Replace your current list with the sample transactions?')) return;
    setTransactions(sampleTransactions);
    setEditingId(null);
    setForm(emptyForm());
    setMessage('Sample transactions restored.');
  }

  return (
    <main className="page">
      

      <section className="intro" id="top">
        <p className="small-heading">PERSONAL FINANCE TRACKER</p>
        <h1>Money overview</h1>
        <p>Keep a simple record of the money you earn and spend.</p>
      </section>

      <section className="summary-grid" id="overview" aria-label="Financial summary">
        <article className="summary-card">
          <p>Total balance</p>
          <h2>{formatMoney(balance)}</h2>
          <span>Income minus expenses</span>
        </article>
        <article className="summary-card">
          <p>Total income</p>
          <h2 className="income-text">{formatMoney(income)}</h2>
          <span>Money received</span>
        </article>
        <article className="summary-card">
          <p>Total expenses</p>
          <h2 className="expense-text">{formatMoney(expenses)}</h2>
          <span>Money spent</span>
        </article>
      </section>

      <section className="panel form-panel" id="transaction-form">
        <div className="section-heading">
          <div>
            <h2>{editingId !== null ? 'Edit transaction' : 'Add a transaction'}</h2>
            <p>Enter the details and save them to your list.</p>
          </div>
        </div>
        <form onSubmit={submitTransaction}>
          <div className="form-grid">
            <label>
              Title
              <input name="title" value={form.title} onChange={updateField} placeholder="e.g. Bus ticket" maxLength="100" required />
            </label>
            <label>
              Amount (₹)
              <input name="amount" type="number" min="0.01" step="0.01" value={form.amount} onChange={updateField} placeholder="e.g. 250" required />
            </label>
            <label>
              Category
              <select name="category" value={form.category} onChange={updateField}>
                {categories.map((category) => <option key={category} value={category}>{category}</option>)}
              </select>
            </label>
            <label>
              Date
              <input name="date" type="date" value={form.date} onChange={updateField} required />
            </label>
          </div>
          <fieldset className="type-field">
            <legend>Type</legend>
            <label className="radio-label"><input type="radio" name="type" value="expense" checked={form.type === 'expense'} onChange={updateField} /> Expense</label>
            <label className="radio-label"><input type="radio" name="type" value="income" checked={form.type === 'income'} onChange={updateField} /> Income</label>
          </fieldset>
          <div className="form-actions">
            <button className="button button-primary" type="submit">{editingId !== null ? 'Save changes' : 'Add transaction'}</button>
            {editingId !== null && <button className="button button-secondary" type="button" onClick={cancelEdit}>Cancel edit</button>}
          </div>
          {message && <p className="form-message" role="status">{message}</p>}
        </form>
      </section>

      <section className="panel list-panel" id="transactions">
        <div className="section-heading list-heading">
          <div>
            <h2>Transactions</h2>
            <p>Search, review, edit or remove a record.</p>
          </div>
          <button className="button button-secondary" type="button" onClick={resetSampleData}>Reset sample data</button>
        </div>

        <div className="filters">
          <label className="search-label">
            Search
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search title or category" />
          </label>
          <label>
            Show
            <select value={filter} onChange={(event) => setFilter(event.target.value)}>
              <option value="all">All transactions</option>
              <option value="income">Income only</option>
              <option value="expense">Expenses only</option>
            </select>
          </label>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Title</th><th>Category</th><th>Date</th><th>Type</th><th className="amount-column">Amount</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {visibleTransactions.map((item) => (
                <tr key={item.id}>
                  <td className="title-cell">{item.title}</td>
                  <td>{item.category}</td>
                  <td>{new Date(`${item.date}T12:00:00`).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                  <td><span className={`type-badge ${item.type}`}>{item.type === 'income' ? 'Income' : 'Expense'}</span></td>
                  <td className={`amount-column ${item.type === 'income' ? 'income-text' : 'expense-text'}`}>{item.type === 'income' ? '+' : '−'}{formatMoney(item.amount)}</td>
                  <td><div className="row-actions"><button className="link-button" type="button" onClick={() => editTransaction(item)}>Edit</button><button className="link-button delete-link" type="button" onClick={() => deleteTransaction(item.id)}>Delete</button></div></td>
                </tr>
              ))}
              {visibleTransactions.length === 0 && <tr><td className="empty-state" colSpan="6">No transactions found. Try a different search or add a transaction.</td></tr>}
            </tbody>
          </table>
        </div>
        <p className="table-note">Showing {visibleTransactions.length} of {transactions.length} transactions.</p>
      </section>

      <footer className="site-footer">Ledgerly · A simple finance tracker practice project</footer>
    </main>
  );
}
