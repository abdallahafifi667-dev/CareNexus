const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Starting Comprehensive Database Seeding...\n");

  try {
    // ─── 1. USERS ──────────────────────────────────────────────────
    console.log("👥 Creating Users...");
    const password = "Password123!";
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = [
      // Admin
      { email: "admin@carenexus.com", username: "Admin User", role: "admin", gender: "male", specialization: null, description: "Platform administrator" },
      // Doctors (8)
      { email: "dr.ahmed@carenexus.com", username: "Dr. Ahmed Hassan", role: "doctor", gender: "male", specialization: "Cardiology", description: "Senior cardiologist with 15 years of experience in interventional cardiology" },
      { email: "dr.sara@carenexus.com", username: "Dr. Sara Mahmoud", role: "doctor", gender: "female", specialization: "Pediatrics", description: "Pediatric specialist with expertise in neonatal care and child development" },
      { email: "dr.omar@carenexus.com", username: "Dr. Omar Farouk", role: "doctor", gender: "male", specialization: "Neurology", description: "Neurologist specializing in stroke treatment and epilepsy management" },
      { email: "dr.fatma@carenexus.com", username: "Dr. Fatma El-Sayed", role: "doctor", gender: "female", specialization: "Dermatology", description: "Dermatologist with expertise in cosmetic and clinical skin treatments" },
      { email: "dr.khaled@carenexus.com", username: "Dr. Khaled Nasser", role: "doctor", gender: "male", specialization: "Orthopedics", description: "Orthopedic surgeon specializing in sports injuries and joint replacement" },
      { email: "dr.nadia@carenexus.com", username: "Dr. Nadia Hossam", role: "doctor", gender: "female", specialization: "Gynecology", description: "Gynecologist and obstetrician with 12 years of experience" },
      { email: "dr.youssef@carenexus.com", username: "Dr. Youssef Adel", role: "doctor", gender: "male", specialization: "Internal Medicine", description: "Internist specializing in diabetes and hypertension management" },
      { email: "dr.mariam@carenexus.com", username: "Dr. Mariam Tarek", role: "doctor", gender: "female", specialization: "Psychiatry", description: "Psychiatrist specializing in cognitive behavioral therapy" },
      // Nursing (5)
      { email: "nurse.fatma@carenexus.com", username: "Fatma Ali", role: "nursing", gender: "female", specialization: "Emergency", description: "Emergency room nurse with 8 years of critical care experience" },
      { email: "nurse.mona@carenexus.com", username: "Mona Ibrahim", role: "nursing", gender: "female", specialization: "ICU", description: "ICU specialist nurse with advanced life support certification" },
      { email: "nurse.ahmed@carenexus.com", username: "Ahmed Saeed", role: "nursing", gender: "male", specialization: "Surgical", description: "Surgical nurse with 6 years of operating room experience" },
      { email: "nurse.nour@carenexus.com", username: "Nour El-Din", role: "nursing", gender: "male", specialization: "Home Care", description: "Home care nurse specializing in elderly and chronic patient care" },
      { email: "nurse.salma@carenexus.com", username: "Salma Osama", role: "nursing", gender: "female", specialization: "Pediatric", description: "Pediatric nurse with 5 years of children's hospital experience" },
      // Patients (10)
      { email: "patient.khaled@carenexus.com", username: "Khaled Mostafa", role: "patient", gender: "male", specialization: null, description: "Regular patient" },
      { email: "patient.nour@carenexus.com", username: "Nour El-Din", role: "patient", gender: "male", specialization: null, description: "Regular patient" },
      { email: "patient.layla@carenexus.com", username: "Layla Ahmed", role: "patient", gender: "female", specialization: null, description: "Regular patient" },
      { email: "patient.yousef@carenexus.com", username: "Yousef Samir", role: "patient", gender: "male", specialization: null, description: "Regular patient" },
      { email: "patient.mona@carenexus.com", username: "Mona Abdel-Rahman", role: "patient", gender: "female", specialization: null, description: "Regular patient" },
      { email: "patient.omar@carenexus.com", username: "Omar Tarek", role: "patient", gender: "male", specialization: null, description: "Regular patient" },
      { email: "patient.sara@carenexus.com", username: "Sara Ibrahim", role: "patient", gender: "female", specialization: null, description: "Regular patient" },
      { email: "patient.ali@carenexus.com", username: "Ali Hassan", role: "patient", gender: "male", specialization: null, description: "Regular patient" },
      { email: "patient.hana@carenexus.com", username: "Hana Mohamed", role: "patient", gender: "female", specialization: null, description: "Regular patient" },
      { email: "patient.tarek@carenexus.com", username: "Tarek Nabil", role: "patient", gender: "male", specialization: null, description: "Regular patient" },
      // Pharmacies (4)
      { email: "pharmacy.helmy@carenexus.com", username: "Helmy Pharmacy", role: "pharmacy", gender: "male", specialization: null, description: "24/7 pharmacy in downtown Cairo" },
      { email: "pharmacy.shorouk@carenexus.com", username: "Shorouk Pharmacy", role: "pharmacy", gender: "female", specialization: null, description: "Full-service pharmacy with delivery" },
      { email: "pharmacy.nile@carenexus.com", username: "Nile Pharmacy", role: "pharmacy", gender: "male", specialization: null, description: "Chain pharmacy with multiple branches across Egypt" },
      { email: "pharmacy.delta@carenexus.com", username: "Delta Pharmacy", role: "pharmacy", gender: "female", specialization: null, description: "Specialized in rare and imported medications" },
      // Shipping Companies (3)
      { email: "shipping.fast@carenexus.com", username: "FastShip Express", role: "shipping_company", gender: "male", specialization: null, description: "Same-day delivery across Egypt" },
      { email: "shipping.care@carenexus.com", username: "CareDelivery Co.", role: "shipping_company", gender: "male", specialization: null, description: "Medical supply delivery specialists" },
      { email: "shipping.swift@carenexus.com", username: "SwiftLogistics", role: "shipping_company", gender: "male", specialization: null, description: "Cold chain delivery for temperature-sensitive medications" },
    ];

    const createdUsers = [];
    for (const u of userData) {
      const existing = await prisma.user.findFirst({ where: { email: u.email } });
      if (existing) {
        createdUsers.push(existing);
        continue;
      }
      const user = await prisma.user.create({
        data: {
          email: u.email,
          username: u.username,
          password: hashedPassword,
          role: u.role,
          phone: `+2010${Math.floor(10000000 + Math.random() * 90000000)}`,
          country: "Egypt",
          address: "Cairo, Egypt",
          emailVerified: true,
          gender: u.gender,
          description: u.description,
          latitude: 30.0444 + (Math.random() - 0.5) * 0.1,
          longitude: 31.2357 + (Math.random() - 0.5) * 0.1,
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(u.username)}&backgroundColor=0088ff`,
          wallet: { create: { balance: Math.random() * 500, remainingAccount: Math.random() * 500 } },
          kyc: { create: { identityNumber: `ID-${Date.now()}-${Math.floor(Math.random() * 10000)}`, documentation: true } },
        },
      });
      createdUsers.push(user);
      console.log(`  ✅ ${u.username} (${u.role})`);
    }

    const admin = createdUsers.find(u => u.role === "admin");
    const doctors = createdUsers.filter(u => u.role === "doctor");
    const nurses = createdUsers.filter(u => u.role === "nursing");
    const patients = createdUsers.filter(u => u.role === "patient");
    const pharmacies = createdUsers.filter(u => u.role === "pharmacy");
    const shippingCompanies = createdUsers.filter(u => u.role === "shipping_company");
    const allProviders = [...doctors, ...nurses];

    // ─── 2. CATEGORIES ─────────────────────────────────────────────
    console.log("\n📂 Creating Categories...");
    const categoryData = [
      // Blog categories
      { text: "Health Tips", type: "blog", roles: ["doctor", "nursing"] },
      { text: "Medical News", type: "blog", roles: ["doctor"] },
      { text: "Patient Stories", type: "blog", roles: ["patient", "doctor"] },
      { text: "Nutrition", type: "blog", roles: ["doctor", "nursing"] },
      { text: "Mental Health", type: "blog", roles: ["doctor", "nursing"] },
      { text: "Medicine", type: "blog", roles: ["doctor"] },
      // Product categories
      { text: "Medications", type: "product", roles: ["pharmacy"] },
      { text: "Medical Devices", type: "product", roles: ["pharmacy"] },
      { text: "Supplements", type: "product", roles: ["pharmacy"] },
      { text: "First Aid", type: "product", roles: ["pharmacy"] },
      { text: "Personal Care", type: "product", roles: ["pharmacy"] },
    ];

    const createdCategories = [];
    for (const c of categoryData) {
      const existing = await prisma.category.findFirst({ where: { text: c.text, type: c.type } });
      if (existing) { createdCategories.push(existing); continue; }
      const cat = await prisma.category.create({ data: { text: c.text, type: c.type, roles: c.roles, userId: admin.id } });
      createdCategories.push(cat);
      console.log(`  ✅ ${c.text} (${c.type})`);
    }

    const blogCats = createdCategories.filter(c => c.type === "blog");
    const ecomCats = createdCategories.filter(c => c.type === "product");

    // ─── 3. POSTS ───────────────────────────────────────────────────
    console.log("\n📝 Creating Posts...");
    const postData = [
      { title: "Understanding Heart Disease: A Complete Guide", description: "Heart disease is one of the leading causes of death worldwide. In this comprehensive guide, we explore the risk factors, prevention strategies, and treatment options available for various cardiovascular conditions.", category: blogCats[0]?.id || blogCats[1]?.id },
      { title: "The Importance of Vaccination for Children", description: "Vaccines are one of the most effective tools for preventing infectious diseases in children. Learn about the recommended vaccination schedule and how vaccines work to protect your child's health.", category: blogCats[2]?.id || blogCats[0]?.id },
      { title: "10 Superfoods for Better Health", description: "Discover the top 10 superfoods that can boost your immune system, improve your energy levels, and promote overall well-being. From berries to leafy greens, these foods pack a powerful nutritional punch.", category: blogCats[3]?.id || blogCats[0]?.id },
      { title: "Managing Stress in the Modern World", description: "Chronic stress can have serious effects on your physical and mental health. Learn evidence-based strategies for managing stress, including mindfulness, exercise, and healthy lifestyle changes.", category: blogCats[4]?.id || blogCats[0]?.id },
      { title: "New Breakthroughs in Cancer Treatment", description: "Recent advances in immunotherapy and targeted therapies are revolutionizing cancer treatment. Stay updated on the latest medical breakthroughs that are giving hope to patients worldwide.", category: blogCats[1]?.id || blogCats[0]?.id },
      { title: "Understanding Diabetes: Type 1 vs Type 2", description: "Diabetes affects millions of people globally. Understanding the differences between Type 1 and Type 2 diabetes is crucial for proper management and treatment.", category: blogCats[0]?.id },
    ];

    const createdPosts = [];
    for (let i = 0; i < postData.length; i++) {
      const p = postData[i];
      const author = doctors[i % doctors.length];
      if (!author || !p.category) continue;
      const post = await prisma.post.create({
        data: {
          title: p.title,
          description: p.description,
          category: p.category,
          userId: author.id,
          allowComments: true,
          image: `https://picsum.photos/seed/post${i + 1}/800/400`,
        },
        include: { user: { select: { id: true, username: true, avatar: true } } },
      });
      createdPosts.push(post);
      console.log(`  ✅ "${p.title}" by ${author.username}`);

      // Add likes from random users
      const likers = createdUsers.filter(u => u.id !== author.id).slice(0, Math.floor(Math.random() * 8) + 3);
      const reactionTypes = ["like", "heart", "haha", "wow", "sad", "angry"];
      for (const liker of likers) {
        await prisma.postLike.upsert({
          where: { postId_userId: { postId: post.id, userId: liker.id } },
          create: { postId: post.id, userId: liker.id, reactionType: reactionTypes[Math.floor(Math.random() * reactionTypes.length)] },
          update: { reactionType: reactionTypes[Math.floor(Math.random() * reactionTypes.length)] },
        });
      }

      // Add comments
      const commenters = createdUsers.filter(u => u.id !== author.id).slice(0, Math.floor(Math.random() * 5) + 2);
      for (const commenter of commenters) {
        const comment = await prisma.comment.create({
          data: {
            text: [
              "Great article! Very informative.",
              "Thank you for sharing this valuable information.",
              "This is exactly what I was looking for!",
              "Very well written. Keep up the good work!",
              "I learned a lot from this post. Thanks!",
              "Could you share more details about this topic?",
            ][Math.floor(Math.random() * 6)],
            postId: post.id,
            userId: commenter.id,
          },
        });
        // Add comment likes
        const commentLikers = createdUsers.filter(u => u.id !== commenter.id).slice(0, Math.floor(Math.random() * 3));
        for (const cl of commentLikers) {
          await prisma.commentLike.create({
            data: { commentId: comment.id, userId: cl.id },
          });
        }
      }
    }

    // ─── 4. SERVICE ORDERS ─────────────────────────────────────────
    console.log("\\n🏥 Creating Service Orders...");
    const orderStatuses = ["open", "confirmed", "in_progress", "completed", "completed", "completed", "cancelled"];
    const serviceTypes = ["with_provider", "self_service"];
    const medicalTypes = ["doctor", "nursing"];
    const urgencyLevels = ["normal", "urgent", "emergency"];
    const orderTitles = [
      "Heart Checkup", "Pediatric Consultation", "Neurology Screening",
      "Emergency Care", "Routine Checkup", "Follow-up Visit",
      "Blood Test Analysis", "X-Ray Review", "Physical Therapy",
      "Vaccination", "Health Screening", "Dermatology Consultation",
      "Orthopedic Assessment", "Gynecology Checkup", "Psychiatric Evaluation",
      "Wound Dressing", "IV Therapy", "EKG Recording",
      "Ultrasound Scan", "Endoscopy Consultation", "Diabetes Management",
      "Hypertension Follow-up", "Allergy Testing", "Eye Examination",
      "Dental Checkup", "Physiotherapy Session", "Nutrition Counseling",
      "Post-Surgery Follow-up", "Cancer Screening", "Prenatal Checkup",
    ];
    const orderDescriptions = [
      "Patient requires a comprehensive cardiac evaluation including ECG and stress test.",
      "Child needs routine pediatric assessment and vaccination schedule review.",
      "Patient experiencing frequent headaches and dizziness, needs neurological evaluation.",
      "Urgent medical attention required for acute abdominal pain.",
      "Annual health checkup and blood work for preventive care.",
      "Follow-up visit after previous treatment to assess recovery progress.",
      "Complete blood count and metabolic panel analysis needed.",
      "Chest X-ray review for persistent cough and breathing difficulties.",
      "Post-operative physical therapy for knee replacement recovery.",
      "Routine vaccination for seasonal flu and COVID-19 booster.",
      "Comprehensive health screening including blood work and imaging.",
      "Skin rash evaluation and possible biopsy for persistent condition.",
      "Knee pain assessment after sports injury, possible MRI needed.",
      "Routine gynecological examination and Pap smear test.",
      "Patient reports anxiety and sleep disturbances, needs psychiatric evaluation.",
      "Daily wound dressing change for post-surgical incision site.",
      "IV fluid and medication administration for dehydration.",
      "Electrocardiogram recording for irregular heartbeat symptoms.",
      "Abdominal ultrasound for gallbladder and liver assessment.",
      "Upper GI endoscopy for chronic acid reflux evaluation.",
      "Diabetes management consultation and medication adjustment.",
      "Blood pressure monitoring and medication review.",
      "Comprehensive allergy panel for seasonal and food allergies.",
      "Routine eye exam and vision test with fundoscopy.",
      "Dental cleaning and cavity assessment.",
      "Lower back pain physiotherapy and rehabilitation session.",
      "Dietary consultation for weight management and nutrition plan.",
      "Post-operative follow-up after appendectomy procedure.",
      "Mammography and breast cancer screening for early detection.",
      "Routine prenatal checkup and fetal development monitoring.",
    ];

    const createdOrders = [];
    for (let i = 0; i < 30; i++) {
      const patient = patients[i % patients.length];
      const provider = allProviders[i % allProviders.length];
      const status = orderStatuses[i % orderStatuses.length];
      const order = await prisma.serviceOrder.create({
        data: {
          serviceType: serviceTypes[i % serviceTypes.length],
          medicalServiceType: medicalTypes[i % medicalTypes.length],
          patientId: patient.id,
          providerId: status !== "open" ? provider.id : null,
          title: orderTitles[i],
          description: orderDescriptions[i],
          appointmentDate: new Date(Date.now() + (i - 15) * 24 * 60 * 60 * 1000),
          duration: 30 + Math.floor(Math.random() * 90),
          urgencyLevel: urgencyLevels[i % urgencyLevels.length],
          status,
          price: 100 + Math.floor(Math.random() * 900),
          commission: 10 + Math.floor(Math.random() * 50),
          paymentStatus: status === "completed" ? "paid" : (status === "cancelled" ? "refunded" : "pending"),
          paymentMethod: i % 3 === 0 ? "card" : "cash",
          payoutStatus: status === "completed" ? "completed" : "pending",
          meetingLat: 30.0444 + (Math.random() - 0.5) * 0.05,
          meetingLng: 31.2357 + (Math.random() - 0.5) * 0.05,
        },
      });
      createdOrders.push(order);
      console.log(`  ✅ Order: ${order.title} (${status}) - ${patient.username} ➜ ${provider.username}`);

      // Add reviews for completed orders
      if (status === "completed") {
        await prisma.review.create({
          data: {
            userId: patient.id,
            targetId: provider.id,
            targetType: "user",
            rating: 3 + Math.floor(Math.random() * 3),
            comment: [
              "Excellent service, very professional!",
              "Great doctor, highly recommended.",
              "Very caring and attentive.",
              "Explained everything clearly.",
              "Quick and efficient service.",
            ][Math.floor(Math.random() * 5)],
          },
        });
      }

      // Add offers for open orders
      if (status === "open" && allProviders.length > 1) {
        const offerCount = 1 + Math.floor(Math.random() * 3);
        for (let j = 0; j < offerCount; j++) {
          const offeringProvider = allProviders[(i + j + 1) % allProviders.length];
          await prisma.orderOffer.create({
            data: {
              orderId: order.id,
              providerId: offeringProvider.id,
              proposedPrice: order.price + Math.floor(Math.random() * 200) - 50,
              description: `I can provide this service. Available ${["tomorrow morning", "this afternoon", "next week", "within 2 hours"][j % 4]}.`,
              status: j === 0 ? "pending" : "pending",
            },
          });
        }
      }
    }

    // ─── 5. PRODUCTS ────────────────────────────────────────────────
    console.log("\n💊 Creating Products...");
    const productData = [
      { name: "Paracetamol 500mg", description: "Pain reliever and fever reducer. Effective for headaches, muscle aches, and cold symptoms.", price: 25, stock: 500, catIdx: 0 },
      { name: "Amoxicillin 250mg", description: "Antibiotic used to treat bacterial infections including respiratory and urinary tract infections.", price: 45, stock: 300, catIdx: 0 },
      { name: "Vitamin C 1000mg", description: "Immune system support supplement. Antioxidant properties help protect cells from damage.", price: 60, stock: 1000, catIdx: 2 },
      { name: "Blood Pressure Monitor", description: "Digital automatic blood pressure monitor with large LCD display and memory function.", price: 450, stock: 50, catIdx: 1 },
      { name: "Thermometer Digital", description: "Fast and accurate digital thermometer with fever alarm and memory recall.", price: 85, stock: 200, catIdx: 1 },
      { name: "First Aid Kit", description: "Complete first aid kit with bandages, antiseptic wipes, gauze, and medical tape.", price: 120, stock: 150, catIdx: 3 },
      { name: "Omega-3 Fish Oil", description: "High-purity omega-3 supplement for heart and brain health support.", price: 95, stock: 400, catIdx: 2 },
      { name: "Ibuprofen 400mg", description: "Anti-inflammatory pain reliever for headaches, dental pain, and muscle inflammation.", price: 30, stock: 600, catIdx: 0 },
      { name: "Hand Sanitizer 500ml", description: "Alcohol-based hand sanitizer with 70% ethanol for effective germ protection.", price: 40, stock: 800, catIdx: 4 },
      { name: "Surgical Masks (50-pack)", description: "3-layer disposable surgical masks with ear loops and nose wire.", price: 75, stock: 1000, catIdx: 3 },
      { name: "Glucose Test Strips", description: "50-pack glucose test strips compatible with most standard glucose meters.", price: 110, stock: 250, catIdx: 1 },
      { name: "Calcium + Vitamin D", description: "Bone health supplement combining calcium carbonate with vitamin D3 for better absorption.", price: 70, stock: 350, catIdx: 2 },
      { name: "Aspirin 75mg", description: "Low-dose aspirin for cardiovascular protection and blood thinning.", price: 20, stock: 700, catIdx: 0 },
      { name: "Insulin Pen", description: "Reusable insulin pen for diabetes management with adjustable dose settings.", price: 350, stock: 80, catIdx: 1 },
      { name: "Nebulizer Machine", description: "Portable nebulizer for respiratory treatment and asthma management.", price: 550, stock: 40, catIdx: 1 },
      { name: "Antihistamine Tablets", description: "Non-drowsy antihistamine for allergy relief from hay fever and pet allergies.", price: 35, stock: 450, catIdx: 0 },
      { name: "Wound Care Spray", description: "Antiseptic wound care spray for minor cuts, scrapes, and burns.", price: 55, stock: 300, catIdx: 3 },
      { name: "Multivitamin Complex", description: "Daily multivitamin with essential vitamins and minerals for overall health.", price: 80, stock: 600, catIdx: 2 },
      { name: "Eye Drops", description: "Lubricating eye drops for dry eyes and eye strain relief.", price: 45, stock: 350, catIdx: 4 },
      { name: "Elastic Bandage", description: "Self-adhesive elastic bandage for sprains, strains, and compression therapy.", price: 30, stock: 500, catIdx: 3 },
    ];

    const createdProducts = [];
    for (let i = 0; i < productData.length; i++) {
      const p = productData[i];
      const pharmacy = pharmacies[i % pharmacies.length];
      const category = ecomCats[p.catIdx % ecomCats.length];
      const product = await prisma.product.create({
        data: {
          name: p.name,
          description: p.description,
          price: p.price,
          stockQuantity: p.stock,
          ReservedQuantity: 0,
          categoryId: category.id,
          merchantId: pharmacy.id,
          Address: "Cairo, Egypt",
          imageUrl: [`https://picsum.photos/seed/product${i + 1}/400/400`],
        },
      });
      createdProducts.push(product);
      console.log(`  ✅ ${p.name} - $${p.price} (Pharmacy: ${pharmacy.username})`);

      // Add product reviews from random patients
      const reviewers = patients.slice(0, Math.floor(Math.random() * 3) + 1);
      for (const reviewer of reviewers) {
        await prisma.review.create({
          data: {
            userId: reviewer.id,
            targetId: product.id,
            targetType: "product",
            rating: 3 + Math.floor(Math.random() * 3),
            comment: [
              "Great product, fast delivery!",
              "Exactly what I needed. Good quality.",
              "Reasonable price for the quality.",
              "Works as described. Satisfied with my purchase.",
              "Would definitely buy again.",
            ][Math.floor(Math.random() * 5)],
          },
        });
      }
    }

    // Update product ratings
    for (const product of createdProducts) {
      const reviews = await prisma.review.findMany({ where: { targetId: product.id, targetType: "product" } });
      const total = reviews.reduce((acc, r) => acc + r.rating, 0);
      const avg = reviews.length > 0 ? total / reviews.length : 0;
      await prisma.product.update({
        where: { id: product.id },
        data: { avgRating: avg, totalRatings: reviews.length },
      });
    }

    // ─── 6. E-COMMERCE ORDERS ───────────────────────────────────────
    console.log("\\n🛒 Creating E-Commerce Orders...");
    const orderStatuses2 = ["preparing", "ready", "shipped", "delivered", "delivered", "delivered", "cancelled"];

    for (let i = 0; i < 20; i++) {
      const customer = patients[i % patients.length];
      const product = createdProducts[i % createdProducts.length];
      const shipping = shippingCompanies[i % shippingCompanies.length];
      const status = orderStatuses2[i % orderStatuses2.length];
      const quantity = 1 + Math.floor(Math.random() * 4);

      const order = await prisma.ecommerceOrder.create({
        data: {
          userId: customer.id,
          ShippingCompanyId: status !== "preparing" ? shipping.id : null,
          totalAmount: product.price * quantity,
          orderStatus: status,
          paymentStatus: status === "cancelled" ? "refunded" : "paid",
          paymentMethod: i % 3 === 0 ? "credit_card" : "cash",
          shippingAddress: customer.address || "Cairo, Egypt",
          deliveryDate: status === "delivered" ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) : null,
          items: {
            create: {
              productId: product.id,
              quantity,
              price: product.price,
            },
          },
        },
      });
      console.log(`  ✅ Order #${order.id.slice(-8)} - ${product.name} x${quantity} (${status})`);
    }

    // ─── 7. CONTRACTS (Pharmacy ↔ Shipping) ─────────────────────────
    console.log("\n📋 Creating Contracts...");
    for (let i = 0; i < pharmacies.length && i < shippingCompanies.length; i++) {
      const contract = await prisma.contract.create({
        data: {
          pharmacyId: pharmacies[i].id,
          shippingCompanyId: shippingCompanies[i].id,
          initiatedById: pharmacies[i].id,
          status: i % 2 === 0 ? "accepted" : "pending",
          message: `Partnership contract between ${pharmacies[i].username} and ${shippingCompanies[i].username}`,
          businessDetails: {
            discountRate: 5 + Math.floor(Math.random() * 10),
            maxDeliveryTime: "48 hours",
            coverageArea: "Cairo & Giza",
          },
        },
      });
      console.log(`  ✅ Contract: ${pharmacies[i].username} ↔ ${shippingCompanies[i].username} (${contract.status})`);
    }

    // ─── 8. FRIENDSHIPS ──────────────────────────────────────────────
    console.log("\n👫 Creating Friendships...");
    // Doctor-Patient friendships
    for (let i = 0; i < Math.min(doctors.length, patients.length); i++) {
      await prisma.friendship.create({
        data: { requesterId: patients[i].id, addresseeId: doctors[i].id, status: "accepted" },
      });
      console.log(`  ✅ ${patients[i].username} ↔ ${doctors[i].username}`);
    }
    // Doctor-Doctor friendships
    for (let i = 0; i < doctors.length - 1; i++) {
      await prisma.friendship.create({
        data: { requesterId: doctors[i].id, addresseeId: doctors[i + 1].id, status: "accepted" },
      });
      console.log(`  ✅ ${doctors[i].username} ↔ ${doctors[i + 1].username}`);
    }

    // ─── 9. MEDICAL MESSAGES ────────────────────────────────────────
    console.log("\n💬 Creating Medical Messages...");
    const messageContents = [
      "Hello doctor, I have a question about my prescription.",
      "Sure, I'm here to help. What would you like to know?",
      "When should I take the medication?",
      "Take it twice daily after meals. Any other questions?",
      "Thank you doctor, that's very helpful!",
      "How long will the treatment last?",
      "About 2 weeks. Make sure to complete the full course.",
      "I've been feeling better since starting the treatment.",
      "That's great to hear! Keep following the instructions.",
    ];

    // First, let's create a service order to link messages to
    const tempOrder = await prisma.serviceOrder.findFirst({
      where: { patientId: patients[0]?.id, providerId: doctors[0]?.id }
    }) || await prisma.serviceOrder.create({
      data: {
        serviceType: "with_provider",
        medicalServiceType: "doctor",
        patientId: patients[0].id,
        providerId: doctors[0].id,
        title: "Temp Order for Messages",
        description: "For seeding messages",
        appointmentDate: new Date(),
        duration: 30,
        urgencyLevel: "normal",
        status: "open",
        price: 100,
      }
    });

    for (let i = 0; i < Math.min(doctors.length, patients.length); i++) {
      for (let j = 0; j < 4; j++) {
        await prisma.medicalMessage.create({
          data: {
            fromId: j % 2 === 0 ? patients[i].id : doctors[i].id,
            toId: j % 2 === 0 ? doctors[i].id : patients[i].id,
            orderId: tempOrder.id,
            message: messageContents[j % messageContents.length],
            messageType: "text",
            isRead: true,
          },
        });
      }
      console.log(`  ✅ Messages between ${patients[i].username} and ${doctors[i].username}`);
    }

    // ─── 10. KNOWLEDGE ARTICLES ─────────────────────────────────────
    console.log("\n📚 Creating Knowledge Articles...");
    const knowledgeData = [
      { title: "Type 2 Diabetes", content: "Type 2 diabetes is a chronic condition that affects the way your body metabolizes sugar. With type 2 diabetes, your body either resists the effects of insulin or doesn't produce enough insulin to maintain normal glucose levels.", category: "disease", language: "en" },
      { title: "Hypertension", content: "Hypertension, or high blood pressure, is a common condition in which the force of blood against the artery walls is high enough that it may eventually cause health problems, such as heart disease.", category: "disease", language: "en" },
      { title: "Ibuprofen", content: "Ibuprofen is a nonsteroidal anti-inflammatory drug (NSAID). It works by reducing hormones that cause inflammation and pain in the body.", category: "drug", language: "en" },
      { title: "Amoxicillin", content: "Amoxicillin is a penicillin antibiotic that fights bacteria. It is used to treat many different types of infection caused by bacteria.", category: "drug", language: "en" },
      { title: "Cardiac Catheterization", content: "Cardiac catheterization is a procedure used to diagnose and treat certain cardiovascular conditions. A long thin tube called a catheter is inserted in an artery or vein.", category: "treatment", language: "en" },
      { title: "Chest Pain", content: "Chest pain can have many causes, from minor problems like heartburn to serious conditions like a heart attack. It's important to seek immediate medical attention for unexplained chest pain.", category: "symptom", language: "en" },
    ];

    for (const k of knowledgeData) {
      await prisma.knowledgeArticle.create({
        data: {
          title: k.title,
          content: k.content,
          category: k.category,
          tags: [k.category, k.title.toLowerCase().split(" ")].flat(),
          language: k.language,
          authorId: admin.id,
          source: "local",
        },
      });
      console.log(`  ✅ ${k.title} (${k.category})`);
    }

    // ─── 11. NOTIFICATIONS ──────────────────────────────────────────
    console.log("\\n🔔 Creating Notifications...");
    for (let i = 0; i < createdUsers.length; i++) {
      const user = createdUsers[i];
      await prisma.notification.createMany({
        data: [
          { userId: user.id, type: "system", title: "Welcome to CareNexus!", message: "Thank you for joining our platform.", isRead: i % 2 === 0 },
          { userId: user.id, type: "order", title: "Order Update", message: "Your recent order has been updated.", isRead: i % 3 === 0 },
        ],
      });
    }
    console.log(`  ✅ Notifications created for all users`);

    // ─── 12. CHAT ROOMS & MESSAGES ──────────────────────────────────
    console.log("\\n💬 Creating Chat Rooms & Messages...");
    const chatMessages = [
      "Hey, how are you doing?",
      "I'm doing great! How about you?",
      "Pretty good. Did you see the new update?",
      "Yes! The new features look amazing.",
      "Let's catch up later today.",
      "Sure, sounds good!",
    ];

    // Create a few group chat rooms
    for (let i = 0; i < 3; i++) {
      const roomParticipants = createdUsers.slice(i * 3, i * 3 + 4).map(u => u.id);
      if (roomParticipants.length < 2) continue;

      const chatRoom = await prisma.chatRoom.create({
        data: {
          type: "group",
          participants: {
            create: roomParticipants.map(userId => ({ userId })),
          },
          messages: {
            create: Array.from({ length: 5 }, (_, j) => ({
              text: chatMessages[j % chatMessages.length],
              senderId: roomParticipants[j % roomParticipants.length],
              isRead: j < 3,
              createdAt: new Date(Date.now() - (5 - j) * 60000),
            })),
          },
        },
      });
      console.log(`  ✅ Chat Room ${i + 1} with ${roomParticipants.length} participants`);
    }

    // Create private chat rooms between doctors and patients
    for (let i = 0; i < Math.min(doctors.length, patients.length, 5); i++) {
      const chatRoom = await prisma.chatRoom.create({
        data: {
          type: "private",
          participants: {
            create: [
              { userId: doctors[i].id },
              { userId: patients[i].id },
            ],
          },
          messages: {
            create: Array.from({ length: 4 }, (_, j) => ({
              text: [
                "Hello, I wanted to follow up on your condition.",
                "Sure doctor, I've been feeling better.",
                "That's great! Keep taking the medication as prescribed.",
                "Will do. Thank you!",
              ][j],
              senderId: j % 2 === 0 ? doctors[i].id : patients[i].id,
              receiverId: j % 2 === 0 ? patients[i].id : doctors[i].id,
              isRead: true,
              createdAt: new Date(Date.now() - (4 - j) * 3600000),
            })),
          },
        },
      });
      console.log(`  ✅ Private chat: Dr. ${doctors[i].username.split(" ").pop()} ↔ ${patients[i].username.split(" ").pop()}`);
    }

    // ─── 13. E-COMMERCE CONVERSATIONS (B2B) ─────────────────────────
    console.log("\\n🏢 Creating B2B E-Commerce Conversations...");
    const b2bMessages = [
      "Hi, we'd like to discuss a partnership.",
      "Sure, what are your delivery capabilities?",
      "We can handle same-day delivery across Cairo.",
      "Great! Let's schedule a call to discuss terms.",
    ];

    for (let i = 0; i < pharmacies.length && i < shippingCompanies.length; i++) {
      const conv = await prisma.ecommerceConversation.create({
        data: {
          pharmacyId: pharmacies[i].id,
          shippingCompanyId: shippingCompanies[i].id,
          messageCount: 4,
          messages: {
            create: Array.from({ length: 4 }, (_, j) => ({
              text: b2bMessages[j],
              senderId: j % 2 === 0 ? pharmacies[i].id : shippingCompanies[i].id,
              createdAt: new Date(Date.now() - (4 - j) * 86400000),
            })),
          },
        },
      });
      console.log(`  ✅ B2B Chat: ${pharmacies[i].username} ↔ ${shippingCompanies[i].username}`);
    }

    // ─── SUMMARY ────────────────────────────────────────────────────
    console.log("\n" + "=".repeat(60));
    console.log("✨ Database Seeding Completed Successfully!");
    console.log("=".repeat(60));
    console.log(`📊 Summary:`);
    console.log(`   Users: ${createdUsers.length} (${doctors.length} doctors, ${nurses.length} nurses, ${patients.length} patients, ${pharmacies.length} pharmacies, ${shippingCompanies.length} shipping, 1 admin)`);
    console.log(`   Categories: ${createdCategories.length}`);
    console.log(`   Posts: ${createdPosts.length}`);
    console.log(`   Products: ${createdProducts.length}`);
    console.log(`   Service Orders: 30`);
    console.log(`   E-Commerce Orders: 20`);
    console.log(`   Contracts: ${Math.min(pharmacies.length, shippingCompanies.length)}`);
    console.log(`   Friendships: ${doctors.length + doctors.length - 1}`);
    console.log(`   Knowledge Articles: ${knowledgeData.length}`);
    console.log(`   Chat Rooms: 8`);
    console.log(`   B2B Conversations: ${Math.min(pharmacies.length, shippingCompanies.length)}`);
    console.log("=".repeat(60));

  } catch (error) {
    console.error("\n❌ Seeding failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
