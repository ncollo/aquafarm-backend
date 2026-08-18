import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = `${process.env.DATABASE_URL}`;

// Initialize a connection pool
const pool = new Pool({ connectionString });

// Pass the pool to the Prisma adapter
const adapter = new PrismaPg(pool);

// Instantiate Prisma with the adapter
const prisma = new PrismaClient({ adapter });

export default prisma;