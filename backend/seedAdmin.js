require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const mongoose = require("mongoose");
const User = require("./models/User");

const ADMIN_EMAIL = "admin@hollah.com";
const ADMIN_PASSWORD = "admin123";
const ADMIN_NAME = "Admin";

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    const existing = await User.findOne({ email: ADMIN_EMAIL });
    if (existing) {
      console.log(`Admin user already exists: ${ADMIN_EMAIL}`);
      process.exit(0);
    }

    await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: "admin",
    });

    console.log("Admin user created successfully:");
    console.log(`  Email:    ${ADMIN_EMAIL}`);
    console.log(`  Password: ${ADMIN_PASSWORD}`);
    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err.message);
    process.exit(1);
  }
}

seed();
