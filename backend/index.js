import express from 'express';
import mongoose from 'mongoose';
import booksRoute from './routes/booksRoute.js';
import cors from 'cors';

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Variabel untuk menyimpan cache koneksi database
let cachedDb = null;

// Fungsi untuk menghubungkan ke database
const connectToDatabase = async () => {
  // Jika sudah ada koneksi, gunakan yang itu
  if (cachedDb) {
    return cachedDb;
  }

  // Jika tidak, buat koneksi baru
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI);
    cachedDb = db; // Simpan koneksi ke cache
    console.log('New database connection established');
    return db;
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
};

// Middleware untuk memastikan database terhubung sebelum setiap request
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    res.status(500).json({ message: 'Failed to connect to the database' });
  }
});

// Routes
app.get('/', (req, res) => res.status(200).send('Welcome to MERN Bookstore'));
app.use('/books', booksRoute);


export default app;