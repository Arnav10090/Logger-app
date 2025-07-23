# Logger Pro

A full-stack logging dashboard with a modern, theme-aware UI. Built using Next.js (frontend), Express/MongoDB (backend), and Material-UI. Features advanced filtering, pagination, persistent dark mode, i18n, and a pure black sidebar.

---

## Features
- **Modern UI:** Beautiful, responsive, and theme-aware design throughout the app with optimized spacing and layout for better usability.
- **Pure Black Sidebar:** Sleek, professional sidebar with no gradient, matching the latest UI update.
- **Persistent Dark Mode:** Toggle dark mode from any page (including login/settings); your preference is saved across reloads.
- **Internationalization (i18n):** Multi-language support (English, Spanish, French, German, Chinese, etc.).
- **Login System:** Secure login with a modern, branded login page (credentials: `admin`/`admin`).
- **Dashboard:** Dynamic stats and rich visualizations, including Pie Chart, Bar Chart, and Line Chart for log analytics, plus quick access to logs and settings.
- **Logs Page:** Paginated, filterable, and searchable logs table with pretty JSON display and consistent, well-spaced log detail boxes for better readability.
- **Settings Page:** Profile card (with avatar upload), dark mode toggle, notification settings, language and timezone selection, all in a beautiful theme-aware layout.
- **Dedicated Logout Button:** Prominently placed for easy access.
- **MongoDB for log storage:** Easily seed and manage your logs.
- **Optimized Layout:** Carefully tuned spacing and alignment across all pages for a polished, professional look.
- **Clean, modular code:** All logic is modular, reusable, and easy to extend.

---

## Prerequisites
- **Node.js** (v18+ recommended)
- **npm** (v9+ recommended)
- **MongoDB** (local or remote instance)

---

## 1. Clone the Repository
```bash
git clone <your-repo-url>
cd logger_app
```

---

## 2. Backend Setup

### a. Install Dependencies
```bash
cd backend
npm install
```

### b. Configure Environment Variables
Create a `.env` file in `backend/` (or set these in your environment):
```
MONGODB_URI=mongodb://127.0.0.1:27017/logger
PORT=5000
```

### c. Seed the Database
This will clear existing logs and insert 100 sample logs with timestamps between 01-01-2025 and 16-07-2025.
```bash
node src/seedLogs.js
```

### d. Start the Backend Server
```bash
npm start
# or
node src/app.js
```
The backend will run on [http://localhost:5000](http://localhost:5000)

---

## 3. Frontend Setup

### a. Install Dependencies
```bash
cd ../frontend
npm install
```

### b. Start the Frontend Server
```bash
npm run dev
```
The frontend will run on [http://localhost:3000](http://localhost:3000)

---

## 4. Usage
- Open [http://localhost:3000](http://localhost:3000) in your browser.
- You will be redirected to the login page.
- **Login credentials:**
  - Username: `admin`
  - Password: `admin`
- After login, you will see the dashboard with:
  - Dynamic log stats and rich visualizations (Pie Chart, Bar Chart, Line Chart) for analyzing log levels and trends
  - Quick navigation to logs and settings
- Use the pure black sidebar to access Dashboard, Logs, and Settings.
- **Logs Page:**
  - Paginated, filterable, and searchable logs
  - Pretty JSON display for log details
- **Settings Page:**
  - Profile card with avatar upload
  - Dark mode toggle
  - Notification settings
  - Language and timezone selection
- Toggle dark mode from login or settings; your preference is saved!
- Use the prominent logout button at the bottom of the sidebar to log out from any page.

---

## 5. Project Structure
```
logger_app/
  backend/
    src/
      app.js           # Express app entry point
      seedLogs.js      # Script to seed MongoDB with logs
      controllers/     # Route controllers
      models/          # Mongoose models
      routes/          # Express routes
      middlewares/     # Error handling, auth, etc.
      utils/           # Utility functions/constants
  frontend/
    components/        # Reusable React components
    pages/             # Next.js pages (login, dashboard, logs, settings)
    utils/             # Utility functions (query, format, axios)
    constants.js       # Shared constants (log levels, API URL, etc.)
    app/globals.css    # Global styles (including hiding Next.js dev indicator)
```

---

## 6. Customization & Extending
- To change the number of logs per page, edit `PAGE_SIZE` in `frontend/constants.js`.
- To add more log levels or app names, update the constants in backend and frontend.
- To add more languages, update the i18n configuration in `frontend/utils/i18n.js`.
- For production, update `MONGODB_URI` and `API_BASE_URL` as needed.
- To customize the sidebar or UI, edit `DashboardLayout.js` and related components.

---

## 7. Troubleshooting
- **MongoDB connection errors:** Ensure MongoDB is running and `MONGODB_URI` is correct.
- **Port conflicts:** Change the `PORT` in backend `.env` or frontend `.env.local` if needed.
- **Frontend/backend not updating:** Restart the dev servers after installing new dependencies.

---

## 8. Further Improvements
- Add user management and authentication (JWT, OAuth, etc.)
- Add log creation, editing, and deletion (use React Query's useMutation)
- Add Redis caching for high-traffic scenarios
- Use Docker for containerized deployment

---

## License
MIT 