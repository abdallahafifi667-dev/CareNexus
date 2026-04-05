const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seedPosts(users, categories) {
  console.log("📝 Seeding Posts...");

  const samplePosts = [
    {
      title: "The Future of Digital Health",
      description: "Exploring how technology transforms patient care.",
      userId: users[0].id,
      category: categories.find((c) => c.text === "General Health").id,
    },
    {
      title: "Surgery Preparation Guide",
      description: "Essential tips for patients undergoing major surgery.",
      userId: users[1].id,
      category: categories.find((c) => c.text === "Surgery").id,
    },
    {
      title: "Understanding Antibiotics",
      description: "A comprehensive guide to antibiotic usage and resistance.",
      userId: users[3].id,
      category: categories.find((c) => c.text === "Pharmacology").id,
    },
    {
      title: "Nursing Best Practices",
      description: "How to maintain high standards of nursing care.",
      userId: users[2].id,
      category: categories.find((c) => c.text === "Patient Care").id,
    },
  ];

  for (const post of samplePosts) {
    // Check if exists
    const existing = await prisma.post.findFirst({
      where: { title: post.title, userId: post.userId },
    });

    if (existing) {
      console.log(`ℹ️  Post "${post.title}" already exists.`);
      continue;
    }

    await prisma.post.create({
      data: {
        title: post.title,
        description: post.description,
        userId: post.userId,
        category: post.category,
        allowComments: true,
      },
    });

    console.log(`✅ Created post: ${post.title}`);
  }
}

if (require.main === module) {
  // Find some users and categories first
  Promise.all([
    prisma.user.findMany({ take: 5 }),
    prisma.category.findMany({ where: { type: "blog" } }),
  ])
    .then(([users, categories]) => {
      if (!users.length || !categories.length)
        throw new Error("Users or categories not found. Seed them first.");
      return seedPosts(users, categories);
    })
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

module.exports = seedPosts;
