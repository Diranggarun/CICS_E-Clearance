const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const SALT_ROUNDS = 10;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Supabase
const supabaseUrl = process.env.SUPABASE_URL?.trim();
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

if (!supabaseUrl || !supabaseKey) {
  console.error("CRITICAL ERROR: Supabase environment variables are missing in .env");
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * AUTH MIDDLEWARE
 * Use this to protect any route that requires a logged-in user.
 */
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extracts token from "Bearer <token>"

  if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

  try {
    // Verify the token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) throw new Error("Invalid token");

    // Attach user to request object for use in the next route handler
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired session." });
  }
};

/**
 * POST /api/auth/register
 */
app.post('/api/auth/register', async (req, res) => {
  const { 
    email, password, id_number, course, 
    last_name, first_name, middle_name, 
    gender, date_of_birth, contact_number 
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email,
      password, 
      email_confirm: true
    });

    if (authError) throw authError;

    const { error: profileError } = await supabase
      .from('profiles')
      .insert([{
        id: authUser.user.id,
        id_number,
        course,
        last_name,
        first_name,
        middle_name,
        gender,
        date_of_birth,
        contact_number,
        password_hash: hashedPassword,
        role: 'student'
      }]);

    if (profileError) throw profileError;

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/auth/login
 */
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single();

    res.status(200).json({
      access_token: data.session.access_token, // This is the JWT
      user: {
        id: data.user.id,
        email: data.user.email,
        role: profile?.role || 'student'
      }
    });
  } catch (err) {
    res.status(401).json({ message: "Invalid credentials." });
  }
});

/**
 * GET /api/auth/me (PROTECTED)
 * Uses the authenticateToken middleware to ensure only logged-in users enter.
 */
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', req.user.id)
      .single();

    if (error) throw error;
    res.json({ user: profile });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));