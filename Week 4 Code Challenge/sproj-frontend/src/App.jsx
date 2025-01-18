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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

//import { Toaster, toast } from "@/components/ui/sonner";
import { Toaster, toast } from "sonner";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar"




function App() {
  const name = "";
  const cartCount = 4;

  const handleAddToCart = () => {
    toast.success("This item has been added to the cart!");
  };

  const handleSoldOut = () => {
    toast.error("Sorry, this item is sold out!");
  };

    return (
      <div>
        <Navigation name = {name} cartCount = {cartCount}/>
        <Hero/>

        <Menubar className="bg-gray-800 text-white shadow-lg rounded-lg w-2/4 p-2 mb-6">
  <MenubarMenu>
    <MenubarTrigger className="text-lg font-semibold hover:text-orange-200 transition-colors">Electronics</MenubarTrigger>
    <MenubarContent>
      <MenubarItem>
        New Products <MenubarShortcut>⌘T</MenubarShortcut>
      </MenubarItem>
      <MenubarItem>Mouse</MenubarItem>
      <MenubarSeparator />
      <MenubarItem>Keyboards</MenubarItem>
      <MenubarSeparator />
      <MenubarItem>Gaming items</MenubarItem>
    </MenubarContent>
  </MenubarMenu>

  <MenubarMenu>
    <MenubarTrigger className="text-lg font-semibold hover:text-orange-200 transition-colors">Phones</MenubarTrigger>
    <MenubarContent>
      <MenubarItem>
        iPhone 16 Pro Max <MenubarShortcut>⌘T</MenubarShortcut>
      </MenubarItem>
      <MenubarItem>iPhone 16 Pro</MenubarItem>
      <MenubarSeparator />
      <MenubarItem>iPhone 16</MenubarItem>
      <MenubarSeparator />
      <MenubarItem>iPhone 15 Pro</MenubarItem>
    </MenubarContent>
  </MenubarMenu>

  <MenubarMenu>
    <MenubarTrigger className="text-lg font-semibold hover:text-orange-200 transition-colors">Laptops</MenubarTrigger>
    <MenubarContent>
      <MenubarItem>
        Asus <MenubarShortcut>⌘T</MenubarShortcut>
      </MenubarItem>
      <MenubarItem>Dell</MenubarItem>
      <MenubarSeparator />
      <MenubarItem>HP</MenubarItem>
      <MenubarSeparator />
      <MenubarItem>MSI</MenubarItem>
    </MenubarContent>
  </MenubarMenu>
  
</Menubar>

      
    <div className="flex flex-row gap-4 p-4">
        <div className="w-96">
        <Card className="border-2">
            <CardHeader> 
              <Badge className="w-fit">New</Badge>
              <CardTitle>Product Name</CardTitle>
              <CardDescription>Card Description</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Product Content</p>
            </CardContent>

            <div className="p-4 w-96">
            <Select className="border-4">
                <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Color" />
                </SelectTrigger>
              <SelectContent>
              <SelectItem value="black">Black</SelectItem>
            <SelectItem value="white">White</SelectItem>
              <SelectItem value="red">Red</SelectItem>
            </SelectContent>
            </Select>
            </div>
            <CardFooter>
              <Button onClick={handleAddToCart}>Buy Now</Button>
            </CardFooter>
          </Card>
        </div>


        <div className="w-96">
        <Card className="border-2">
            <CardHeader> 
              <Badge variant="secondary" className="w-fit"> SOLD OUT</Badge>
              <CardTitle>Product Name</CardTitle>
              <CardDescription>Card Description</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Product Content</p>
            </CardContent>

            <div className="p-4 w-96">
            <Select className="border-4">
                <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Color" />
                </SelectTrigger>
              <SelectContent>
              <SelectItem value="black">Black</SelectItem>
            <SelectItem value="white">White</SelectItem>
              <SelectItem value="red">Red</SelectItem>
            </SelectContent>
            </Select>
            </div>
            <CardFooter>
              <Button onClick={handleSoldOut} >Sold Out</Button>

            </CardFooter>
          </Card>
        </div>
    </div>    
      <Toaster />
      </div>
    
    );

   
  }



export default App;
