const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seedProducts(users, categories) {
  console.log("💊 Seeding Products...");

  const sampleProducts = [
    {
      name: "Surgical Mask",
      description: "3-layer protection masks (pack of 50)",
      price: 10,
      category: categories.find((c) => c.text === "Medical Supplies").id,
      merchantId: users.find((u) => u.role === "pharmacy").id,
    },
    {
      name: "Aspirin",
      description: "81mg low dose aspirin for cardiovascular health",
      price: 5,
      category: categories.find((c) => c.text === "OTC Medicine").id,
      merchantId: users.find((u) => u.role === "pharmacy").id,
    },
    {
      name: "Digital Thermometer",
      description: "Infrared non-contact digital thermometer",
      price: 25,
      category: categories.find((c) => c.text === "Medical Supplies").id,
      merchantId: users.find((u) => u.role === "pharmacy").id,
    },
  ];

  for (const prod of sampleProducts) {
    // Check if exists
    const existing = await prisma.product.findFirst({
      where: { name: prod.name, merchantId: prod.merchantId },
    });

    if (existing) {
      console.log(`ℹ️  Product "${prod.name}" already exists.`);
      continue;
    }

    await prisma.product.create({
      data: {
        name: prod.name,
        description: prod.description,
        price: prod.price,
        stockQuantity: 100,
        categoryId: prod.category,
        merchantId: prod.merchantId,
      },
    });

    console.log(`✅ Created product: ${prod.name}`);
  }
}

if (require.main === module) {
  // Find some users and categories first
  Promise.all([
    prisma.user.findMany({ where: { role: "pharmacy" } }),
    prisma.category.findMany({ where: { type: "ecommerce" } }),
  ])
    .then(([users, categories]) => {
      if (!users.length || !categories.length)
        throw new Error(
          "Pharmacy users or ecommerce categories not found. Seed them first.",
        );
      return seedProducts(users, categories);
    })
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

module.exports = seedProducts;
