import mongoose from 'mongoose';
import Product from './models/Product.js';
import Category from './models/Category.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI ||
  process.env.MONGODB_URL ||
  process.env.MONGO_URL ||
  'mongodb://localhost:27017/villagecommunity';

const seedData = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to DB for seeding...');

    await Product.deleteMany({});
    await Category.deleteMany({});

    const categories = [
      { name: 'Vegetables', icon: 'fas fa-carrot' },
      { name: 'Fruits', icon: 'fas fa-apple-alt' },
      { name: 'Dairy products', icon: 'fas fa-cheese' },
      { name: 'Grains', icon: 'fas fa-seedling' },
      { name: 'Handicrafts', icon: 'fas fa-hammer' },
      { name: 'Homemade items', icon: 'fas fa-jar' }
    ];
    await Category.insertMany(categories);

    const products = [
      { name: "Organic Farm Tomatoes", price: 40, description: "Fresh, pesticide-free tomatoes direct from local farms.", image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&q=80", sellerName: "Raju K.", category: "Vegetables" },
      { name: "Fresh Spinach (Palak)", price: 20, description: "Leafy green spinach packed with iron.", image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800&q=80", sellerName: "Lakshmi M.", category: "Vegetables" },
      { name: "Organic Potatoes", price: 30, description: "Freshly harvested organic potatoes.", image: "https://images.unsplash.com/photo-1518977676601-b53f02ac6d31?w=800&q=80", sellerName: "Somayya", category: "Vegetables" },
      { name: "Red Onions", price: 25, description: "Crisp and pungent red onions.", image: "https://images.unsplash.com/photo-1508747703725-719777637510?w=800&q=80", sellerName: "Lakshmi M.", category: "Vegetables" },
      { name: "Alphonso Mangoes", price: 300, description: "Sweet and juicy seasonal mangoes.", image: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=800&q=80", sellerName: "Mango Orchards", category: "Fruits" },
      { name: "Village Bananas", price: 50, description: "Organic yellow bananas.", image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800&q=80", sellerName: "Sivayya", category: "Fruits" },
      { name: "Pure Cow Ghee", price: 650, description: "Traditional A2 cow ghee made using the Bilona method.", image: "https://images.unsplash.com/photo-1596733430284-f7437764b1a9?w=800&q=80", sellerName: "Desi Dairy", category: "Dairy products" },
      { name: "Fresh Paneer", price: 150, description: "Soft malai paneer packed fresh daily.", image: "https://images.unsplash.com/photo-1631452180519-c014f36473be?w=800&q=80", sellerName: "Village Milk Co.", category: "Dairy products" },
      { name: "Fresh Buffalo Milk", price: 60, description: "Pure, thick buffalo milk delivered daily.", image: "https://images.unsplash.com/photo-1550583724-125581cc25fb?w=800&q=80", sellerName: "Desi Dairy", category: "Dairy products" },
      { name: "Hand-churned White Butter", price: 200, description: "Fresh white butter made from buffalo milk.", image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=800&q=80", sellerName: "Grandma's Kitchen", category: "Dairy products" },
      { name: "Unpolished Brown Rice", price: 80, description: "Healthy fiber-rich brown rice.", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80", sellerName: "Annapurna Farms", category: "Grains" },
      { name: "Organic Wheat Grains", price: 45, description: "High quality wheat direct from harvest.", image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&q=80", sellerName: "Annapurna Farms", category: "Grains" },
      { name: "Clay Water Pot (Matka)", price: 250, description: "Natural cooling clay pot with tap.", image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&q=80", sellerName: "Kumar Potters", category: "Handicrafts" },
      { name: "Handwoven Bamboo Basket", price: 150, description: "Durable multipurpose bamboo basket.", image: "https://images.unsplash.com/photo-1614088832962-d4b79bba97b1?w=800&q=80", sellerName: "Sita Crafts", category: "Handicrafts" },
      { name: "Homemade Mango Pickle", price: 180, description: "Spicy traditional village avakaya.", image: "https://images.unsplash.com/photo-1627914364024-5d5d9c28bf06?w=800&q=80", sellerName: "Grandma's Kitchen", category: "Homemade items" },
      { name: "Wild Forest Honey", price: 400, description: "Pure raw honey collected by local tribes.", image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&q=80", sellerName: "Tribal Co-op", category: "Homemade items" },
      { name: "Natural Jaggery", price: 120, description: "Pure chemical-free sugarcane jaggery blocks.", image: "https://images.unsplash.com/photo-1614735241165-6756e1df61ab?w=800&q=80", sellerName: "Sugar Mill", category: "Homemade items" },
      { name: "Organic Turmeric Powder", price: 90, description: "Stone-ground turmeric with high curcumin content.", image: "https://images.unsplash.com/photo-1615485242231-973f5a109765?w=800&q=80", sellerName: "Spice Garden", category: "Homemade items" },
      { name: "Handmade Neem Soap", price: 60, description: "Natural soap with anti-bacterial neem properties.", image: "https://images.unsplash.com/photo-1600857062241-98e5dba7f214?w=800&q=80", sellerName: "Herbal Care", category: "Homemade items" }
    ];
    await Product.insertMany(products);

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
