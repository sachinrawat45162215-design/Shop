const products = [
  // Fruits
  {
    id: 1,
    name: "Red Gala Apples",
    category: "fruits",
    price: 120,
    unit: "per kg",
    rating: 4.8,
    reviews: 124,
    image: "🍎",
    description: "Crisp, sweet, and locally grown organic Gala apples.",
    inStock: true,
    badge: "Organic"
  },
  {
    id: 2,
    name: "Cavendish Bananas",
    category: "fruits",
    price: 60,
    unit: "per dozen",
    rating: 4.5,
    reviews: 89,
    image: "🍌",
    description: "Perfectly ripe and sweet Cavendish bananas.",
    inStock: true,
    badge: "Best Seller"
  },
  {
    id: 3,
    name: "Alphonso Mangoes",
    category: "fruits",
    price: 350,
    unit: "per kg",
    rating: 4.9,
    reviews: 210,
    image: "🥭",
    description: "Premium quality Alphonso mangoes, rich and sweet.",
    inStock: true,
    badge: "Seasonal"
  },
  {
    id: 4,
    name: "Fresh Strawberries",
    category: "fruits",
    price: 180,
    unit: "pack of 250g",
    rating: 4.7,
    reviews: 75,
    image: "🍓",
    description: "Plump, sweet, and juicy handpicked strawberries.",
    inStock: true,
    badge: ""
  },

  // Vegetables
  {
    id: 5,
    name: "Roma Tomatoes",
    category: "vegetables",
    price: 40,
    unit: "per kg",
    rating: 4.6,
    reviews: 142,
    image: "🍅",
    description: "Firm, red Roma tomatoes, perfect for cooking or salads.",
    inStock: true,
    badge: ""
  },
  {
    id: 6,
    name: "Organic Spinach",
    category: "vegetables",
    price: 30,
    unit: "per bunch",
    rating: 4.8,
    reviews: 93,
    image: "🥬",
    description: "Freshly harvested, pesticide-free green spinach leaves.",
    inStock: true,
    badge: "Organic"
  },
  {
    id: 7,
    name: "Sweet Orange Carrots",
    category: "vegetables",
    price: 50,
    unit: "per kg",
    rating: 4.4,
    reviews: 64,
    image: "🥕",
    description: "Crisp and sweet carrots, rich in Beta-Carotene.",
    inStock: true,
    badge: ""
  },
  {
    id: 8,
    name: "Fresh Broccoli",
    category: "vegetables",
    price: 90,
    unit: "per piece",
    rating: 4.7,
    reviews: 108,
    image: "🥦",
    description: "Nutritious, high-fiber fresh broccoli crowns.",
    inStock: true,
    badge: ""
  },

  // Dairy & Eggs
  {
    id: 9,
    name: "Whole Farm Milk",
    category: "dairy",
    price: 65,
    unit: "1 Litre",
    rating: 4.8,
    reviews: 312,
    image: "🥛",
    description: "Fresh, pasteurized whole milk from local dairy farms.",
    inStock: true,
    badge: "Fresh"
  },
  {
    id: 10,
    name: "Free Range Eggs",
    category: "dairy",
    price: 95,
    unit: "pack of 12",
    rating: 4.9,
    reviews: 185,
    image: "🥚",
    description: "Farm fresh, free-range brown eggs rich in protein.",
    inStock: true,
    badge: "Popular"
  },
  {
    id: 11,
    name: "Salted Butter",
    category: "dairy",
    price: 110,
    unit: "200g pack",
    rating: 4.7,
    reviews: 143,
    image: "🧈",
    description: "Creamy, salted butter churned from fresh cow milk.",
    inStock: true,
    badge: ""
  },
  {
    id: 12,
    name: "Cheddar Cheese Block",
    category: "dairy",
    price: 240,
    unit: "250g pack",
    rating: 4.6,
    reviews: 97,
    image: "🧀",
    description: "Mildly sharp white cheddar cheese, aged to perfection.",
    inStock: false,
    badge: "Out of Stock"
  },

  // Bakery
  {
    id: 13,
    name: "Artisan Sourdough Bread",
    category: "bakery",
    price: 150,
    unit: "per loaf",
    rating: 4.9,
    reviews: 88,
    image: "🍞",
    description: "Freshly baked sourdough loaf with a crispy, golden crust.",
    inStock: true,
    badge: "Freshly Baked"
  },
  {
    id: 14,
    name: "Butter Croissants",
    category: "bakery",
    price: 120,
    unit: "pack of 4",
    rating: 4.7,
    reviews: 102,
    image: "🥐",
    description: "Flaky, buttery French-style croissants.",
    inStock: true,
    badge: "Freshly Baked"
  },

  // Beverages & Pantry
  {
    id: 15,
    name: "Cold Brew Coffee",
    category: "pantry",
    price: 180,
    unit: "500ml bottle",
    rating: 4.8,
    reviews: 115,
    image: "☕",
    description: "Smooth, low-acid cold brewed black coffee.",
    inStock: true,
    badge: "New"
  },
  {
    id: 16,
    name: "Extra Virgin Olive Oil",
    category: "pantry",
    price: 680,
    unit: "500ml",
    rating: 4.9,
    reviews: 138,
    image: "🫒",
    description: "First cold-pressed extra virgin olive oil from Spain.",
    inStock: true,
    badge: "Premium"
  },
  {
    id: 17,
    name: "Pure Clover Honey",
    category: "pantry",
    price: 290,
    unit: "350g squeeze bottle",
    rating: 4.8,
    reviews: 160,
    image: "🍯",
    description: "100% pure, unfiltered clover honey.",
    inStock: true,
    badge: ""
  }
];

// Export standard for clean file linking and global access
if (typeof module !== 'undefined' && module.exports) {
  module.exports = products;
}
