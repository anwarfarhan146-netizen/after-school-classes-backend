require('dotenv').config();
const { MongoClient } = require('mongodb');

const sampleLessons = [
  {
    _id: 1,
    subject: "Mathematics",
    location: "Hendon",
    price: 100,
    space: 5,
    icon: "fas fa-calculator",
    description: "Learn advanced mathematics and problem-solving skills",
    image: "/images/math.jpg"
  },
  {
    _id: 2,
    subject: "Science",
    location: "Colindale",
    price: 120,
    space: 5,
    icon: "fas fa-flask",
    description: "Explore the wonders of science through experiments",
    image: "/images/science.jpg"
  },
  {
    _id: 3,
    subject: "English Literature",
    location: "Brent Cross",
    price: 90,
    space: 5,
    icon: "fas fa-book",
    description: "Discover classic and contemporary literature",
    image: "/images/english.jpg"
  },
  {
    _id: 4,
    subject: "Computer Science",
    location: "Golders Green",
    price: 150,
    space: 5,
    icon: "fas fa-laptop-code",
    description: "Learn programming and computer fundamentals",
    image: "/images/compsci.jpg"
  },
  {
    _id: 5,
    subject: "Art & Design",
    location: "Hendon",
    price: 80,
    space: 5,
    icon: "fas fa-palette",
    description: "Express creativity through various art forms",
    image: "/images/art.jpg"
  },
  {
    _id: 6,
    subject: "Music",
    location: "Colindale",
    price: 110,
    space: 5,
    icon: "fas fa-music",
    description: "Learn music theory and instrument skills",
    image: "/images/music.jpg"
  },
  {
    _id: 7,
    subject: "Drama & Theater",
    location: "Brent Cross",
    price: 95,
    space: 5,
    icon: "fas fa-theater-masks",
    description: "Develop acting skills and stage presence",
    image: "/images/drama.jpg"
  },
  {
    _id: 8,
    subject: "Sports & Fitness",
    location: "Golders Green",
    price: 70,
    space: 5,
    icon: "fas fa-running",
    description: "Stay active with various sports activities",
    image: "/images/sports.jpg"
  },
  {
    _id: 9,
    subject: "Languages",
    location: "Hendon",
    price: 130,
    space: 5,
    icon: "fas fa-language",
    description: "Learn new languages and cultural aspects",
    image: "/images/languages.jpg"
  },
  {
    _id: 10,
    subject: "Robotics",
    location: "Colindale",
    price: 200,
    space: 5,
    icon: "fas fa-robot",
    description: "Build and program robots with modern technology",
    image: "/images/robotics.jpg"
  },
  {
    _id: 11,
    subject: "Dance",
    location: "Brent Cross",
    price: 85,
    space: 5,
    icon: "fas fa-user-friends",
    description: "Learn various dance styles and techniques",
    image: "/images/dance.jpg"
  },
  {
    _id: 12,
    subject: "Cooking",
    location: "Golders Green",
    price: 125,
    space: 5,
    icon: "fas fa-utensils",
    description: "Master culinary skills and food preparation",
    image: "/images/cooking.jpg"
  }
];

async function populateDatabase() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    console.log('🔗 Connecting to MongoDB Atlas...');
    await client.connect();
    const database = client.db('after-school-classes');
    
    console.log('🗑️ Clearing existing collections...');
    await database.collection('lessons').deleteMany({});
    await database.collection('orders').deleteMany({});
    
    console.log('📝 Inserting sample lessons...');
    const result = await database.collection('lessons').insertMany(sampleLessons);
    console.log(`✅ Successfully inserted ${result.insertedCount} lessons!`);
    
    console.log('🎉 Database populated successfully!');
    console.log('📚 You can now access your data at:');
    console.log('   GET http://localhost:3000/lessons');
    
  } catch (error) {
    console.error('❌ Error populating database:', error);
  } finally {
    await client.close();
    console.log('📦 Database connection closed.');
  }
}

populateDatabase();