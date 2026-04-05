const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seedProducts(users, categories) {
  console.log("💊 Seeding Products with high-quality data...");

  const sampleProducts = [
    {
      name: "جهاز قياس ضغط الدم الرقمي",
      description: "جهاز احترافي عالي الدقة مزود بشاشة LCD كبيرة وسهلة القراءة.",
      price: 1250,
      image: "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?q=80&w=1000",
      category: categories.find((c) => c.text === "Medical Supplies").id,
      merchantId: users.find((u) => u.role === "pharmacy").id,
    },
    {
      name: "فيتامين سي 1000 مجم",
      description: "فوار لتعزيز المناعة وحماية الجسم من نزلات البرد (30 قرص).",
      price: 85,
      image: "https://images.unsplash.com/photo-1616671285410-0950be03914c?q=80&w=1000",
      category: categories.find((c) => c.text === "OTC Medicine").id,
      merchantId: users.find((u) => u.role === "pharmacy").id,
    },
    {
      name: "كمامات طبية معقمة (50 قطعة)",
      description: "كمامات 3 طبقات عالية الجودة مع حماية فائقة من البكتيريا.",
      price: 150,
      image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1000",
      category: categories.find((c) => c.text === "Medical Supplies").id,
      merchantId: users.find((u) => u.role === "pharmacy").id,
    },
    {
      name: "جهاز قياس السكر بالدم",
      description: "جهاز سريع وسهل الاستخدام مع 50 شريحة اختبار مجانية.",
      price: 950,
      image: "https://images.unsplash.com/photo-1603398938378-e54ecb44638c?q=80&w=1000",
      category: categories.find((c) => c.text === "Medical Supplies").id,
      merchantId: users.find((u) => u.role === "pharmacy").id,
    }
  ];

  for (const prod of sampleProducts) {
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
        imageUrl: [prod.image],
        categoryId: prod.category,
        merchantId: prod.merchantId,
      },
    });

    console.log(`✅ Created high-quality product: ${prod.name}`);
  }
}

module.exports = seedProducts;
