const products = [
  {
    name: "Wireless Headphones Pro",
    price: 99.99,
    description: "High-quality wireless headphones with noise cancellation",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
    categoryId: "electronics",
    inventory: 5
  },
  {
    name: "Smart Watch Series X",
    price: 199.99,
    description: "Advanced smartwatch with health tracking features",
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500",
    categoryId: "electronics",
    inventory: 5
  },
  {
    name: "Power Bank 10000mAh",
    price: 49.99,
    description: "Portable power bank for charging devices on the go",
    image: "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=500",
    categoryId: "electronics",
    inventory: 5
  },
  {
    name: "Bluetooth Speaker Mini",
    price: 79.99,
    description: "Compact wireless speaker with premium sound",
    image: "https://images.unsplash.com/photo-1545454675-3531b5430135?w=500",
    categoryId: "electronics",
    inventory: 5
  },
  {
    name: "Smart LED Bulb",
    price: 29.99,
    description: "WiFi-enabled smart bulb with color control",
    image: "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=500",
    categoryId: "electronics",
    inventory: 5
  },
  {
    name: "Gaming Mouse RGB",
    price: 59.99,
    description: "Ergonomic gaming mouse with RGB lighting",
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=500",
    categoryId: "electronics",
    inventory: 5
  },
  {
    name: "Fitness Tracker Band",
    price: 89.99,
    description: "Water-resistant fitness tracker with heart rate monitor",
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500",
    categoryId: "electronics",
    inventory: 5
  },
  {
    name: "USB-C Hub",
    price: 39.99,
    description: "Multi-port USB-C hub for laptop connectivity",
    image: "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=500",
    categoryId: "electronics",
    inventory: 5
  },
  {
    name: "Denim Jacket Classic",
    price: 79.99,
    description: "Classic fit denim jacket with modern styling",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500",
    categoryId: "clothing",
    inventory: 5
  },
  {
    name: "Organic Cotton T-Shirt",
    price: 24.99,
    description: "Comfortable organic cotton t-shirt in various colors",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
    categoryId: "clothing",
    inventory: 5
  },
  {
    name: "Cotton Socks Pack",
    price: 19.99,
    description: "Pack of 6 comfortable cotton socks",
    image: "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=500",
    categoryId: "clothing",
    inventory: 5
  },
  {
    name: "Classic White Sneakers",
    price: 89.99,
    description: "Versatile white sneakers for everyday wear",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
    categoryId: "shoes",
    inventory: 5
  },
  {
    name: "Running Shoes Pro",
    price: 129.99,
    description: "Professional running shoes with cushioning",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
    categoryId: "shoes",
    inventory: 5
  },
  {
    name: "Leather Laptop Backpack",
    price: 149.99,
    description: "Stylish leather backpack with laptop compartment",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
    categoryId: "accessories",
    inventory: 5
  },
  {
    name: "Leather Wallet",
    price: 49.99,
    description: "Genuine leather wallet with multiple card slots",
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500",
    categoryId: "accessories",
    inventory: 5
  },
  {
    name: "Coffee Maker Pro",
    price: 129.99,
    description: "Programmable coffee maker with thermal carafe",
    image: "https://images.unsplash.com/photo-1517663156590-b82429dadd9a?w=500",
    categoryId: "home",
    inventory: 5
  },
  {
    name: "Coffee Grinder",
    price: 39.99,
    description: "Electric coffee grinder with adjustable settings",
    image: "https://images.unsplash.com/photo-1517663156590-b82429dadd9a?w=500",
    categoryId: "home",
    inventory: 5
  },
  {
    name: "Ergonomic Desk Chair",
    price: 199.99,
    description: "Comfortable office chair with lumbar support",
    image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=500",
    categoryId: "home",
    inventory: 5
  },
  {
    name: "Yoga Mat Premium",
    price: 49.99,
    description: "Non-slip yoga mat with carrying strap",
    image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=500",
    categoryId: "sports",
    inventory: 5
  },
  {
    name: "Basketball Pro",
    price: 29.99,
    description: "Indoor/outdoor basketball with premium grip",
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500",
    categoryId: "sports",
    inventory: 5
  }
];

const addProducts = async () => {
  try {
    for (const product of products) {
      const response = await fetch('http://localhost:8000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product)
      });

      if (!response.ok) {
        throw new Error(`Failed to add product: ${product.name}`);
      }

      const data = await response.json();
      console.log(`Added product: ${product.name} (ID: ${data._id})`);
    }

    console.log('All products added successfully!');
  } catch (error) {
    console.error('Error adding products:', error);
  }
};

export { addProducts }; 