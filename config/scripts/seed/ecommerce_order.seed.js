const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seedEcommerceOrders(users, products) {
  console.log("🛒 Seeding Ecommerce Orders and Reviews...");

  const patient = users.find(u => u.role === 'patient');
  const pharmacy = users.find(u => u.role === 'pharmacy');
  const doctor = users.find(u => u.role === 'doctor');

  // 1. Seed Ecommerce Order
  const existingOrder = await prisma.ecommerceOrder.findFirst({
    where: { userId: patient.id }
  });

  if (!existingOrder && products.length > 0) {
    const order = await prisma.ecommerceOrder.create({
      data: {
        userId: patient.id,
        totalAmount: products[0].price * 2,
        orderStatus: "completed",
        paymentStatus: "paid",
        paymentMethod: "cash",
        shippingAddress: "Cairo, Egypt",
        items: {
          create: [
            { productId: products[0].id, quantity: 2, price: products[0].price }
          ]
        }
      }
    });
    console.log(`✅ Created ecommerce order for ${patient.username}`);

    // 2. Seed Reviews for the product
    const existingReview = await prisma.review.findFirst({
      where: { userId: patient.id, targetId: products[0].id }
    });

    if (!existingReview) {
      await prisma.review.create({
        data: {
          rating: 5,
          comment: "منتج ممتاز جداً وخدمة توصيل سريعة، شكراً لكم!",
          userId: patient.id,
          targetId: products[0].id,
          targetType: "product"
        }
      });
      console.log(`⭐ Added review for product: ${products[0].name}`);
    }
  }

  // 3. Seed Reviews for a Doctor
  const existingDocReview = await prisma.review.findFirst({
    where: { userId: patient.id, targetId: doctor.id }
  });

  if (!existingDocReview) {
    await prisma.review.create({
      data: {
        rating: 4,
        comment: "دكتور ممتاز وصبور جداً في التعامل، بارك الله فيك.",
        userId: patient.id,
        targetId: doctor.id,
        targetType: "user"
      }
    });
    console.log(`⭐ Added review for doctor: ${doctor.username}`);
  }
}

module.exports = seedEcommerceOrders;
