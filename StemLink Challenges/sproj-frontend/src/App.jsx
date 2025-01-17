import Button from "./Button";
import Hero from "./Hero";
import Navigation from "./Navigation";
//import 'font-awesome/css/font-awesome.min.css';

function App() {
  const name = "Duburu";
  const cartCount = 0;

    return (
      <div>
        <Navigation name = {name} cartCount = {cartCount}/>
        <Hero/>
        <div className="p-4">
          <Button>
          <a href="/cart"> Buy Now</a>
          </Button>
    
        </div>
      </div>
    );
  }

export default App;
