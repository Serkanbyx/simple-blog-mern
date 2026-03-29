const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const USERNAME_REGEX = /^[a-zA-Z0-9]{3,30}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const MIN_PASSWORD_LENGTH = 6;

const formatUserResponse = (user, token) => ({
  user: { id: user._id, username: user.username, email: user.email, role: user.role },
  token,
});

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !USERNAME_REGEX.test(username)) {
      return res.status(400).json({
        message: 'Username must be 3-30 alphanumeric characters.',
      });
    }

    if (!email || !EMAIL_REGEX.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address.' });
    }

    if (!password || password.length < MIN_PASSWORD_LENGTH) {
      return res.status(400).json({
        message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      $or: [{ email: normalizedEmail }, { username }],
    });

    if (existingUser) {
      const field = existingUser.email === normalizedEmail ? 'Email' : 'Username';
      return res.status(409).json({ message: `${field} already exists.` });
    }

    const role = normalizedEmail === process.env.ADMIN_EMAIL ? 'admin' : 'user';

    const user = await User.create({
      username,
      email: normalizedEmail,
      password,
      role,
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json(formatUserResponse(user, token));
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() }).select(
      '+password',
    );

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = generateToken(user._id, user.role);

    res.json(formatUserResponse(user, token));
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// GET /api/auth/me (protected)
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json({
      user: { id: user._id, username: user.username, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { register, login, getMe };
