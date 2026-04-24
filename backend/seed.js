// server/seed.js
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "./models/User.js";
import dotenv from "dotenv";
import Grievance from "./models/Grievance.js";

dotenv.config();

const firstNames = [
  "Ravi",
  "Suresh",
  "Amit",
  "Priya",
  "Kavita",
  "Rajesh",
  "Sunita",
  "Vijay",
  "Anita",
  "Mohan",
  "Deepak",
  "Geeta",
  "Ramesh",
  "Lalita",
  "Prakash",
  "Savita",
  "Ashok",
  "Rekha",
  "Manoj",
  "Usha",
];
const lastNames = [
  "Kumar",
  "Singh",
  "Sharma",
  "Yadav",
  "Patel",
  "Verma",
  "Gupta",
  "Shah",
  "Joshi",
  "Mehta",
  "Tiwari",
  "Mishra",
  "Chauhan",
  "Pandey",
  "Dubey",
  "Nair",
  "Iyer",
  "Reddy",
  "Rao",
  "Das",
];

const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const generateUsers = async () => {
  const users = [];
  const hashedPassword = await bcrypt.hash("password123", 10);

  for (let i = 1; i <= 150; i++) {
    const name = `${randomItem(firstNames)} ${randomItem(lastNames)}`;
    const email = `worker${i}@shramik.com`;

    users.push({ name, email, password: hashedPassword, role: "user" });
  }

  return users;
};

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    // Optional: clear existing users first (comment out if you don't want this)
    await User.deleteMany({ role: "user" });
    console.log("Existing users cleared");

    const users = await generateUsers();
    await User.insertMany(users);

    const titles = [
      "Salary Not Paid",
      "Unsafe Conditions",
      "Overtime Not Compensated",
      "Harassment by Supervisor",
      "Wrongful Deduction",
    ];
    const categories = [
      "Wages & Salary",
      "Safety & Health",
      "Working Hours",
      "Harassment",
      "Discrimination",
    ];
    const statuses = ["Pending", "In Review", "Resolved", "Rejected"];

    const insertedUsers = await User.find({ role: "user" });

    const grievances = insertedUsers.map((u) => ({
      user: u._id,
      title: randomItem(titles),
      description: "This is a dummy grievance filed for testing purposes.",
      category: randomItem(categories),
      status: randomItem(statuses),
    }));

    await Grievance.insertMany(grievances);
    console.log("✅ Grievances seeded!");

    console.log("✅ 150 users seeded successfully!");
    console.log("📧 Email format: worker1@shramik.com → worker150@shramik.com");
    console.log("🔑 Password for all: password123");

    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
};

seed();