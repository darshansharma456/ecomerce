import React, { useMemo, useState } from 'react';
import { Search, ShoppingBag, Heart, Menu, X, ArrowUpRight, ArrowRight, Star, Plus, Minus, Trash2, SlidersHorizontal, Check, ChevronDown, Sparkles, PackageCheck, ShieldCheck, Truck } from 'lucide-react';
import { products } from './data/products';

const money = n => `$${n.toFixed(2)}`;
const readStore = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
};

function App() {
  const [cart, setCart] = useState(() => readStore('nova-cart', []));
  const [wishlist, setWishlist] = useState(() => readStore('nova-wishlist', []));
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('featured');
  const [query, setQuery] = useState('');
  const [drawer, setDrawer] = useState('');
  const [selected, setSelected] = useState(null);
  const [notice, setNotice] = useState('');
  const [checkoutDone, setCheckoutDone] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  React.useEffect(() => localStorage.setItem('nova-cart', JSON.stringify(cart)), [cart]);
  React.useEffect(() => localStorage.setItem('nova-wishlist', JSON.stringify(wishlist)), [wishlist]);

  const categories = ['All', 'Tech', 'Home', 'Apparel', 'Accessories'];
  const visibleProducts = useMemo(() => {
    let list = products.filter(p => (category === 'All' || p.category === category) &&
      `${p.name} ${p.category}`.toLowerCase().includes(query.toLowerCase()));
    if (sort === 'low') list.sort((a,b) => a.price-b.price);
    if (sort === 'high') list.sort((a,b) => b.price-a.price);
    if (sort === 'rating') list.sort((a,b) => b.rating-a.rating);
    return list;
  }, [category, sort, query]);

  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal === 0 || subtotal >= 100 ? 0 : 8;
  const total = subtotal + shipping;

  const notify = msg => { setNotice(msg); window.clearTimeout(window.__novaTimer); window.__novaTimer = window.setTimeout(() => setNotice(''), 2400); };
  const addToCart = product => {
    setCart(old => {
      const found = old.find(item => item.id === product.id);
      return found ? old.map(item => item.id === product.id ? {...item, qty: item.qty + 1} : item) : [...old, {...product, qty: 1}];
    });
    notify(`${product.name} added to your bag`);
  };
  const updateQty = (id, delta) => setCart(old => old.map(item => item.id === id ? {...item, qty: item.qty + delta} : item).filter(item => item.qty > 0));
  const toggleWish = id => setWishlist(old => old.includes(id) ? old.filter(x => x !== id) : [...old, id]);
  const openCategory = cat => { setCategory(cat); setMobileMenu(false); document.getElementById('shop')?.scrollIntoView({behavior:'smooth'}); };

  return <div className="app-shell">
    <div className="announcement"><Sparkles size={13}/> Thoughtful finds for everyday living <span>·</span> Free shipping on orders over $100</div>
    <header className="header">
      <button className="icon-btn mobile-toggle" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Open menu"><Menu size={21}/></button>
      <a className="logo" href="#" onClick={() => {setCategory('All');setQuery('')}}>nova<span>.</span></a>
      <nav className={`nav ${mobileMenu ? 'nav-open' : ''}`}>
        {categories.map(cat => <button key={cat} className={category===cat?'nav-link active':'nav-link'} onClick={() => openCategory(cat)}>{cat==='All'?'Shop all':cat}</button>)}
      </nav>
      <div className="header-actions">
        <label className="search-box"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search products..." /></label>
        <button className="icon-btn wishlist-head" onClick={() => setDrawer('wishlist')} aria-label="Wishlist"><Heart size={20}/><i>{wishlist.length}</i></button>
        <button className="bag-btn" onClick={() => setDrawer('cart')}><ShoppingBag size={18}/><span>Bag</span><b>{count}</b></button>
      </div>
    </header>

    <main>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-line"/> THE EVERYDAY EDIT — VOL. 04</div>
          <h1>Good things.<br/><em>Better living.</em></h1>
          <p>Thoughtfully selected pieces for the spaces you live in, the places you go, and everything in between.</p>
          <button className="primary-btn" onClick={() => openCategory('All')}>Explore the collection <ArrowUpRight size={17}/></button>
          <div className="hero-note"><span className="tiny-dot"/> Curated with intention. Made to be lived in.</div>
        </div>
        <div className="hero-image-wrap">
          <img className="hero-image" src="https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?auto=format&fit=crop&w=1500&q=90" alt="Warm minimalist living space"/>
          <div className="hero-stamp"><span>THE</span><strong>GOOD<br/>LIFE</strong><span>STARTS HERE</span></div>
          <div className="image-caption">OBJECTS FOR A LIFE WELL LIVED <span>01 / 04</span></div>
        </div>
      </section>

      <section className="trust-row">
        <div><Truck/><span><b>Free shipping</b><small>On orders over $100</small></span></div>
        <div><ShieldCheck/><span><b>Secure checkout</b><small>Your details stay protected</small></span></div>
        <div><PackageCheck/><span><b>Easy returns</b><small>30-day return window</small></span></div>
      </section>

      <section className="shop-section" id="shop">
        <div className="section-top">
          <div><div className="eyebrow"><span className="eyebrow-line"/> THE COLLECTION</div><h2>Find your <em>everyday.</em></h2><p>Useful things. Beautifully considered.</p></div>
          <div className="shop-count">{visibleProducts.length.toString().padStart(2,'0')} PRODUCTS <span>↘</span></div>
        </div>
        <div className="toolbar">
          <div className="category-tabs">{categories.map(cat=><button key={cat} className={category===cat?'category-tab selected':'category-tab'} onClick={()=>setCategory(cat)}>{cat==='All'?'All pieces':cat}</button>)}</div>
          <label className="sort-select"><SlidersHorizontal size={15}/><select value={sort} onChange={e=>setSort(e.target.value)}><option value="featured">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option><option value="rating">Top rated</option></select><ChevronDown size={14}/></label>
        </div>
        <div className="product-grid">
          {visibleProducts.map((p,i)=><article className="product-card" key={p.id}>
            <div className="product-image-wrap" onClick={()=>setSelected(p)}>
              <img src={p.image} alt={p.name} loading="lazy"/>
              {p.tag && <span className={`product-tag ${p.tag==='SALE'?'sale':''}`}>{p.tag}</span>}
              <button className={`wish-btn ${wishlist.includes(p.id)?'wished':''}`} onClick={e=>{e.stopPropagation();toggleWish(p.id)}} aria-label="Toggle wishlist"><Heart size={17} fill={wishlist.includes(p.id)?'currentColor':'none'}/></button>
              <button className="quick-add" onClick={e=>{e.stopPropagation();addToCart(p)}}>Quick add <Plus size={15}/></button>
            </div>
            <div className="product-info">
              <div className="product-meta"><span>{p.category}</span><span><Star size={12} fill="currentColor"/> {p.rating}</span></div>
              <button className="product-name" onClick={()=>setSelected(p)}>{p.name}</button>
              <div className="price-line"><b>{money(p.price)}</b>{p.oldPrice && <del>{money(p.oldPrice)}</del>}<span>{p.color}</span></div>
            </div>
          </article>)}
        </div>
        {visibleProducts.length===0 && <div className="empty-results"><Search size={28}/><h3>No pieces found</h3><p>Try another search or category.</p><button className="text-btn" onClick={()=>{setQuery('');setCategory('All')}}>Clear filters <ArrowRight size={15}/></button></div>}
      </section>

      <section className="editorial">
        <div className="editorial-image"><img src="https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=85" alt="Calm, curated home interior"/></div>
        <div className="editorial-copy"><div className="eyebrow"><span className="eyebrow-line"/> A LITTLE LESS, A LITTLE BETTER</div><h2>Keep what<br/><em>matters.</em></h2><p>We believe the best everyday objects earn their place. Discover considered design, lasting quality, and details that make the ordinary feel special.</p><button className="text-btn" onClick={()=>openCategory('Home')}>Explore home essentials <ArrowRight size={16}/></button></div>
      </section>

      <section className="newsletter"><div className="eyebrow"><span className="eyebrow-line"/> THE NOVA NOTE</div><h2>A good thing in<br/><em>your inbox.</em></h2><p>New finds, thoughtful ideas, and 10% off your first order.</p><Newsletter/></section>
    </main>

    <footer className="footer"><a className="logo" href="#">nova<span>.</span></a><p>Everyday, elevated.</p><div className="footer-links"><a href="#shop">Shop</a><a href="#shop">Our story</a><a href="mailto:hello@nova.example">Contact</a></div><small>© 2025 NOVA Studio. Demo storefront for portfolio use.</small></footer>

    {drawer && <div className="overlay" onMouseDown={e=>{if(e.target===e.currentTarget)setDrawer('')}}>
      <aside className="drawer">
        <div className="drawer-head"><div><span className="eyebrow">{drawer==='cart'?'YOUR SELECTION':'SAVED FOR LATER'}</span><h3>{drawer==='cart'?'Your bag':'Wishlist'} <small>({drawer==='cart'?count:wishlist.length})</small></h3></div><button className="icon-btn" onClick={()=>setDrawer('')}><X/></button></div>
        {drawer==='cart' ? <>{cart.length===0?<EmptyState title="Your bag is taking a breather." text="Find something lovely to bring home." action={()=>{setDrawer('');openCategory('All')}}/>:<><div className="drawer-items">{cart.map(item=><div className="drawer-item" key={item.id}><img src={item.image} alt={item.name}/><div className="drawer-item-info"><b>{item.name}</b><small>{item.color} · {money(item.price)}</small><div className="qty-control"><button onClick={()=>updateQty(item.id,-1)}><Minus size={13}/></button><span>{item.qty}</span><button onClick={()=>updateQty(item.id,1)}><Plus size={13}/></button></div></div><button className="remove-btn" onClick={()=>setCart(old=>old.filter(x=>x.id!==item.id))}><Trash2 size={16}/></button></div>)}</div><div className="cart-bottom"><div className="shipping-hint">{shipping===0?'You unlocked free shipping.':'You are '+money(100-subtotal)+' away from free shipping.'}</div><div className="totals"><span>Subtotal</span><b>{money(subtotal)}</b></div><div className="totals"><span>Shipping</span><b>{shipping===0?'FREE':money(shipping)}</b></div><div className="totals grand"><span>Total</span><b>{money(total)}</b></div><button className="primary-btn checkout-btn" onClick={()=>{setDrawer('');setCheckoutDone(false);setDrawer('checkout')}}>Continue to checkout <ArrowRight size={16}/></button><p className="secure-note"><ShieldCheck size={13}/> Secure demo checkout · No payment collected</p></div></>}</> :
        <>{wishlist.length===0?<EmptyState title="Nothing saved just yet." text="Tap the heart on a product to save it here." action={()=>{setDrawer('');openCategory('All')}}/>:<div className="drawer-items">{products.filter(p=>wishlist.includes(p.id)).map(item=><div className="drawer-item" key={item.id}><img src={item.image} alt={item.name}/><div className="drawer-item-info"><b>{item.name}</b><small>{money(item.price)}</small><button className="text-btn small" onClick={()=>addToCart(item)}>Add to bag <ArrowRight size={13}/></button></div><button className="remove-btn" onClick={()=>toggleWish(item.id)}><X size={16}/></button></div>)}</div>}</>}
      </aside>
    </div>}

    {drawer==='checkout' && <div className="overlay" onMouseDown={e=>{if(e.target===e.currentTarget)setDrawer('')}}><aside className="drawer checkout-drawer"><div className="drawer-head"><div><span className="eyebrow">ALMOST YOURS</span><h3>Checkout</h3></div><button className="icon-btn" onClick={()=>setDrawer('')}><X/></button></div>{checkoutDone?<div className="success-state"><div className="success-icon"><Check/></div><h2>Order received.</h2><p>Your demo order has been placed successfully. No payment was processed.</p><button className="primary-btn" onClick={()=>{setCart([]);setDrawer('')}}>Continue shopping <ArrowRight size={16}/></button></div>:<form className="checkout-form" onSubmit={e=>{e.preventDefault();setCheckoutDone(true)}}><div className="checkout-summary"><span>{count} items</span><b>{money(total)}</b></div><label>Email address<input type="email" required placeholder="you@example.com"/></label><div className="form-row"><label>First name<input required placeholder="First name"/></label><label>Last name<input required placeholder="Last name"/></label></div><label>Shipping address<input required placeholder="Street and house number"/></label><div className="form-row"><label>City<input required placeholder="City"/></label><label>Postal code<input required placeholder="Postal code"/></label></div><label>Country<select required defaultValue=""><option value="" disabled>Select country</option><option>Nepal</option><option>India</option><option>United States</option><option>United Kingdom</option><option>Other</option></select></label><div className="demo-payment"><ShieldCheck size={17}/><span><b>Demo payment</b><small>This portfolio demo does not collect card details or process payments.</small></span></div><button className="primary-btn checkout-btn" type="submit">Place demo order <ArrowRight size={16}/></button></form>}</aside></div>}

    {selected && <div className="overlay modal-overlay" onMouseDown={e=>{if(e.target===e.currentTarget)setSelected(null)}}><div className="product-modal"><button className="icon-btn modal-close" onClick={()=>setSelected(null)}><X/></button><img src={selected.image} alt={selected.name}/><div className="modal-copy"><span className="eyebrow">{selected.category} · {selected.color}</span><h2>{selected.name}</h2><div className="modal-rating"><Star size={14} fill="currentColor"/> {selected.rating} <span>({selected.reviews} reviews)</span></div><div className="modal-price">{money(selected.price)} {selected.oldPrice&&<del>{money(selected.oldPrice)}</del>}</div><p>{selected.description}</p><button className="primary-btn" onClick={()=>{addToCart(selected);setSelected(null);setDrawer('cart')}}>Add to bag <ShoppingBag size={16}/></button><div className="modal-foot"><Truck size={15}/> Free shipping over $100</div></div></div></div>}

    {notice && <div className="toast"><Check size={16}/>{notice}</div>}
    <button className="back-top" onClick={()=>window.scrollTo({top:0,behavior:'smooth'})} aria-label="Back to top">↑</button>
  </div>;
}

function Newsletter() {
  const [email,setEmail] = useState('');
  const [done,setDone] = useState(false);
  return done ? <div className="newsletter-success"><Check size={17}/> You're on the list. See you in your inbox.</div> : <form className="newsletter-form" onSubmit={e=>{e.preventDefault();setDone(true)}}><input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="Your email address"/><button type="submit">Sign me up <ArrowUpRight size={15}/></button></form>;
}
function EmptyState({title,text,action}) {
  return <div className="empty-state"><ShoppingBag size={30}/><h3>{title}</h3><p>{text}</p><button className="text-btn" onClick={action}>Explore the collection <ArrowRight size={15}/></button></div>;
}
export default App;