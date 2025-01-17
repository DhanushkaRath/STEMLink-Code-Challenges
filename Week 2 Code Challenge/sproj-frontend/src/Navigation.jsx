import { ShoppingCart } from "lucide-react";
import "./Navigation.css";

function Navigation(props) {

  const name = "Duburu";
  const cartCount = 0;

    return (
      <nav className="navbar">
        <div className="navgroup">
            <a className="="navbar-brand href="/">
                Mebius
            </a>
        <div className="nav-links">
          <a href="/home">Home</a>
          <a href="/shop">Shop</a>
        </div>
        </div>
        <div className="cart-section">
            <div>
        <a href="/cart" className="cart-link">
          <p className="cart-count">{props.cartCount}</p>
          <div className="cart-icon">
            <ShoppingCart/>
            Cart
        </div>
        </a>
        </div>
        <p>Hi, {props.name}</p>
    </div>
    </nav>
    );
  }



  export default Navigation;