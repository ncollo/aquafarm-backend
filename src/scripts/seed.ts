import dotenv from 'dotenv';
dotenv.config();

import { seedDefaultUsers } from '../config/seedUsers';
import { seedDefaultProducts } from '../config/seedProducts';
import prisma from '../config/prisma';

async function main() {
  console.log('--- Seeding Aquafarm Database ---');
  await seedDefaultUsers();
  await seedDefaultProducts();
  console.log('--- Seeding Completed Successfully! ---');
  await prisma.$disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error('Seeding failed:', err);
  prisma.$disconnect();
  process.exit(1);
});
