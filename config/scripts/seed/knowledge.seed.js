const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seedKnowledge(adminId) {
  console.log("📚 Seeding Knowledge Articles...");

  const articles = [
    {
      title: "كيفية التعامل مع حالات الطوارئ المنزلية",
      content: "في هذا المقال سنتعرف على الخطوات الأساسية للإسعافات الأولية التي يجب اتباعها في المنزل لحين وصول الطبيب...",
      category: "First Aid",
      tags: ["Emergency", "Home Care"],
      language: "ar",
      authorId: adminId
    },
    {
      title: "أهمية التطعيمات للأطفال في السنوات الأولى",
      content: "التطعيمات هي الدرع الواقي للطفل من الأمراض المعدية. سنعرض لكم جدول التطعيمات المعتمد من وزارة الصحة...",
      category: "Pediatrics",
      tags: ["Vaccination", "Children"],
      language: "ar",
      authorId: adminId
    }
  ];

  for (const art of articles) {
    const existing = await prisma.knowledgeArticle.findFirst({
      where: { title: art.title }
    });

    if (!existing) {
      await prisma.knowledgeArticle.create({ data: art });
      console.log(`✅ Created knowledge article: ${art.title}`);
    }
  }
}

module.exports = seedKnowledge;
