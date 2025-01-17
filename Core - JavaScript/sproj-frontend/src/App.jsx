import {Button} from "@/components/ui/button";
import Hero from "./Hero";
import Navigation from "./Navigation";
//import 'font-awesome/css/font-awesome.min.css';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"


function App() {
  const name = "";
  const cartCount = 4;

    return (
      <div>
        <Navigation name = {name} cartCount = {cartCount}/>
        <Hero/>
      

        <div className="p-4 w-96">
        <Card className="border-2">
            <CardHeader> 
              <Badge className="w-fit">New</Badge>
              <CardTitle>Product Name</CardTitle>
              <CardDescription>Card Description</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Product Content</p>
            </CardContent>
            <CardFooter>
              <Button>Buy Now</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

export default App;
