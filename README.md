# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

---

## Backend & admin portal

This repo now includes a lightweight Express backend in `server/index.js`.

1. Install the server dependencies:
   ```bash
   npm install express cors body-parser
   ```
2. Start the backend:
   ```bash
   node server/index.js
   ```
   it listens on port **3000** by default.
3. The front end (dev server on port 56) sends sign‑up POSTs to `http://localhost:3000/signup`.
4. Visit `http://localhost:56/admin` to access the admin portal and view all submissions (stored in memory). You will be prompted for a password; the default is `admin123` (change it by setting the `ADMIN_PASS` environment variable before starting the server).

The storage is ephemeral; restart the server to clear the data. For a production system you would replace it with a database or other persistent store.

