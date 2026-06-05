const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seedDoctorOrders(patients, doctors) {
  console.log("👨‍⚕️ Seeding Doctor Orders Mock Data...");

  // Get one doctor for the demo
  const doctor = doctors[0];
  if (!doctor) {
    console.log("⚠️  No doctors found. Skipping doctor orders seeding.");
    return;
  }

  // Mock data in both Arabic and English
  const mockOrders = [
    // Available Orders (pending)
    {
      title: "استشارة عامة - صداع والدوخة",
      description: "استشارة بخصوص آلام في الرأس والدوخة المستمرة",
      medicalServiceType: "doctor",
      price: 150,
      urgencyLevel: "high",
      status: "open",
      patientName: "أحمد الشريف",
      patientAge: 35,
      patientGender: "male",
    },
    {
      title: "استشارة متخصصة - جلدية",
      description: "الحاجة لاستشارة تخصصية في الجلدية",
      medicalServiceType: "doctor",
      price: 200,
      urgencyLevel: "medium",
      status: "open",
      patientName: "فاطمة محمد",
      patientAge: 28,
      patientGender: "female",
    },
    {
      title: "متابعة - السكري والضغط",
      description: "متابعة حالة السكري والضغط",
      medicalServiceType: "doctor",
      price: 100,
      urgencyLevel: "low",
      status: "open",
      patientName: "محمود علي",
      patientAge: 45,
      patientGender: "male",
    },
    // Active Orders (assigned to doctor)
    {
      title: "استشارة عامة - آلام الظهر",
      description: "استشارة عن الآلام في الظهر والعمود الفقري",
      medicalServiceType: "doctor",
      price: 180,
      urgencyLevel: "medium",
      status: "accepted",
      patientName: "علي أحمد",
      patientAge: 50,
      patientGender: "male",
      assignToDoctor: true,
    },
    {
      title: "متابعة - الحالة الصحية",
      description: "متابعة الحالة الصحية العامة",
      medicalServiceType: "doctor",
      price: 100,
      urgencyLevel: "low",
      status: "in_progress",
      patientName: "ليلى عبدالله",
      patientAge: 41,
      patientGender: "female",
      assignToDoctor: true,
    },
    {
      title: "استشارة متخصصة - قلب",
      description: "استشارة قلبية متخصصة",
      medicalServiceType: "doctor",
      price: 250,
      urgencyLevel: "high",
      status: "in_progress",
      patientName: "عمر سالم",
      patientAge: 55,
      patientGender: "male",
      assignToDoctor: true,
    },
    // Completed/History Orders
    {
      title: "استشارة عامة - الحساسية والربو",
      description: "استشارة عن الحساسية والربو",
      medicalServiceType: "doctor",
      price: 150,
      urgencyLevel: "medium",
      status: "completed",
      patientName: "نور محمود",
      patientAge: 29,
      patientGender: "female",
      assignToDoctor: true,
      rating: 5,
      review: "الدكتور متميز جداً وشرح لي كل شيء بوضوح",
    },
    {
      title: "متابعة - الصحة العامة",
      description: "متابعة الحالة الصحية المستمرة",
      medicalServiceType: "doctor",
      price: 100,
      urgencyLevel: "low",
      status: "completed",
      patientName: "رفيق إبراهيم",
      patientAge: 60,
      patientGender: "male",
      assignToDoctor: true,
      rating: 4,
      review: "استشارة مفيدة وحصلت على نصائح قيمة",
    },
  ];

  for (const orderData of mockOrders) {
    try {
      const existingOrder = await prisma.serviceOrder.findFirst({
        where: {
          title: orderData.title,
          patientId: patients[0].id,
        },
      });

      if (!existingOrder) {
        const order = await prisma.serviceOrder.create({
          data: {
            title: orderData.title,
            description: orderData.description,
            medicalServiceType: orderData.medicalServiceType,
            serviceType: "with_provider",
            price: orderData.price,
            urgencyLevel: orderData.urgencyLevel,
            status: orderData.status,
            appointmentDate: new Date(
              Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000,
            ),
            duration: 60,
            patientId: patients[0].id,
            providerId: orderData.assignToDoctor ? doctor.id : null,
            meetingLat: 30.0444,
            meetingLng: 31.2357,
            completion:
              orderData.status === "completed"
                ? {
                    rating: orderData.rating || 5,
                    review: orderData.review || "",
                    completedAt: new Date(),
                  }
                : null,
          },
        });

        console.log(`✅ Created order: ${order.title}`);

        // Create offer if not assigned
        if (!orderData.assignToDoctor) {
          await prisma.orderOffer.create({
            data: {
              orderId: order.id,
              providerId: doctor.id,
              proposedPrice: orderData.price,
              description: "أنا مستعد لتقديم الخدمة",
              status: "pending",
            },
          });
          console.log(`💰 Added offer from ${doctor.username}`);
        }
      }
    } catch (error) {
      console.error(`❌ Error creating order:`, error.message);
    }
  }

  console.log("✨ Doctor orders seeding complete!");
}

module.exports = seedDoctorOrders;
