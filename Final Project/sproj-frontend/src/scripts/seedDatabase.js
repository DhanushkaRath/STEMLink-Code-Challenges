import { addCategories } from './addCategories.js';
import { addProducts } from './addProducts.js';

const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');
    
    // First add categories
    console.log('Adding categories...');
    await addCategories();
    
    // Then add products
    console.log('Adding products...');
    await addProducts();
    
    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

seedDatabase(); 