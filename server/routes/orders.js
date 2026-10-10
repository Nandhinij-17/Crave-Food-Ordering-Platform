const express = require('express');
const Order = require('../models/Order');
const router = express.Router();
const demoOrders = [];

router.post('/', async (req, res, next) => {
  try {
    const { customer, items } = req.body;
    if (!customer?.name?.trim() || !customer?.phone?.trim() || !customer?.address?.trim())
      return res.status(400).json({ message: 'Name, phone and delivery address are required.' });
    if (!Array.isArray(items) || items.length === 0)
      return res.status(400).json({ message: 'Add at least one item to your cart.' });
    const safeItems = items.map(i => ({
      menuItemId: String(i.menuItemId || i._id || ''),
      name: String(i.name || 'Food item'),
      price: Math.max(0, Number(i.price) || 0),
      quantity: Math.min(50, Math.max(1, Number(i.quantity) || 1))
    }));
    const subtotal = safeItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const deliveryFee = subtotal >= 499 ? 0 : 30;
    const data = { customer, items: safeItems, subtotal, deliveryFee, total: subtotal + deliveryFee, status: 'Placed' };
    let order;
    if (req.app.locals.demoMode) {
      order = { ...data, _id: 'DEMO-' + Date.now().toString().slice(-8), createdAt: new Date().toISOString() };
      demoOrders.push(order);
    } else {
      order = await Order.create(data);
    }
    res.status(201).json(order);
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const order = req.app.locals.demoMode
      ? demoOrders.find(o => o._id === req.params.id)
      : await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found.' });
    res.json(order);
  } catch (err) { next(err); }
});

router.patch('/:id/status', async (req, res, next) => {
  try {
    const allowed = ['Placed', 'Preparing', 'Out for delivery', 'Delivered', 'Cancelled'];
    if (!allowed.includes(req.body.status)) return res.status(400).json({ message: 'Invalid order status.' });
    let order;
    if (req.app.locals.demoMode) {
      order = demoOrders.find(o => o._id === req.params.id);
      if (order) order.status = req.body.status;
    } else {
      order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true, runValidators: true });
    }
    if (!order) return res.status(404).json({ message: 'Order not found.' });
    res.json(order);
  } catch (err) { next(err); }
});

module.exports = router;
