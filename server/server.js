require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { router: menuRouter, demoMenu } = require('./routes/menu');
const orderRouter = require('./routes/orders');
const MenuItem = require('./models/MenuItem');

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',') : true }));
app.use(express.json({ limit: '1mb' }));

app.locals.demoMode = !process.env.MONGO_URI;
app.get('/api/health', (_req, res) => res.json({ status: 'ok', mode: app.locals.demoMode ? 'demo' : 'mongodb' }));
app.use('/api/menu', menuRouter);
app.use('/api/orders', orderRouter);
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Server error. Please try again.' });
});

const port = process.env.PORT || 5000;
async function start() {
  if (process.env.MONGO_URI) {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      app.locals.demoMode = false;
      const count = await MenuItem.countDocuments();
      if (!count) await MenuItem.insertMany(demoMenu.map(({ _id, ...item }) => item));
      console.log('MongoDB connected');
    } catch (err) {
      console.error('MongoDB connection failed:', err.message);
      process.exit(1);
    }
  } else {
    console.log('MONGO_URI not set — running with in-memory demo menu/orders.');
  }
  app.listen(port, () => console.log(`Food Ordering API running at http://localhost:${port}`));
}
start();
