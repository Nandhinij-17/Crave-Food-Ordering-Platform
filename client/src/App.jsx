import React, { useEffect, useMemo, useState } from 'react';
import { Search, ShoppingBag, MapPin, Clock, Star, Plus, Minus, X, ArrowRight, Utensils, CheckCircle2, Menu as MenuIcon } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const categories = ['All', 'Pizza', 'Burgers', 'Pasta', 'Healthy', 'Desserts', 'Drinks'];
const fallback = [
  {_id:'m1',name:'Margherita Pizza',description:'Classic tomato, mozzarella and basil.',category:'Pizza',price:249,image:'https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=900&q=80',rating:4.8,prepTime:'20–25 min',popular:true},
  {_id:'m2',name:'Crispy Chicken Burger',description:'Crispy chicken, lettuce and house sauce.',category:'Burgers',price:189,image:'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80',rating:4.7,prepTime:'15–20 min',popular:true},
  {_id:'m3',name:'Creamy Alfredo Pasta',description:'Penne tossed in a creamy parmesan sauce.',category:'Pasta',price:229,image:'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=900&q=80',rating:4.6,prepTime:'20–25 min'},
  {_id:'m4',name:'Garden Fresh Salad',description:'Crunchy greens, cherry tomatoes and lemon dressing.',category:'Healthy',price:149,image:'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80',rating:4.5,prepTime:'10–15 min'},
  {_id:'m5',name:'Double Cheese Burger',description:'Two juicy patties with melted cheddar.',category:'Burgers',price:259,image:'https://images.unsplash.com/photo-1553979459-d2229ba7433a?auto=format&fit=crop&w=900&q=80',rating:4.9,prepTime:'15–20 min',popular:true},
  {_id:'m6',name:'Farmhouse Pizza',description:'Bell peppers, onion, olives and mozzarella.',category:'Pizza',price:299,image:'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=80',rating:4.7,prepTime:'20–30 min'},
  {_id:'m7',name:'Chocolate Brownie',description:'Warm chocolate brownie with a fudgy centre.',category:'Desserts',price:99,image:'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=80',rating:4.8,prepTime:'5–10 min'},
  {_id:'m8',name:'Mango Cooler',description:'Refreshing mango drink with a hint of lime.',category:'Drinks',price:89,image:'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=900&q=80',rating:4.4,prepTime:'5 min'}
];
const money = n => new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(n);

