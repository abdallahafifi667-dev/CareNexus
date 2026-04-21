const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seedSocial(users) {
  console.log("🤝 Seeding Friendships and Medical Messages...");

  const doctor = users.find(u => u.role === 'doctor');
  const patient = users.find(u => u.role === 'patient');
  const nurse = users.find(u => u.role === 'nursing');

  // 1. Seed Friendships
  const friendshipData = [
    { requesterId: doctor.id, addresseeId: nurse.id, status: "accepted" },
    { requesterId: patient.id, addresseeId: doctor.id, status: "accepted" },
    { requesterId: patient.id, addresseeId: nurse.id, status: "accepted" },
    { requesterId: nurse.id, addresseeId: doctor.id, status: "accepted" }
  ];

  for (const fs of friendshipData) {
    const existing = await prisma.friendship.findFirst({
      where: {
        OR: [
          { requesterId: fs.requesterId, addresseeId: fs.addresseeId },
          { requesterId: fs.addresseeId, addresseeId: fs.requesterId }
        ]
      }
    });

    if (!existing) {
      await prisma.friendship.create({ data: fs });
      console.log(`✅ Created friendship between ${fs.requesterId} and ${fs.addresseeId}`);
    }
  }

  // 2. Seed Medical Messages (Requires an active order)
  const activeOrder = await prisma.serviceOrder.findFirst({
    where: { status: "open" }
  });

  if (activeOrder) {
    const messages = [
      { fromId: activeOrder.patientId, toId: doctor.id, orderId: activeOrder.id, message: "مرحباً يا دكتور، متى يمكنك الحضور؟" },
      { fromId: doctor.id, toId: activeOrder.patientId, orderId: activeOrder.id, message: "أهلاً بك، سأكون عندك غداً صباحاً إن شاء الله." }
    ];

    for (const msg of messages) {
      const existing = await prisma.medicalMessage.findFirst({
        where: { message: msg.message, fromId: msg.fromId }
      });

      if (!existing) {
        await prisma.medicalMessage.create({ data: msg });
        console.log(`💬 Added medical message from ${msg.fromId}`);
      }
    }
  }
}

module.exports = seedSocial;
