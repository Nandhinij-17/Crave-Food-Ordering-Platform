const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customer: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true }
  },
  items: [{
    menuItemId: String,
    name: String,
    price: Number,
    quantity: Number
  }],
  subtotal: { type: Number, required: true },
  deliveryFee: { type: Number, default: 30 },
  total: { type: Number, required: true },
  status: { type: String, enum: ['Placed', 'Preparing', 'Out for delivery', 'Delivered', 'Cancelled'], default: 'Placed' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
