import Hero from "./Hero";
import Navigation from "./Navigation";
import Products from "./Products";


function App() {
  const name = "";
  const cartCount = 2;

    return (
      <div>
        <Navigation name = {name} cartCount = {cartCount}/>
        <Hero/>
        <Products/>
        
      </div>
    );
  }

export default App;
