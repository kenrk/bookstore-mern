import express from 'express';
import mongoose from 'mongoose';
import booksRoute from './routes/booksRoute.js';
import cors from 'cors';

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Caching koneksi database
let cachedDb = null;

const connectToDatabase = async () => {
  if (cachedDb) {
    return cachedDb;
  }
  try {
    const db = await mongoose.connect(process.env.MONGODB_URL);
    console.log('New database connection established');
    cachedDb = db;
    return db;
  } catch (error) {
    console.error('Database connection error:', error);
    throw error; // Lempar error agar Vercel tahu ada masalah
  }
};

// Middleware untuk memastikan DB terhubung sebelum menangani request
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    res.status(500).send({ message: 'Failed to connect to the database' });
  }
});


// Routes
app.get('/', (request, response) => {
  return response.status(200).send('Welcome to MERN Stack Bookstore');
});

app.use('/books', booksRoute);

export default app;