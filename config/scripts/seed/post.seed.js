const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seedPosts(users, categories) {
  console.log("📝 Seeding Posts with attractive data...");

  const samplePosts = [
    {
      title: "أحدث تقنيات الجراحة الرقمية في 2026",
      description: "نستعرض اليوم كيف تساهم التكنولوجيا في تحسين دقة العمليات الجراحية وتقليل وقت الاستشفاء للمرضى بشكل ملحوظ.",
      image: "https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=1000",
      userId: users.find(u => u.role === 'doctor').id,
      category: categories.find((c) => c.text === "Surgery").id,
    },
    {
      title: "دليلك الشامل للصحة النفسية والبدنية",
      description: "التوازن بين العقل والجسد هو مفتاح الحياة السعيدة. إليكم 5 نصائح يومية للحفاظ على نشاطكم الذهني والبدني.",
      image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1000",
      userId: users.find(u => u.role === 'doctor').id,
      category: categories.find((c) => c.text === "General Health").id,
    },
    {
      title: "أهمية الرعاية التمريضية المنزلية",
      description: "التمريض ليس مجرد وظيفة، بل هو رسالة إنسانية. الرعاية المنزلية توفر للمريض الراحة النفسية اللازمة للتعافي.",
      image: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?q=80&w=1000",
      userId: users.find(u => u.role === 'nursing').id,
      category: categories.find((c) => c.text === "Patient Care").id,
    },
    {
      title: "مستقبل الصيدلة والتركيبات الدوائية",
      description: "كيف تطورت الأدوية في العصر الحديث وكيف يمكن للصيدلي أن يكون المستشار الأول لصحة المريض.",
      image: "https://images.unsplash.com/photo-1587854692152-cbe660dbbb88?q=80&w=1000",
      userId: users.find(u => u.role === 'pharmacy').id,
      category: categories.find((c) => c.text === "Pharmacology").id,
    }
  ];

  for (const post of samplePosts) {
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
        image: post.image,
        userId: post.userId,
        category: post.category,
        allowComments: true,
      },
    });

    console.log(`✅ Created attractive post: ${post.title}`);
  }
}

module.exports = seedPosts;
