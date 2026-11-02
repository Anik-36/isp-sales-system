require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const CoverageArea = require("./models/CoverageArea");
const Package = require("./models/Package");
const CallbackRequest = require("./models/CallbackRequest");
const FutureLead = require("./models/FutureLead");
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
    { division: "Dhaka", city: "Dhaka", areaName: "Uttara" },
    { division: "Dhaka", city: "Dhaka", areaName: "Ashulia" },
    { division: "Dhaka", city: "Dhaka", areaName: "Savar" },
    { division: "Dhaka", city: "Dhaka", areaName: "Mohammadpur" },
    { division: "Chattogram", city: "Chattogram", areaName: "Colonelhat" },
    { division: "Chattogram", city: "Chattogram", areaName: "Agrabad" },
    { division: "Chattogram", city: "Chattogram", areaName: "Boropol" },
  ];
  await Promise.all(
    areas.map(({ division, city, areaName }) =>
      CoverageArea.updateOne(
        { city, areaName },
        { $set: { division }, $setOnInsert: { city, areaName } },
        { upsert: true },
      ),
    ),
  );
  const packages = [
    { name: "Circle Home 70", speed: "70 Mbps", price: 999 },
    { name: "Streaming Pro 100", speed: "100 Mbps", price: 1260 },
    { name: "Power User 150", speed: "150 Mbps", price: 1500 },
    { name: "Gamer Ultra 200", speed: "200 Mbps", price: 2000 },
  ];
  await Promise.all(
    packages.map((pkg) =>
      Package.updateOne(
        { name: pkg.name },
        { $set: { ...pkg, isActive: true } },
        { upsert: true },
      ),
    ),
  );
  await Package.updateMany(
    { name: { $in: ["Starter Fiber", "Standard Turbo", "Gamer Ultra"] } },
    { $set: { isActive: false } },
  );
  await Promise.all([
    CallbackRequest.updateMany(
      { status: "PENDING" },
      { $set: { status: "NOT_CONTACTED" } },
    ),
    FutureLead.updateMany(
      { coverageStatus: { $exists: false } },
      { $set: { coverageStatus: "NOT_COVERED" } },
    ),
  ]);
  console.log("Seed completed. Existing records were preserved.");
}

seedData()
  .catch((error) => {
    console.error("Seeding failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => mongoose.disconnect());