function App() {
  const [menu,setMenu] = useState(fallback);
  const [category,setCategory] = useState('All');
  const [search,setSearch] = useState('');
  const [cart,setCart] = useState([]);
  const [cartOpen,setCartOpen] = useState(false);
  const [checkout,setCheckout] = useState(false);
  const [customer,setCustomer] = useState({name:'',phone:'',address:''});
  const [notice,setNotice] = useState('');
  const [order,setOrder] = useState(null);
  const [loading,setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${API}/menu`,{signal:controller.signal}).then(r=>r.ok?r.json():Promise.reject()).then(data=>{if(Array.isArray(data)&&data.length)setMenu(data);}).catch(()=>{});
    return ()=>controller.abort();
  },[]);
  const filtered = useMemo(()=>menu.filter(item=>(category==='All'||item.category===category)&&`${item.name} ${item.description}`.toLowerCase().includes(search.toLowerCase())),[menu,category,search]);
  const count = cart.reduce((s,i)=>s+i.quantity,0);
  const subtotal = cart.reduce((s,i)=>s+i.price*i.quantity,0);
  const delivery = subtotal===0||subtotal>=499?0:30;
  const total = subtotal+delivery;
  const updateQty = (id,delta) => setCart(prev=>prev.map(i=>i._id===id?{...i,quantity:i.quantity+delta}:i).filter(i=>i.quantity>0));
  const add = item => {setCart(prev=>{const existing=prev.find(i=>i._id===item._id);return existing?prev.map(i=>i._id===item._id?{...i,quantity:i.quantity+1}:i):[...prev,{...item,quantity:1}];});setNotice(`${item.name} added to cart`);setTimeout(()=>setNotice(''),2200);};
  async function placeOrder(e) {
    e.preventDefault(); if(!cart.length)return;
    setLoading(true);
    const payload={customer,items:cart.map(i=>({menuItemId:i._id,name:i.name,price:i.price,quantity:i.quantity}))};
    try {
      const res=await fetch(`${API}/orders`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
      if(!res.ok) throw new Error('API unavailable');
      const data=await res.json(); setOrder(data);
    } catch {
      const sum=payload.items.reduce((s,i)=>s+i.price*i.quantity,0);
      setOrder({...payload,subtotal:sum,deliveryFee:sum>=499?0:30,total:sum+(sum>=499?0:30),status:'Placed',_id:'LOCAL-'+Date.now().toString().slice(-6)});
    }
    setCart([]);setCheckout(false);setLoading(false);setCartOpen(false);
  }
  return <div className="app">
    <header className="topbar"><a className="brand" href="#"><span className="brand-mark"><Utensils size={20}/></span><span>crave<span className="brand-dot">.</span></span></a><nav><a className="active" href="#menu">Menu</a><a href="#why">Why Crave?</a><a href="#footer">Contact</a></nav><button className="cart-button" onClick={()=>setCartOpen(true)} aria-label="Open cart"><ShoppingBag size={19}/><span>Cart</span><b>{count}</b></button><button className="mobile-menu" aria-label="Menu"><MenuIcon/></button></header>
    <main>
      <section className="hero"><div className="hero-copy"><div className="eyebrow"><span className="eyebrow-dot"></span> FRESHLY MADE, JUST FOR YOU</div><h1>Good food.<br/><em>Good mood.</em></h1><p>Discover the flavours you love, made fresh and delivered straight to your door.</p><a className="primary-button" href="#menu">Explore the menu <ArrowRight size={18}/></a><div className="hero-stats"><div><strong>4.9<span>/5</span></strong><small><Star size={13} fill="currentColor"/> happy foodies</small></div><div className="stat-divider"></div><div><strong>25<span> min</span></strong><small><Clock size={13}/> average delivery</small></div></div></div><div className="hero-art"><div className="hero-blob"></div><img
  src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1000&q=85"
  alt="Freshly baked pizza"
/><div className="floating-tag tag-top"><span>🔥</span><div><b>Fresh & hot</b><small>Made to order</small></div></div><div className="floating-tag tag-bottom"><span className="rating-star"><Star size={16} fill="currentColor"/></span><div><b>4.9 out of 5</b><small>Loved by our customers</small></div></div><div className="hero-scribble">made with ♥</div></div></section>
      <section className="benefits" id="why"><div><span className="benefit-icon orange"><Clock/></span><div><b>Fast delivery</b><small>At your door in 25–35 min</small></div></div><div><span className="benefit-icon green"><CheckCircle2/></span><div><b>Fresh ingredients</b><small>Quality you can taste</small></div></div><div><span className="benefit-icon yellow">✦</span><div><b>Made with love</b><small>Every meal, every time</small></div></div><div><span className="benefit-icon pink">♧</span><div><b>Easy ordering</b><small>Your favourites in a few taps</small></div></div></section>
      <section className="menu-section" id="menu"><div className="section-heading"><div><div className="eyebrow">OUR MENU</div><h2>Cravings, <em>sorted.</em></h2><p>Handpicked favourites and delicious little discoveries.</p></div><div className="searchbox"><Search size={18}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search dishes..."/></div></div><div className="filters">{categories.map(c=><button key={c} className={category===c?'selected':''} onClick={()=>setCategory(c)}>{c}</button>)}</div>
      <div className="food-grid">{filtered.map(item=><article className="food-card" key={item._id}><div className="food-image"><img src={item.image} alt={item.name} loading="lazy"/>{item.popular&&<span className="popular">Bestseller</span>}<button className="quick-add" onClick={()=>add(item)} aria-label={`Add ${item.name}`}><Plus size={19}/></button></div><div className="food-info"><div className="food-meta"><span>{item.category}</span><span className="rating"><Star size={13} fill="currentColor"/> {item.rating||'4.5'}</span></div><h3>{item.name}</h3><p>{item.description}</p><div className="food-bottom"><strong>{money(item.price)}</strong><span><Clock size={13}/> {item.prepTime||'20–30 min'}</span></div></div></article>)}</div>
      {!filtered.length&&<div className="empty-results">No dishes found. Try another search or category.</div>}
      </section>
      <section className="delivery-banner"><div><span className="banner-label">A LITTLE TREAT FROM US</span><h2>Free delivery on orders<br/>over <em>₹499.</em></h2><p>Good things are even better when delivery is on us.</p><button onClick={()=>document.getElementById('menu').scrollIntoView({behavior:'smooth'})}>Order something delicious <ArrowRight size={17}/></button></div><div className="banner-emoji">🥡</div></section>
    </main>
    <footer id="footer"><a className="brand" href="#"><span className="brand-mark"><Utensils size={18}/></span><span>crave<span className="brand-dot">.</span></span></a><p>Good food brings us together. Made fresh, delivered with love.</p><span>© {new Date().getFullYear()} Crave. Built for a delicious day.</span></footer>
    {notice&&<div className="toast"><CheckCircle2 size={17}/>{notice}</div>}
    {cartOpen&&<div className="overlay" onClick={()=>setCartOpen(false)}><aside className="drawer" onClick={e=>e.stopPropagation()}><div className="drawer-head"><div><span className="eyebrow">YOUR ORDER</span><h2>Your cart <span>({count})</span></h2></div><button className="icon-button" onClick={()=>setCartOpen(false)}><X/></button></div>
      {!cart.length?<div className="cart-empty"><div className="empty-bag"><ShoppingBag size={28}/></div><h3>Your cart is hungry.</h3><p>Add a few favourites and we'll take it from there.</p><button className="primary-button" onClick={()=>setCartOpen(false)}>Explore menu <ArrowRight size={17}/></button></div>:<><div className="cart-items">{cart.map(item=><div className="cart-item" key={item._id}><img src={item.image} alt=""/><div className="cart-item-info"><b>{item.name}</b><strong>{money(item.price)}</strong><div className="qty"><button onClick={()=>updateQty(item._id,-1)}><Minus size={13}/></button><span>{item.quantity}</span><button onClick={()=>updateQty(item._id,1)}><Plus size={13}/></button></div></div></div>)}</div><div className="cart-summary"><div><span>Subtotal</span><b>{money(subtotal)}</b></div><div><span>Delivery</span><b>{delivery===0?'FREE':money(delivery)}</b></div>{subtotal>0&&subtotal<499&&<small>Add {money(499-subtotal)} more for free delivery.</small>}<div className="total-line"><span>Total</span><strong>{money(total)}</strong></div><button className="checkout-button" onClick={()=>setCheckout(true)}>Continue to checkout <ArrowRight size={17}/></button></div></>}
      </aside></div>}
    {checkout&&<div className="overlay modal-overlay" onClick={()=>setCheckout(false)}><div className="checkout-modal" onClick={e=>e.stopPropagation()}><div className="drawer-head"><div><span className="eyebrow">ALMOST THERE</span><h2>Delivery details</h2></div><button className="icon-button" onClick={()=>setCheckout(false)}><X/></button></div><form onSubmit={placeOrder}><label>Full name<input required value={customer.name} onChange={e=>setCustomer({...customer,name:e.target.value})} placeholder="Your name"/></label><label>Phone number<input required type="tel" pattern="[0-9+() -]{8,16}" value={customer.phone} onChange={e=>setCustomer({...customer,phone:e.target.value})} placeholder="Mobile number"/></label><label>Delivery address<textarea required rows="3" value={customer.address} onChange={e=>setCustomer({...customer,address:e.target.value})} placeholder="House no., street, area, city"/></label><div className="modal-total"><span>Pay on delivery</span><strong>{money(total)}</strong></div><button className="checkout-button" disabled={loading}>{loading?'Placing order...':`Place order · ${money(total)}`}</button><p className="secure-note">Demo checkout — no payment details are collected.</p></form></div></div>}
    {order&&<div className="overlay modal-overlay" onClick={()=>setOrder(null)}><div className="success-modal" onClick={e=>e.stopPropagation()}><div className="success-icon"><CheckCircle2 size={36}/></div><span className="eyebrow">ORDER CONFIRMED</span><h2>That's a good choice!</h2><p>Your delicious order is being sent to the kitchen.</p><div className="order-number">Order ID <strong>{order._id}</strong></div><div className="success-total"><span>Order total</span><strong>{money(order.total)}</strong></div><button className="checkout-button" onClick={()=>setOrder(null)}>Back to menu</button></div></div>}
  </div>;
}
export default App;
