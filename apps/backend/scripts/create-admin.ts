import { db } from '../src/db';
import { users, type NewUser } from '../src/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

async function createAdminUser() {
  try {
    const email = 'admin@localhost.com';
    const name = 'admin';
    const password = 'Admin@123'; // Strong default password
    const role = 'admin';

    // Check if admin already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (existingUser.length > 0) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUserData: NewUser = {
      email,
      password: hashedPassword,
      name,
      role,
    };

    // Create admin user
    const [newUser] = await db.insert(users).values(newUserData).returning({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
    });

    console.log('Admin user created successfully:', newUser);
    console.log('Password:', password); // Display password only during creation
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }

  process.exit(0);
}

createAdminUser();
