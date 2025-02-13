export const getProducts = async () => {
  try {
    const res = await fetch("http://localhost:8000/api/products", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const data = await res.json();

    
    return data;
  } catch (error) {
    console.error("Error while loading products:", error);
    return [];
  }
};


export const getCategories = async () => {
  try {
    const res = await fetch("http://localhost:8000/api/categories", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

  if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

  const data = await res.json();
  return [{ _id: "ALL", name: "ALL" }, ...data];
  } catch (error) {
    console.error("Error while loading categories", error);

    return [
      { _id: "ALL", name: "All" },
      { _id: "1", name: "Headphones" },
      { _id: "2", name: "Earbuds" },
      { _id: "3", name: "Speakers" },
      { _id: "4", name: "Smartphones" },
      { _id: "5", name: "Smartwatches" },
    ];
  }
};