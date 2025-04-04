const categories = [
  {
    name: "Electronics",
    description: "Electronic devices and accessories"
  },
  {
    name: "Clothing",
    description: "Fashion items and apparel"
  },
  {
    name: "Shoes",
    description: "Footwear for all occasions"
  },
  {
    name: "Accessories",
    description: "Various accessories and personal items"
  },
  {
    name: "Home",
    description: "Home and kitchen items"
  },
  {
    name: "Sports",
    description: "Sports equipment and accessories"
  }
];

const addCategories = async () => {
  try {
    for (const category of categories) {
      const response = await fetch('http://localhost:8000/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(category)
      });

      if (!response.ok) {
        throw new Error(`Failed to add category: ${category.name}`);
      }

      const data = await response.json();
      console.log(`Added category: ${category.name} (ID: ${data._id})`);
    }

    console.log('All categories added successfully!');
  } catch (error) {
    console.error('Error adding categories:', error);
  }
};

export { addCategories }; 