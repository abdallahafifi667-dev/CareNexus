const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();
const { connect } = require("../conectet");
const { getUserModel, getUserKYCModel } = require("../../models/users-core/users.models");

async function seed() {
  try {
    console.log("🚀 Starting database seeding...");
    await connect();

    const User = getUserModel();
    const UserKYC = getUserKYCModel();

    const roles = ["doctor", "nursing", "patient", "pharmacy", "admin", "shipping_company"];
    const password = "Password123!";
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    for (const role of roles) {
      const email = `${role}@caresync.com`;
      const username = `${role.charAt(0).toUpperCase() + role.slice(1)} Test`;
      
      // Check if user already exists
      const userExists = await User.findOne({ "email.address": email });
      if (userExists) {
        console.log(`ℹ️  User with role '${role}' already exists (${email})`);
        continue;
      }

      const newUser = new User({
        role,
        username,
        email: {
          address: email,
          verified: true,
          verificationCode: null,
        },
        password: hashedPassword,
        phone: `+2010${Math.floor(10000000 + Math.random() * 90000000)}`, // Random 11-digit EG phone
        country: "Egypt",
        Address: "CareSync HQ, Cairo, Egypt",
        NationalNumber: `NAT-${role.toUpperCase()}-${Date.now()}`,
        gender: "male",
        location: {
          type: "Point",
          coordinates: [31.2357, 30.0444], // Cairo
        },
      });

      await newUser.save();
      
      // Auto-update KYC for seeded users
      await UserKYC.findOneAndUpdate(
        { userId: newUser._id },
        { 
          identityNumber: `ID-${newUser._id.toString().slice(-8)}`,
          documentation: true // Auto-verify docs for seeded users
        },
        { upsert: true }
      );

      console.log(`✅ Created user: ${username} (${email}) with password: ${password}`);
    }

    console.log("✨ Database seeding completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    process.exit(1);
  }
}

seed();
