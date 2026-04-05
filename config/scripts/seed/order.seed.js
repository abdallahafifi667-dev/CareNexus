const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seedOrders(patients, providers) {
  console.log("🚑 Seeding Service Orders...");

  const sampleOrders = [
    {
      patientId: patients[0].id,
      medicalServiceType: "doctor",
      title: "General Consultation",
      description: "General checkup and consultation.",
    },
    {
      patientId: patients[0].id,
      medicalServiceType: "nursing",
      title: "Home Nursing Care",
      description: "Wound dressing and medication management.",
    },
  ];

  for (const ord of sampleOrders) {
    // Find existing to avoid duplicates
    const existing = await prisma.serviceOrder.findFirst({
      where: { patientId: ord.patientId, title: ord.title },
    });

    if (existing) {
      console.log(
        `ℹ️  Order "${ord.title}" for ${ord.patientId} already exists.`,
      );
      continue;
    }

    await prisma.serviceOrder.create({
      data: {
        patientId: ord.patientId,
        serviceType: "with_provider",
        medicalServiceType: ord.medicalServiceType,
        title: ord.title,
        description: ord.description,
        appointmentDate: new Date(),
        duration: 60,
        status: "open",
        meetingLat: 30.0444,
        meetingLng: 31.2357,
        price: 150,
      },
    });

    console.log(
      `✅ Created service order for patient: ${ord.patientId} (${ord.type})`,
    );
  }
}

if (require.main === module) {
  // Find patients and providers first
  Promise.all([
    prisma.user.findMany({ where: { role: "patient" } }),
    prisma.user.findMany({ where: { role: { in: ["doctor", "nursing"] } } }),
  ])
    .then(([patients, providers]) => {
      if (!patients.length || !providers.length)
        throw new Error("Patients or providers not found. Seed users first.");
      return seedOrders(patients, providers);
    })
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

module.exports = seedOrders;
