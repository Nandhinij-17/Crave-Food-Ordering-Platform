const express = require('express');
const MenuItem = require('../models/MenuItem');
const router = express.Router();

const demoMenu = [
  { _id:'m1', name:'Margherita Pizza', description:'Classic tomato, mozzarella and basil.', category:'Pizza', price:249, image:'https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=900&q=80', rating:4.8, prepTime:'20–25 min', popular:true },
  { _id:'m2', name:'Crispy Chicken Burger', description:'Crispy chicken, lettuce and house sauce.', category:'Burgers', price:189, image:'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80', rating:4.7, prepTime:'15–20 min', popular:true },
  { _id:'m3', name:'Creamy Alfredo Pasta', description:'Penne tossed in a creamy parmesan sauce.', category:'Pasta', price:229, image:'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=900&q=80', rating:4.6, prepTime:'20–25 min', popular:false },
  { _id:'m4', name:'Garden Fresh Salad', description:'Crunchy greens, cherry tomatoes and lemon dressing.', category:'Healthy', price:149, image:'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80', rating:4.5, prepTime:'10–15 min', popular:false },
  { _id:'m5', name:'Double Cheese Burger', description:'Two juicy patties with melted cheddar.', category:'Burgers', price:259, image:'https://images.unsplash.com/photo-1553979459-d2229ba7433a?auto=format&fit=crop&w=900&q=80', rating:4.9, prepTime:'15–20 min', popular:true },
  { _id:'m6', name:'Farmhouse Pizza', description:'Bell peppers, onion, olives and mozzarella.', category:'Pizza', price:299, image:'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=80', rating:4.7, prepTime:'20–30 min', popular:false },
  { _id:'m7', name:'Chocolate Brownie', description:'Warm chocolate brownie with a fudgy centre.', category:'Desserts', price:99, image:'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=80', rating:4.8, prepTime:'5–10 min', popular:false },
  { _id:'m8', name:'Mango Cooler', description:'Refreshing mango drink with a hint of lime.', category:'Drinks', price:89, image:'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=900&q=80', rating:4.4, prepTime:'5 min', popular:false }
];

router.get('/', async (req, res, next) => {
  try {
    const { category, q } = req.query;
    let items;
    if (req.app.locals.demoMode) {
      items = demoMenu;
      if (category && category !== 'All') items = items.filter(x => x.category === category);
      if (q) items = items.filter(x => (x.name + ' ' + x.description).toLowerCase().includes(String(q).toLowerCase()));
      return res.json(items);
    }
    const filter = {};
    if (category && category !== 'All') filter.category = category;
    if (q) filter.$or = [{ name: { $regex: q, $options: 'i' } }, { description: { $regex: q, $options: 'i' } }];
    res.json(await MenuItem.find(filter).sort({ popular: -1, createdAt: -1 }));
  } catch (err) { next(err); }
});

module.exports = { router, demoMenu };
