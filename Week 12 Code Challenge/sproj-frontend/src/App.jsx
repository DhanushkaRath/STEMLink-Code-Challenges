import Hero from "./Hero";
import SignInPage from "./lib/pages/sign-in.page";
import SignUpPage from "./lib/pages/sign-up.page";
import Navigation from "./Navigation";
import Products from "./Products";
import { SavedItemsProvider } from "./lib/features/SavedItemsContext";


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
        <Heart />
        
      </div>
    );
  }

export default App;
