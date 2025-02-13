import ProductCards from "./ProductCards";
import { Separator } from "@/components/ui/separator";
import Tab from "./Tab";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getProducts, getCategories } from "@/lib/api";
import { Skeleton } from "./components/ui/skeleton";


function Products(props) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const [isCategoriesLoading, setIsCategoriesLoading] =useState(true);
  const [productsError, setProductsError] = useState({
    isError: false,
    message: "",
  });
  const [categoriesError, setCategoriesError] = useState({
    isError: false,
    message: "",
  });

  const [selectedCategoryId, setSelectedCategoryId] = useState("ALL");


  const filteredProducts =
  selectedCategoryId === "ALL"
    ? products
    : products.filter((product) => String(product.categoryId) === selectedCategoryId);


    const handleTabClick = (_id) => {
      if (_id === "ALL") {
        setSelectedCategoryId("ALL");
      } else {
        setSelectedCategoryId(String(_id)); 
      }
    };

  useEffect(() => {
    getProducts()
      .then((data) => {
        console.log("Fetched products: ", data);
        setProducts(data);
      })
      .catch((error) => {
        setProductsError({ isError: true, message: error.message });
      })
      .finally(() => setIsProductsLoading(false));
  }, []);

  useEffect(() => {
    getCategories()
      .then((data) => {
        if (Array.isArray(data)) {
        setCategories([{ _id: "All", name: "All"}, ...data]);
        } else {
          setCategoriesError({ isError: true, message: "Invalid categories data" });
      }
      })
      .catch((error) => {
        setCategoriesError({ isError: true, message: error.message});
    })
      .finally(() => setIsCategoriesLoading(false));
  }, []);
  

  if (isCategoriesLoading || isProductsLoading) {
    return (
      <section className="px-8 py-8">
        <h2 className="text-4xl font-bold">Our Top Products</h2>

        <Separator className="mt-2" />
        <div className="mt-4 flex items-center gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-8 w-20" />
          ))}
          
        </div>
        <div className="grid grid-cols-4 gap-4 mt-4">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      </section>
    );
  }


  if (categoriesError.isError) {
    return (
      <section className="px-8 py-8">
        <h2 className="text-4xl font-bold">Our Top Products</h2>
        <Separator className="mt-2" />
        <div className="mt-4">
          <p className="text-red-500">{categoriesError.message}</p>
        </div>
      </section>
    );
  } 


  if (productsError.isError) {
    return (
      <section className="px-8 py-8">
        <h2 className="text-4xl font-bold">Our Top Products</h2>

        <Separator className="mt-2" />
        <div className="mt-4 flex items-center gap-4">
          {categories.map((category) => (
            <Tab
              key={category._id}
              _id={category._id}
              selectedCategoryId={selectedCategoryId}
              name={category.name}
              onTabClick={handleTabClick}
            />
          ))}
        </div>
        <div className="mt-4">
          <p className="text-red-500">{productsError.message}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="px-8 py-8">
      <h2 className="text-4xl font-bold">Our Top Products</h2>
      <Separator className="mt-2" />
      <div className="mt-4 flex items-center gap-4">
        {categories.map((category) => (
          <Tab
            key={category._id}
            _id={category._id}
            selectedCategoryId={selectedCategoryId}
            name={category.name}
            onTabClick={handleTabClick}
          />
        ))}
      </div>
      <ProductCards handleAddToCart={props.handleAddToCart} products={filteredProducts} />
    </section>
  );
}

export default Products;