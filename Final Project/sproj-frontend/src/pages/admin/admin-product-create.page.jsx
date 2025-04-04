import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetCategoriesQuery, useCreateProductMutation } from "@/lib/api";
import { toast } from "sonner";
import { useAuth } from "@clerk/clerk-react";

function AdminProductCreatePage() {
  const navigate = useNavigate();
  const { data: categories, isLoading: isCategoriesLoading } = useGetCategoriesQuery();
  const [createProduct] = useCreateProductMutation();
  const { getToken } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    inventory: "",
    image: "",
    categoryId: "",
  });

  // 🔹 Handle Input Change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 🔹 Handle Category Selection
  const handleCategoryChange = (value) => {
    setProductData((prev) => ({
      ...prev,
      categoryId: value,
    }));
  };

  // 🔹 Validate Form Inputs
  const validateForm = () => {
    const { name, description, price, inventory, image, categoryId } = productData;

    if (!name.trim()) return toast.error("Product name is required");
    if (!description.trim()) return toast.error("Product description is required");
    if (!price || isNaN(price) || Number(price) <= 0) return toast.error("Enter a valid price");
    if (!inventory || isNaN(inventory) || Number(inventory) < 0) return toast.error("Enter a valid inventory count");
    if (!image.trim()) return toast.error("Product image URL is required");
    if (!categoryId) return toast.error("Please select a category");

    // Check if image URL is valid
    const isValidUrl = (url) => /^(ftp|http|https):\/\/[^ "]+$/.test(url);
    if (image && !isValidUrl(image)) return toast.error("Enter a valid image URL");

    return true;
  };

  // 🔹 Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const token = await getToken();
      if (!token) {
        navigate("/login"); // Redirect to login page if no token
        return;
      }
      await createProduct({
        data: {
          ...productData,
          price: Number(productData.price),
          inventory: Number(productData.inventory),
        },
        token,
      }).unwrap();

      toast.success("Product created successfully!");
      navigate("/shop");
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error(error?.data?.message || "Failed to create product");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCategoriesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return <p>No categories available. Please add categories first.</p>;
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Create New Product</h1>
        <Button variant="outline" onClick={() => navigate("/shop")}>Cancel</Button>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Product Name</label>
            <Input name="name" value={productData.name} onChange={handleInputChange} placeholder="Enter product name" required />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Textarea name="description" value={productData.description} onChange={handleInputChange} placeholder="Enter product description" required className="min-h-[100px]" />
          </div>

          {/* Price & Inventory */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Price ($)</label>
              <Input
                type="number"
                name="price"
                value={productData.price}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
              {(!productData.price || isNaN(productData.price) || Number(productData.price) <= 0) && (
                <p className="text-red-500 text-sm">Please enter a valid price</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Inventory</label>
              <Input
                type="number"
                name="inventory"
                value={productData.inventory}
                onChange={handleInputChange}
                placeholder="0"
                min="0"
                required
              />
              {(!productData.inventory || isNaN(productData.inventory) || Number(productData.inventory) < 0) && (
                <p className="text-red-500 text-sm">Please enter a valid inventory count</p>
              )}
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium mb-1">Image URL</label>
            <Input name="image" value={productData.image} onChange={handleInputChange} placeholder="Enter image URL" required />
            {!productData.image.trim() && (
              <p className="text-red-500 text-sm">Product image URL is required</p>
            )}
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <Select value={productData.categoryId} onValueChange={handleCategoryChange} required disabled={isCategoriesLoading}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((category) => (
                  <SelectItem key={category._id} value={category._id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!productData.categoryId && (
              <p className="text-red-500 text-sm">Please select a category</p>
            )}
          </div>

          {/* Image Preview */}
          {productData.image && (
            <div>
              <label className="block text-sm font-medium mb-1">Image Preview</label>
              <div className="mt-2 border rounded-lg overflow-hidden w-48 h-48">
                <img
                  src={productData.image}
                  alt="Product preview"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.src = "/placeholder.svg";
                    toast.error("Failed to load image preview");
                  }}
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Product"}
          </Button>
        </form>
      </Card>
    </main>
  );
}

export default AdminProductCreatePage;
