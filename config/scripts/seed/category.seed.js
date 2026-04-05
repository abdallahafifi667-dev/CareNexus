const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seedCategories(adminId) {
  console.log("📂 Seeding Categories...");

  const categories = [
    { text: "General Health", type: "blog", roles: [] },
    { text: "Surgery", type: "blog", roles: ["doctor", "nursing"] },
    { text: "Pharmacology", type: "blog", roles: ["pharmacy"] },
    { text: "Patient Care", type: "blog", roles: ["nursing", "patient"] },
    {
      text: "Medical Supplies",
      type: "ecommerce",
      roles: ["pharmacy", "doctor"],
    },
    { text: "OTC Medicine", type: "ecommerce", roles: ["pharmacy", "patient"] },
    { text: "Fitness", type: "blog", roles: ["patient"] },
  ];

  const created = [];

  for (const cat of categories) {
    // Check if exists
    const existing = await prisma.category.findFirst({
      where: { text: cat.text, type: cat.type },
    });

    if (existing) {
      console.log(`ℹ️  Category ${cat.text} already exists.`);
      created.push(existing);
      continue;
    }

    const newCat = await prisma.category.create({
      data: {
        text: cat.text,
        type: cat.type,
        roles: cat.roles,
        userId: adminId,
      },
    });

    console.log(`✅ Created category: ${cat.text} (${cat.type})`);
    created.push(newCat);
  }

  return created;
}

if (require.main === module) {
  // Try to find an admin user first
  prisma.user
    .findFirst({ where: { role: "admin" } })
    .then((admin) => {
      if (!admin)
        throw new Error("Admin user not found. Please seed users first.");
      return seedCategories(admin.id);
    })
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

module.exports = seedCategories;
