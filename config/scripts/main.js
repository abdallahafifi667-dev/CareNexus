const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const seedUsers = require("./seed/user.seed");
const seedCategories = require("./seed/category.seed");
const seedPosts = require("./seed/post.seed");
const seedProducts = require("./seed/product.seed");
const seedOrders = require("./seed/order.seed");

async function main() {
  console.log("🚀 Starting Comprehensive Database Seeding...");

  try {
    // 1. Seed Users (Core)
    const users = await seedUsers();
    console.log("✅ Users seeding complete.");

    const admin = users.find((u) => u.role === "admin");
    const pharmacyUsers = users.filter((u) => u.role === "pharmacy");
    const patients = users.filter((u) => u.role === "patient");
    const providers = users.filter(
      (u) => u.role === "doctor" || u.role === "nursing",
    );

    // 2. Seed Categories (Needs admin ID)
    const categories = await seedCategories(admin.id);
    console.log("✅ Categories seeding complete.");

    // 3. Seed Posts (Needs users and categories)
    const blogCategories = categories.filter((c) => c.type === "blog");
    await seedPosts(users, blogCategories);
    console.log("✅ Posts seeding complete.");

    // 4. Seed Products (Needs pharmacy users and ecommerce categories)
    const ecommerceCategories = categories.filter(
      (c) => c.type === "ecommerce",
    );
    await seedProducts(pharmacyUsers, ecommerceCategories);
    console.log("✅ Products seeding complete.");

    // 5. Seed Service Orders (Needs patients and providers)
    await seedOrders(patients, providers);
    console.log("✅ Service Orders seeding complete.");

    console.log("✨ All seeding tasks completed successfully!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
