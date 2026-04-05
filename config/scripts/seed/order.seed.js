const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seedOrders(patients, providers) {
  console.log("🚑 Seeding Service Orders and Offers...");

  const patient = patients[0];
  const doctor = providers.find(u => u.role === 'doctor');
  const nurse = providers.find(u => u.role === 'nursing');

  const sampleOrders = [
    {
      patientId: patient.id,
      medicalServiceType: "doctor",
      title: "كشف منزلي - باطنة",
      description: "أحتاج إلى طبيب باطنة لعمل كشف منزلي لوالدي المسن، يعاني من ارتفاع بسيط في ضغط الدم.",
      price: 300,
    },
    {
      patientId: patient.id,
      medicalServiceType: "nursing",
      title: "غيير على جرح جراحي",
      description: "مطلوب ممرض/ة لعمل غيار على جرح بعد عملية جراحية بالمنزل لمدة 3 أيام.",
      price: 150,
    }
  ];

  for (const ordData of sampleOrders) {
    let order = await prisma.serviceOrder.findFirst({
      where: { patientId: ordData.patientId, title: ordData.title },
    });

    if (!order) {
      order = await prisma.serviceOrder.create({
        data: {
          patientId: ordData.patientId,
          serviceType: "with_provider",
          medicalServiceType: ordData.medicalServiceType,
          title: ordData.title,
          description: ordData.description,
          appointmentDate: new Date(),
          duration: 60,
          status: "open",
          meetingLat: 30.0444,
          meetingLng: 31.2357,
          price: ordData.price,
        },
      });
      console.log(`✅ Created service order: ${order.title}`);
    }

    // Seed Offers for this order
    const existingOffer = await prisma.orderOffer.findFirst({
      where: { orderId: order.id, providerId: doctor.id }
    });

    if (!existingOffer && order.medicalServiceType === 'doctor') {
      await prisma.orderOffer.create({
        data: {
          orderId: order.id,
          providerId: doctor.id,
          proposedPrice: order.price + 50,
          description: "يمكنني الحضور غداً في تمام الساعة 10 صباحاً.",
          status: "pending"
        }
      });
      console.log(`💰 Added offer to order: ${order.title} from ${doctor.username}`);
    }
  }
}

module.exports = seedOrders;
