import express from 'express';
import mongoose from 'mongoose';
import booksRoute from './routes/booksRoute.js';
import cors from 'cors';

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log('App connected to database');
  })
  .catch((error) => {
    console.log('MongoDB connection error:', error);
  });

app.get('/', (request, response) => {
  return response.status(200).send('Welcome to MERN Stack Bookstore');
});

app.use('/books', booksRoute);

export default app;