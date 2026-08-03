import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Clear existing data
  await prisma.orderItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // 1. Create a dummy Farmer User
  const farmer = await prisma.user.create({
    data: {
      email: 'farmer@shanland.com',
      name: 'Shan Fresh Organics',
    },
  });

  // 2. Create Sample Products
  await prisma.product.createMany({
    data: [
      {
        title: 'Organic Heirloom Tomatoes',
        description: 'Freshly harvested organic tomatoes from Shan Hills.',
        price: 4.5,
        unit: 'kg',
        stock: 500,
        season: 'Monsoon',
        farmerId: farmer.id,
      },
      {
        title: 'Crisp Romaine Lettuce',
        description: 'Hydroponically grown pesticide-free crisp lettuce.',
        price: 3.0,
        unit: 'kg',
        stock: 200,
        season: 'Winter',
        farmerId: farmer.id,
      },
      {
        title: 'Sweet Honey Strawberries',
        description: 'Sweet and juicy strawberries grown in Pyin Oo Lwin.',
        price: 8.0,
        unit: 'box',
        stock: 50,
        season: 'Winter',
        farmerId: farmer.id,
      },
      {
        title: 'Bulk Red Onions',
        description: 'Premium quality red onions for restaurant bulk purchasing.',
        price: 1.8,
        unit: 'kg',
        stock: 1200,
        season: 'Summer',
        farmerId: farmer.id,
      },
    ],
  });

  console.log('Seed data inserted successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });