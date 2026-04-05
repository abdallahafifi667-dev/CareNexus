const { PrismaClient } = require("@prisma/client");
const seedUsers = require("./user.seed");
const seedCategories = require("./category.seed");
const seedPosts = require("./post.seed");
const seedProducts = require("./product.seed");
const seedOrders = require("./order.seed");
const seedSocial = require("./social.seed");
const seedEcommerceOrders = require("./ecommerce_order.seed");
const seedKnowledge = require("./knowledge.seed");

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Starting Full Database Seeding (v2 - Comprehensive)...");

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

    // 3. Seed Posts, Comments, and Likes
    await seedPosts(users, blogCats);

    // 4. Seed Products
    await seedProducts(pharmacies, ecomCats);

    // Refresh products list for following steps
    const allProducts = await prisma.product.findMany();

    // 5. Seed Service Orders and Offers
    await seedOrders(patients, [...doctors, ...nurses]);

    // 6. Seed Social: Friendships and Medical Messages
    await seedSocial(users);

    // 7. Seed Ecommerce Orders and Reviews
    await seedEcommerceOrders(users, allProducts);

    // 8. Seed Knowledge Articles
    await seedKnowledge(admin.id);

    console.log("\n✨ Database seeding completed successfully with full schema coverage!");
  } catch (error) {
    console.error("\n❌ Seeding failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
