import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";


function ProductCard(props) {

  const [num, setNum] = useState(0);

  const handleClick = (e) => {
    setNum(num + 1);
    
  };
  
  return (
    <Card>
      <div className="h-80 bg-card rounded-lg p-4 relative">
       <img src={props.image} className="block"/>
      </div>
      <div className="flex px-4 mt-4  items-center justify-between">
        <h2 className="text-2xl  font-semibold">{props.name}</h2>
        <span className="block text-lg font-medium">${props.price}</span>
        <p>{num}</p>
        
      </div>
      <div className="px-4 mt-2">
        <p className="text-sm">{props.description}
          
        </p>
      </div>
      <div className="mt-1 p-4">
        <Button className="w-full" onClick={handleClick}>
          Buy Now
        </Button>
      </div>
    </Card>
  );
}

export default ProductCard;