const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const dns = require('dns');

const authRoutes = require('./routes/auth');

dotenv.config();

const app = express();

/* -------------------------------------------------------------------------- */
/*                                  CONFIG                                    */
/* -------------------------------------------------------------------------- */

const PORT = process.env.PORT || 5000;

const CLIENT_ORIGIN =
  process.env.CLIENT_ORIGIN || 'http://localhost:5173';

const DB_URI =
  process.env.MONGO_URI ||
  process.env.MONGODB_URI ||
  'mongodb://localhost:27017/learnsphere';

const DB_FALLBACK = process.env.MONGO_URI_LOCAL;

const ALLOW_START_WITHOUT_DB =
  String(process.env.ALLOW_START_WITHOUT_DB || '').toLowerCase() ===
  'true';

/* -------------------------------------------------------------------------- */
/*                                DNS CONFIG                                  */
/* -------------------------------------------------------------------------- */

// Helps resolve some Atlas SRV lookup issues
dns.setServers(['8.8.8.8', '8.8.4.4']);

/* -------------------------------------------------------------------------- */
/*                              MONGOOSE CONFIG                               */
/* -------------------------------------------------------------------------- */

mongoose.set('bufferCommands', false);

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
});

mongoose.connection.on('error', (error) => {
  console.error('MongoDB error:', error.message);
});

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected');
});

/* -------------------------------------------------------------------------- */
/*                                MIDDLEWARE                                  */
/* -------------------------------------------------------------------------- */

app.disable('x-powered-by');

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

/* -------------------------------------------------------------------------- */
/*                                  ROUTES                                    */
/* -------------------------------------------------------------------------- */

app.use('/api/auth', authRoutes);

app.get('/api/data', (req, res) => {
  res.status(200).json({
    message: 'Hello from the backend'
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    database:
      mongoose.connection.readyState === 1
        ? 'connected'
        : 'disconnected'
  });
});

/* -------------------------------------------------------------------------- */
/*                               404 HANDLER                                  */
/* -------------------------------------------------------------------------- */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

/* -------------------------------------------------------------------------- */
/*                                HELPERS                                     */
/* -------------------------------------------------------------------------- */

function isMongoAuthError(error) {
  return Boolean(
    error &&
    (
      error.code === 8000 ||
      error.codeName === 'AtlasError' ||
      /authentication failed|bad auth/i.test(error.message || '')
    )
  );
}

async function connectMongo(uri) {
  return mongoose.connect(uri, {
    family: 4,
    serverSelectionTimeoutMS: 10000
  });
}

/* -------------------------------------------------------------------------- */
/*                              SERVER STARTUP                                */
/* -------------------------------------------------------------------------- */

async function startServer() {
  try {
    if (!DB_URI) {
      throw new Error('Database connection string is missing');
    }

    try {
      await connectMongo(DB_URI);
    } catch (error) {
      if (DB_FALLBACK) {
        console.warn(
          'Primary database connection failed. Trying fallback database.'
        );

        await connectMongo(DB_FALLBACK);

        console.log(
          'Connected using fallback database'
        );
      } else if (ALLOW_START_WITHOUT_DB) {
        console.warn(
          'Database connection failed. Starting without database.'
        );
      } else {
        throw error;
      }
    }

    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    const shutdown = async () => {
      console.log('Shutdown signal received');

      try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
      } catch (error) {
        console.error(
          'Error while closing MongoDB connection:',
          error.message
        );
      }

      server.close(() => {
        console.log('Server stopped');
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);

  } catch (error) {
    console.error('Application startup failed:', error.message);

    if (isMongoAuthError(error)) {
      console.error(
        'MongoDB authentication failed. Verify username, password, database permissions, and Atlas network access settings.'
      );
    }

    process.exit(1);
  }
}

/* -------------------------------------------------------------------------- */
/*                         GLOBAL PROCESS HANDLERS                            */
/* -------------------------------------------------------------------------- */

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Promise Rejection:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

/* -------------------------------------------------------------------------- */
/*                                   START                                    */
/* -------------------------------------------------------------------------- */

startServer();