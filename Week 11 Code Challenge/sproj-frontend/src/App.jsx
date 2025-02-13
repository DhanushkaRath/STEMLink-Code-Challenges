import Hero from "./Hero";
import SignInPage from "./lib/pages/sign-in.page";
import SignUpPage from "./lib/pages/sign-up.page";
import Navigation from "./Navigation";
import Products from "./Products";


function App() {
  const name = "Dhanushka";
  const cartCount = 0;

    return (
      <div>
        <Navigation name = {name} cartCount = {cartCount}/>
        <Hero />
        <SignInPage />
        <SignUpPage />
        <Products />
        
      </div>
    );
  }

export default App;
