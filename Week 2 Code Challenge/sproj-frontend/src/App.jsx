import Hero from "./Hero";
import Navigation from "./Navigation";
import 'font-awesome/css/font-awesome.min.css';

function App() {
  const name = "Dhanushka";
  const cartCount = 0;

    return (
      <div>
        <Navigation name = {name} cartCount = {cartCount}/>
        <Hero/>
      </div>
    );
  }

export default App;
