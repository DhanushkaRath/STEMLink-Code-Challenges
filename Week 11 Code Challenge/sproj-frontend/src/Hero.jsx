

function Hero() {
  return (
    <section className="p-8 mx-16">
    
      <div className="grid grid-cols-2 rounded-md min-h-[60vh] bg-[#f4f8f9] ">
        <div className="flex flex-col justify-center p-16 gap-4 text-black">
          <span className="inline-block rounded-full px-2 py-1 text-xs w-fit bg-[#febc26] text-black">WEEKLY DISCOUNT</span>
          <h1 className="text-[3.75rem] font-semibold leading-none text-black ">Premium Product Online Shop</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius quos
            suscipit est autem quia? Voluptatem?
          </p>
          <a href="/shop" className="inline-block px-4 py-2 text-white font-medium w-fit rounded-md bg-black">
            Shop Now
          </a>
        </div>
        <div className="relative">
          <img
            src="https://fee-storefront.vercel.app/assets/hero/hero.jpg"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;
