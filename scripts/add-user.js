import { connectToDatabase } from '../../lib/mongodb.js';
import bcrypt from 'bcryptjs';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

function hiddenQuestion(prompt) {
  return new Promise((resolve) => {
    process.stdout.write(prompt);
    process.stdin.setRawMode(true);
    process.stdin.resume();
    
    let password = '';
    process.stdin.on('data', function(char) {
      char = char + '';
      
      switch (char) {
        case '\n':
        case '\r':
        case '\u0004':
          process.stdin.setRawMode(false);
          process.stdin.pause();
          process.stdout.write('\n');
          resolve(password);
          break;
        case '\u0003':
          process.exit();
          break;
        case '\u007f': // backspace
          if (password.length > 0) {
            password = password.slice(0, -1);
            process.stdout.write('\b \b');
          }
          break;
        default:
          password += char;
          process.stdout.write('*');
          break;
      }
    });
  });
}

async function addUser() {
  try {
    console.log('👤 Add New User to Wishlist App\n');

    const username = await question('Username: ');
    
    if (!username.trim()) {
      console.log('❌ Username cannot be empty');
      rl.close();
      return;
    }

    const displayName = await question('Display Name (optional): ');
    const password = await hiddenQuestion('Password: ');
    
    if (!password.trim()) {
      console.log('❌ Password cannot be empty');
      rl.close();
      return;
    }

    const confirmPassword = await hiddenQuestion('Confirm Password: ');
    
    if (password !== confirmPassword) {
      console.log('❌ Passwords do not match');
      rl.close();
      return;
    }

    console.log('\n🔄 Creating user...');

    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ username: username.trim() });
    if (existingUser) {
      console.log('❌ Username already exists');
      rl.close();
      return;
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = {
      username: username.trim(),
      displayName: displayName.trim() || username.trim(),
      password: hashedPassword,
      wishlist: [],
      selectedItems: [],
      createdAt: new Date()
    };

    await usersCollection.insertOne(newUser);

    console.log('✅ User created successfully!');
    console.log(`   Username: ${newUser.username}`);
    console.log(`   Display Name: ${newUser.displayName}`);
    
    rl.close();
  } catch (error) {
    console.error('❌ Error creating user:', error);
    rl.close();
  }
}

// Run the add user function
addUser();