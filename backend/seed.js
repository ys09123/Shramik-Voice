// server/seedGrievances.js
import mongoose from "mongoose";
import User from "./models/User.js";
import Grievance from "./models/Grievance.js";
import dotenv from "dotenv";

dotenv.config();

const titles = [
  "Salary Not Paid for February",
  "Overtime Not Compensated",
  "Unsafe Working Conditions",
  "Harassment by Floor Supervisor",
  "Wrongful Salary Deduction",
  "No Protective Equipment Provided",
  "Forced to Work on Holiday",
  "Denied Medical Leave",
  "Discrimination in Promotion",
  "Verbal Abuse by Manager",
  "Irregular Shift Schedule",
  "Canteen Food Quality Issue",
  "No Break During 10 Hour Shift",
  "Contract Terms Not Honored",
  "Wrongful Termination Warning",
];

const descriptions = [
  "My salary for the month of February has not been credited to my account despite multiple follow-ups with the HR department and the floor manager.",
  "I worked 14 hours of overtime last month but none of it has been included in my paycheck. This has been happening for the past 3 months.",
  "The machinery on floor 3 has not been maintained properly. Two workers were injured last week and nothing has been done about it.",
  "The floor supervisor regularly uses abusive language and threatens workers with termination if they raise any concerns.",
  "An amount of Rs. 2000 was deducted from my salary without any prior notice or explanation in the salary slip.",
  "Workers in the chemical processing unit have not been given gloves or masks despite repeated requests to management.",
  "We were forced to work on Diwali without any holiday pay or prior notice. Our request for compensatory off was denied.",
  "I applied for medical leave with a valid doctor's certificate but it was rejected without any reason given.",
  "Despite having more experience and better performance reviews, I was passed over for promotion in favor of a less experienced worker.",
  "The production manager has been singling out certain workers and using threatening language during daily briefings.",
  "Shift schedules are changed without any prior notice, making it impossible to plan personal responsibilities.",
  "The food served in the factory canteen is often stale and unhygienic. Several workers have fallen ill as a result.",
  "Workers on the assembly line are not given any break during a 10-hour shift, which is a violation of labor laws.",
  "The terms mentioned in my employment contract regarding transport allowance are not being honored by the company.",
  "I received a warning letter for something I did not do. The incident was caused by a machine malfunction, not human error.",
];

const categories = [
  "Wages & Salary",
  "Working Hours",
  "Safety & Health",
  "Harassment",
  "Wrongful Termination",
  "Leave & Holidays",
  "Discrimination",
  "Other",
];

const statuses = ["Pending", "In Review", "Resolved", "Rejected"];

const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// Random date within the last 6 months
const randomDate = () => {
  const now = new Date();
  const past = new Date();
  past.setMonth(past.getMonth() - 6);
  return new Date(
    past.getTime() + Math.random() * (now.getTime() - past.getTime()),
  );
};

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    // Get all non-admin users
    const users = await User.find({ role: "user" });

    if (users.length === 0) {
      console.log("❌ No users found. Run the user seed script first.");
      process.exit(1);
    }

    console.log(`Found ${users.length} users. Generating grievances...`);

    // Optional: clear existing grievances
    // await Grievance.deleteMany({});
    // console.log("Existing grievances cleared");

    const grievances = [];

    for (const user of users) {
      // Each user files between 1 and 4 grievances
      const count = randomInt(1, 4);

      for (let i = 0; i < count; i++) {
        const createdAt = randomDate();
        grievances.push({
          user: user._id,
          title: randomItem(titles),
          description: randomItem(descriptions),
          category: randomItem(categories),
          status: randomItem(statuses),
          createdAt,
          updatedAt: createdAt,
        });
      }
    }

    await Grievance.insertMany(grievances);

    console.log(
      `✅ ${grievances.length} grievances seeded across ${users.length} users!`,
    );
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
};

seed();
