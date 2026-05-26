import 'dotenv/config'; // ✨ THIS IS THE MISSING LINK! It loads your .env file!
import { PrismaClient } from '@prisma/client';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// 1. Initialize a standard PostgreSQL connection pool using your cloud URL
const pool = new pg.Pool({ 
  connectionString: process.env.DATABASE_URL 
});

// 2. Wrap the pool in Prisma's driver adapter
const adapter = new PrismaPg(pool);

// 3. Pass the adapter into the PrismaClient constructor
const prisma = new PrismaClient({ adapter });

export default prisma;