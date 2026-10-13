# Ledgerly — beginner-friendly finance tracker

Ledgerly is a simple React practice project for learning basic frontend development. The interface uses plain HTML-style form controls, a straightforward table, and a small amount of CSS. It avoids decorative animations, complicated dashboard widgets, icon-heavy layouts, and generic filler text.

## Frontend features

- View total income, expenses, and balance.
- Add a transaction with a title, amount, category, date, and type.
- Edit or delete a transaction.
- Search by title or category.
- Filter by income or expense.
- Save transactions in the current browser using `localStorage`.
- Restore the sample transactions.
- Responsive layout for mobile and desktop.

> This is a learning/practice interface. The browser-only version does not provide secure accounts or sync data between browsers or devices. Do not enter banking credentials or sensitive financial details.

## Run the frontend

Install Node.js and npm, then open a terminal in the `frontend` folder:

```bash
npm install
npm run dev
```

Open the local address printed by Vite, usually `http://localhost:5173`.

## Learn the code

- `frontend/src/App.jsx` — React state, calculations, form submission, editing, deletion, search, and filtering.
- `frontend/src/styles.css` — page layout, form styling, table styling, and responsive rules.
- `frontend/src/main.jsx` — starts the React application.
- `frontend/index.html` — basic HTML entry point.

## Optional backend folder

The `backend` folder is retained as a separate Spring Boot learning starter from the previous version. The simplified frontend currently runs in local-only mode and is **not connected to the backend**. Authentication and database persistence will need to be integrated separately if you want to practise full-stack development later.
