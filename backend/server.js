const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
const ALLOW_START_WITHOUT_DB = String(process.env.ALLOW_START_WITHOUT_DB || '').toLowerCase() === 'true';

app.disable('x-powered-by');
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));

app.use('/api/auth', authRoutes);

app.get('/api/data', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

function isMongoAuthError(error) {
  return Boolean(
    error && (
      error.codeName === 'AtlasError' ||
      error.code === 8000 ||
      /bad auth|authentication failed/i.test(error.message || '')
    )
  );
}

async function connectMongo(uri) {
  await mongoose.connect(uri);
}

async function startServer() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is required');
    }

    try {
      await connectMongo(process.env.MONGO_URI);
      console.log('MongoDB connected');
    } catch (error) {
      const localFallback = process.env.MONGO_URI_LOCAL;

      if (localFallback) {
        console.warn('Primary MongoDB connection failed, trying MONGO_URI_LOCAL...');
        await connectMongo(localFallback);
        console.log('MongoDB connected via local fallback');
      } else if (ALLOW_START_WITHOUT_DB) {
        console.warn('MongoDB connection failed, but ALLOW_START_WITHOUT_DB=true so the server will continue without a database connection.');
        if (isMongoAuthError(error)) {
          console.warn('Atlas authentication failed. Check the username, password, IP allowlist, and authSource in MONGO_URI.');
        }
      } else {
        throw error;
      }
    }

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      if (mongoose.connection.readyState === 1) {
        console.log('MongoDB connection successful');
      }
    });
  } catch (err) {
    console.error('MongoDB connection failed:', err);

    if (isMongoAuthError(err)) {
      console.error('Fix MONGO_URI in backend/.env: confirm the Atlas username/password, IP access list, and that the user has the right database role.');
    }

    process.exit(1);
  }
}

startServer();