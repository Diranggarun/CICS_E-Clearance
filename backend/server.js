// backend/server.js
const path = require('path');
// This line uses an absolute path to target the .env file located in the same folder as this server.js file
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Supabase with trimmed strings to prevent "Invalid path" errors caused by accidental spaces or newlines
const supabaseUrl = process.env.SUPABASE_URL?.trim();
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

if (!supabaseUrl || !supabaseKey) {
  console.error("CRITICAL ERROR: Supabase environment variables are missing or undefined. Check your /backend/.env file.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

/** * POST /auth/register 
 * Creates a user in Supabase Auth and a corresponding entry in the profiles table
 */
app.post('/api/auth/register', async (req, res) => {
  const { 
    email, password, id_number, course, 
    last_name, first_name, middle_name, 
    gender, date_of_birth, contact_number 
  } = req.body;

  try {
    // 1. Create user in Supabase Auth
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true // Ensure "Confirm Email" is OFF in Supabase Auth settings to avoid 400 errors
    });

    if (authError) {
      console.error("Auth Registration Error:", authError.message);
      throw authError;
    }

    // 2. Insert into the public profiles table
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
        role: 'student' 
      }]);

    if (profileError) {
      console.error("Profile Table Insert Error:", profileError.message);
      throw profileError;
    }

    res.status(201).json({ message: "Registration successful" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/** * POST /auth/login 
 * Returns access_token and user profile data
 */
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    // Fetch user role from the profile table
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single();

    res.status(200).json({
      access_token: data.session.access_token,
      user: {
        id: data.user.id,
        email: data.user.email,
        role: profile?.role || 'student'
      }
    });
  } catch (err) {
    res.status(401).json({ message: "Invalid credentials. Please try again." });
  }
});

/** * GET /auth/me 
 * Returns profile details for the currently logged-in user
 */
app.get('/api/auth/me', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error) throw error;

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    res.json({ user: { ...user, ...profile } });
  } catch (err) {
    res.status(401).json({ message: "Session expired" });
  }
});

/** * POST /auth/logout 
 */
app.post('/api/auth/logout', (req, res) => {
  res.status(200).json({ message: "Logged out" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));