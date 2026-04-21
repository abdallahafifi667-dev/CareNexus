const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seedPosts(users, categories) {
  console.log("📝 Seeding Posts, Comments, and Likes...");

  const doctor = users.find(u => u.role === 'doctor');
  const patient = users.find(u => u.role === 'patient');
  const nurse = users.find(u => u.role === 'nursing');

  const samplePosts = [
    {
      title: "أحدث تقنيات الجراحة الرقمية في 2026",
      description: "نستعرض اليوم كيف تساهم التكنولوجيا في تحسين دقة العمليات الجراحية وتقليل وقت الاستشفاء للمرضى بشكل ملحوظ.",
      image: "https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=1000",
      userId: doctor.id,
      category: categories.find((c) => c.text === "Surgery").id,
    },
    {
      title: "دليلك الشامل للصحة النفسية والبدنية",
      description: "التوازن بين العقل والجسد هو مفتاح الحياة السعيدة. إليكم 5 نصائح يومية للحفاظ على نشاطكم الذهني والبدني.",
      image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1000",
      userId: doctor.id,
      category: categories.find((c) => c.text === "General Health").id,
    }
  ];

  for (const postData of samplePosts) {
    let post = await prisma.post.findFirst({
      where: { title: postData.title, userId: postData.userId },
    });

    if (!post) {
      post = await prisma.post.create({
        data: {
          title: postData.title,
          description: postData.description,
          image: postData.image,
          userId: postData.userId,
          category: postData.category,
          allowComments: true,
        },
      });
      console.log(`✅ Created post: ${post.title}`);
    }

    // Seed Comments
    const existingComment = await prisma.comment.findFirst({
      where: { postId: post.id, userId: patient.id }
    });

    if (!existingComment) {
      await prisma.comment.create({
        data: {
          text: "مقال رائع جداً وشكراً على المعلومات القيمة!",
          postId: post.id,
          userId: patient.id
        }
      });
      console.log(`💬 Added comment to post: ${post.title}`);
    }

    // Seed Likes/Reactions
    const reactionTargets = [
      { user: nurse, type: "like" },
      { user: patient, type: "heart" },
      { user: doctor, type: "haha" }
    ];

    for (const target of reactionTargets) {
      if (!target.user) continue;
      
      const existingLike = await prisma.postLike.findUnique({
        where: { postId_userId: { postId: post.id, userId: target.user.id } }
      });

      if (!existingLike) {
        await prisma.postLike.create({
          data: {
            postId: post.id,
            userId: target.user.id,
            reactionType: target.type
          }
        });
        console.log(`❤️ Added ${target.type} reaction to post: ${post.title}`);
      }
    }
  }
}

module.exports = seedPosts;
