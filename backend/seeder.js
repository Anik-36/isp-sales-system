require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const CoverageArea = require("./models/CoverageArea");
const Package = require("./models/Package");
const connectDB = require("./config/db");

async function seedData() {
  await connectDB();
  const adminEmail = (process.env.SEED_ADMIN_EMAIL || "").trim().toLowerCase();
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword || adminPassword.length < 8) {
    throw new Error(
      "Set SEED_ADMIN_EMAIL and an SEED_ADMIN_PASSWORD of at least 8 characters in backend/.env",
    );
  }

  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    await User.create({
      name: process.env.SEED_ADMIN_NAME || "Super Admin",
      email: adminEmail,
      password: adminPassword,
      role: "admin",
    });
  }

  const areas = [
    { city: "Dhaka", areaName: "Uttara" },
    { city: "Dhaka", areaName: "Ashulia" },
    { city: "Dhaka", areaName: "Savar" },
    { city: "Dhaka", areaName: "Mohammadpur" },
    { city: "Chattogram", areaName: "Colonelhat" },
    { city: "Chattogram", areaName: "Agrabad" },
    { city: "Chattogram", areaName: "Boropol" },
  ];
  await Promise.all(
    areas.map(({ city, areaName }) =>
      CoverageArea.updateOne(
        { city, areaName },
        { $setOnInsert: { city, areaName } },
        { upsert: true },
      ),
    ),
  );
  const packages = [
    { name: "Starter Fiber", speed: "20 Mbps", price: 600 },
    { name: "Standard Turbo", speed: "50 Mbps", price: 1000 },
    { name: "Gamer Ultra", speed: "100 Mbps", price: 1800 },
  ];
  await Promise.all(
    packages.map((pkg) =>
      Package.updateOne(
        { name: pkg.name },
        { $setOnInsert: pkg },
        { upsert: true },
      ),
    ),
  );
  console.log("Seed completed. Existing records were preserved.");
}

seedData()
  .catch((error) => {
    console.error("Seeding failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => mongoose.disconnect());
