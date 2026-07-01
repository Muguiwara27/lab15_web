const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  'https://marketplace-pro-frontend.vercel.app',
];
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({
    name: 'Marketplace Pro Backend',
    author: 'Antony',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/api/health',
      products: '/api/products',
      categories: '/api/categories',
      auth: '/api/auth/login',
    },
    frontend: 'https://marketplace-pro-frontend.vercel.app',
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Marketplace Pro API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error.' });
});

module.exports = app;
