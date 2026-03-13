require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = process.env.PORT || 3002;

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const allowedOrigin = process.env.ALLOWED_ORIGIN || '*';
app.use(cors({ origin: allowedOrigin }));
app.use(bodyParser.json());

// POST /signup — save to Supabase
app.post('/signup', async (req, res) => {
  const { firstName, lastName, email, phone, city, state } = req.body;
  if (!firstName || !email) {
    return res.status(400).json({ error: 'missing required field' });
  }
  const { error } = await supabase.from('signups').insert({
    first_name: firstName,
    last_name: lastName,
    email,
    phone,
    city,
    state,
  });
  if (error) {
    console.error('supabase insert error', error);
    return res.status(500).json({ error: 'failed to save' });
  }
  console.log('new signup:', email);
  res.json({ success: true });
});

// GET /submissions — read from Supabase (password protected)
const ADMIN_PASS = process.env.ADMIN_PASS || 'admin123';
app.get('/submissions', async (req, res) => {
  const pass = req.header('x-admin-password');
  if (pass !== ADMIN_PASS) {
    return res.status(401).json({ error: 'unauthorized' });
  }
  const { data, error } = await supabase
    .from('signups')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    console.error('supabase fetch error', error);
    return res.status(500).json({ error: 'failed to fetch' });
  }
  res.json(data.map(r => ({
    firstName: r.first_name,
    lastName: r.last_name,
    email: r.email,
    phone: r.phone,
    city: r.city,
    state: r.state,
    timestamp: r.created_at,
  })));
});

app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
