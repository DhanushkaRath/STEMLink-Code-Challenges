import { Separator } from "@/components/ui/separator";
import { useGetCategoriesQuery, useGetProductsQuery } from "@/lib/api";
import { useState, useEffect } from "react";
import { Skeleton } from "../../../components/ui/skeleton";
import ProductCards from "./ProductCards";
import Tab from "./Tab";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

function Products() {
  const [selectedCategoryId, setSelectedCategoryId] = useState("ALL");
  const [retryCount, setRetryCount] = useState(0);

  const {
    data: products,
    isLoading: isProductsLoading,
    isError: isProductsError,
    error: productsError,
    refetch: refetchProducts,
  } = useGetProductsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const {
    data: categories,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
    error: categoriesError,
    refetch: refetchCategories,
  } = useGetCategoriesQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (isProductsError || isCategoriesError) {
      if (retryCount < 3) {
        const timer = setTimeout(() => {
          refetchProducts();
          refetchCategories();
          setRetryCount(prev => prev + 1);
        }, 2000);
        return () => clearTimeout(timer);
      } else {
        toast.error("Failed to load data. Please try refreshing the page.");
      }
    }
  }, [isProductsError, isCategoriesError, retryCount, refetchProducts, refetchCategories]);

  const filteredProducts =
    selectedCategoryId === "ALL"
      ? products
      : products?.filter((product) => product.categoryId === selectedCategoryId);

  const handleTabClick = (_id) => {
    setSelectedCategoryId(_id);
  };

  if (isProductsLoading || isCategoriesLoading) {
    return (
      <section className="px-8 py-8">
        <h2 className="text-4xl font-bold">Our Top Products</h2>
        <Separator className="mt-2" />
        <div className="mt-4 flex items-center gap-4">
          <Skeleton className="h-16" />
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

  if (isProductsError || isCategoriesError) {
    return (
      <section className="px-8 py-8">
        <h2 className="text-4xl font-bold">Our Top Products</h2>
        <Separator className="mt-2" />
        <div className="mt-4 text-center">
          <p className="text-red-500">Error loading products. Please try again later.</p>
          <Button 
            onClick={() => {
              refetchProducts();
              refetchCategories();
            }}
            className="mt-4"
          >
            Retry
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="px-8 py-8">
      <h2 className="text-4xl font-bold">Our Top Products</h2>
      <Separator className="mt-2" />
      <div className="mt-4 flex items-center gap-4">
        {[...(categories || []), { _id: "ALL", name: "All" }].map((category) => (
          <Tab
            key={category._id}
            _id={category._id}
            selectedCategoryId={selectedCategoryId}
            name={category.name}
            onTabClick={handleTabClick}
          />
        ))}
      </div>
      <ProductCards products={filteredProducts || []} />
    </section>
  );
}

export default Products;