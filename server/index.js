const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// simple in-memory storage
const submissions = [];

// POST signup
app.post('/signup', (req, res) => {
  const { firstName, lastName, email, phone, city, state } = req.body;
  if (!firstName || !email) {
    return res.status(400).json({ error: 'missing required field' });
  }
  const record = { firstName, lastName, email, phone, city, state, timestamp: new Date() };
  submissions.push(record);
  console.log('new signup', record);
  res.json({ success: true });
});

// admin endpoint with basic password auth (header x-admin-password)
const ADMIN_PASS = process.env.ADMIN_PASS || 'admin123';
app.get('/submissions', (req, res) => {
  const pass = req.header('x-admin-password');
  if (pass !== ADMIN_PASS) {
    return res.status(401).json({ error: 'unauthorized' });
  }
  res.json(submissions);
});

app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
