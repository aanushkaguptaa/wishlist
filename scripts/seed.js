import { connectToDatabase } from '../lib/mongodb.js';
import bcrypt from 'bcryptjs';

const users = [
  {
    username: 'Anand',
    password: 'gfevbueyr',
    displayName: 'Anand'
  },
  {
    username: 'Akanksha', 
    password: 'fghvweruy23',
    displayName: 'Akanksha'
  },
  {
    username: 'Babita',
    password: 'ygdufwyegd',
    displayName: 'Babita'
  },
  {
    username: 'Pinky',
    password: 'yufygeru3y', 
    displayName: 'Pinky'
  },
  {
    username: 'Saloni',
    password: 'iuhrfweiuf', 
    displayName: 'Saloni'
  },
  {
    username: 'Aarya',
    password: 'fyewbhfuherb3', 
    displayName: 'Aarya'
  },
  {
    username: 'Silkey',
    password: 'uirfhbiewh', 
    displayName: 'Silkey'
  },
  {
    username: 'Shreya',
    password: 'fhbeuhyfbhhf9', 
    displayName: 'Shreya'
  },
  {
    username: 'Vrinda',
    password: 'ruihf3b32hef', 
    displayName: 'Vrinda'
  },
  {
    username: 'Vihaan',
    password: 'ifhviu3hfr', 
    displayName: 'Vihaan'
  },
  {
    username: 'Aarav',
    password: 'yufbguy4gu', 
    displayName: 'Aarav'
  },{
    username: 'Anu',
    password: 'iywbdwuhybfu', 
    displayName: 'Anu'
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seed...');
    
    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await usersCollection.deleteMany({});

    // Create users with hashed passwords
    console.log('👥 Creating users...');
    const hashedUsers = await Promise.all(
      users.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10),
        wishlist: [],
        selectedItems: [],
        createdAt: new Date()
      }))
    );

    const userResult = await usersCollection.insertMany(hashedUsers);
    console.log(`✅ Created ${Object.keys(userResult.insertedIds).length} users`);

    console.log('🎉 Database seeded successfully!');
    console.log('\n📋 Created users:');
    users.forEach(user => {
      console.log(`  • ${user.username} (${user.displayName}) - password: ${user.password}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}


seedDatabase();