import 'dotenv/config';
import { db } from '../src/db';
import { admins } from '../src/db/schema';
import bcrypt from 'bcryptjs';

async function seed() {
  const adminPassword = await bcrypt.hash('admin', 10);
  await db.insert(admins).values({
    username: 'admin',
    password: adminPassword,
  });
  console.log('Central admin credential safely installed in the admins table');
}

seed().catch(console.error);
