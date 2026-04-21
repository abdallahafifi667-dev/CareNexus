const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

async function seedUsers() {
  console.log("👥 Seeding Users...");

  const roles = [
    "doctor",
    "nursing",
    "patient",
    "pharmacy",
    "admin",
    "shipping_company",
  ];
  const password = "Password123!";
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const users = [];

  for (const role of roles) {
    const email = `${role}@caresync.com`;
    const username = `${role.charAt(0).toUpperCase() + role.slice(1)} Test`;

    // Check if exists
    const existing = await prisma.user.findFirst({
      where: { email: email },
    });

    if (existing) {
      console.log(`ℹ️  User ${email} already exists.`);
      users.push(existing);
      continue;
    }

    const user = await prisma.user.create({
      data: {
        email: email,
        username: username,
        password: hashedPassword,
        role: role,
        phone: `+2010${Math.floor(10000000 + Math.random() * 90000000)}`,
        country: "Egypt",
        address: "CareSync HQ, Cairo, Egypt",
        emailVerified: true,
        gender: "male",
        nationalNumber: `NAT-${role.toUpperCase()}-${Date.now()}`,
        // Create wallet and kyc in the same transaction
        wallet: { create: { balance: 100 } },
        kyc: {
          create: {
            identityNumber: `ID-${role.toUpperCase()}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            documentation: true,
          },
        },
        avatar: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
        coverPhoto: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
      },
    });

    console.log(`✅ Created user: ${username} (${role})`);
    users.push(user);
  }

  return users;
}

if (require.main === module) {
  seedUsers()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

module.exports = seedUsers;
