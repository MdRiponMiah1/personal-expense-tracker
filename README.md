# Personal Expense Tracker (ExpenseFlow)

A clean, responsive, and interactive web application designed to manage daily income and expenses, calculate current balances in real time, and track monthly financial summaries.

This project was developed individually as a course assignment for the **Full Stack Web Development with Python, Django, React & AI** program on **Ostad**.

## Features

- **Real-Time Financial Dashboard:** Automatically calculates and displays **Total Income**, **Total Expenses**, and **Current Balance** in BDT (`৳`) whenever transactions are added, edited, or deleted.
- **Add & Edit Transactions:** Record income or expense entries with title, amount, transaction type, category, and date, or update existing records seamlessly.
- **Transaction History:** View all transactions in a clean, structured table with category badges, formatted amounts, and dates.
- **Filter & Live Search:** Filter records by **All Transactions**, **Income**, or **Expenses**, and search transactions instantly by title.
- **Delete with Confirmation Dialog:** Prevents accidental data loss using a confirmation modal before deleting any entry.
- **Monthly Expense Summary:** Select any month to view monthly income vs. expenses alongside a visual comparison bar chart.
- **Data Persistence:** Uses browser `localStorage` so all financial records remain saved across page reloads and browser restarts.
- **Dark & Light Theme:** Includes a theme switcher for comfortable viewing in both light and dark modes.
- **Responsive Design:** Fully optimized for desktop, tablet, and mobile screens.

## Tech Stack

- **HTML5:** Semantic structure and accessible form elements
- **CSS3:** Custom properties (CSS variables), Flexbox, Grid, responsive media queries, and dark/light theming
- **JavaScript (ES6+):** DOM manipulation, input validation, dynamic filtering/searching, and `localStorage` state management

## Project Structure

- **`index.html`** — Main application structure and UI layout
- **`style.css`** — Styling, responsive design, and light/dark themes
- **`script.js`** — Core logic, calculations, CRUD operations, and `localStorage`
- **`README.md`** — Project documentation

## How to Run Locally

1. Clone the repository: `git clone https://github.com/MdRiponMiah1/personal-expense-tracker.git`
2. Navigate to the project folder: `cd personal-expense-tracker`
3. Open `index.html` directly in any modern web browser, or run a local server (`python -m http.server 8080`) and visit `http://localhost:8080`.

## Author

- **Name:** MD RIPON MIAH
- **Academic Background:** B.Sc. in Computer Science & Engineering (Final Year), **Uttara University**
- **Program:** Full Stack Web Development with Python, Django, React & AI — **Ostad**
