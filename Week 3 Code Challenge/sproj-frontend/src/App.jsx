import Hero from "./Hero";
import Navigation from "./Navigation";
import 'font-awesome/css/font-awesome.min.css';

function App() {
  const name = "";
  const cartCount = 4;

    return (
      <div>
        
        <Navigation name = {name} cartCount = {cartCount}/>
        <Hero/>
      </div>
    );
  }

export default App;
