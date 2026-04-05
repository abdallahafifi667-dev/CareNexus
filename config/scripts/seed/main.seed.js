const { PrismaClient } = require("@prisma/client");
const seedUsers = require("./user.seed");
const seedCategories = require("./category.seed");
const seedPosts = require("./post.seed");
const seedProducts = require("./product.seed");
const seedOrders = require("./order.seed");

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Starting Full Database Seeding...");

  try {
    // 1. Seed Users (Base for everything)
    const users = await seedUsers();
    const admin = users.find(u => u.role === 'admin');
    const patients = users.filter(u => u.role === 'patient');
    const doctors = users.filter(u => u.role === 'doctor');
    const nurses = users.filter(u => u.role === 'nursing');
    const pharmacies = users.filter(u => u.role === 'pharmacy');

    // 2. Seed Categories (Requires an admin)
    const categories = await seedCategories(admin.id);
    const blogCats = categories.filter(c => c.type === 'blog');
    const ecomCats = categories.filter(c => c.type === 'ecommerce');

    // 3. Seed Posts (Requires users and categories)
    await seedPosts(users, blogCats);

    // 4. Seed Products (Requires pharmacy users and ecommerce categories)
    await seedProducts(pharmacies, ecomCats);

    // 5. Seed Service Orders (Requires patients and providers)
    await seedOrders(patients, [...doctors, ...nurses]);

    console.log("\n✨ Database seeding completed successfully!");
  } catch (error) {
    console.error("\n❌ Seeding failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
