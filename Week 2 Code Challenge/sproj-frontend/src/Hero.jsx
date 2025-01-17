import "./Hero.css";


function Hero() {
  return (
    <section className="hero-section">
    
      <div className="hero-container">
        <div className="hero-content">
          <span className="discount-badge">WEEKLY DISCOUNT</span>
          <h1 className="hero-title">Premium Product Online Shop</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius quos
            suscipit est autem quia? Voluptatem?
          </p>
          <a href="/shop" className="shop-now-btn">
            Shop Now
          </a>
        </div>
        <div className="hero-image-container">
          <img
            src="https://fee-storefront.vercel.app/assets/hero/hero.jpg"
            alt=""
            className="hero-image"
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;
