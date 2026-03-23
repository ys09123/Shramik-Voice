import mongoose from "mongoose";

const grievanceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: [
        "Wages & Salary",
        "Working Hours",
        "Safety & Health",
        "Harassment",
        "Wrongful Termination",
        "Leave & Holidays",
        "Discrimination",
        "Other",
      ],
      default: "Other",
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved"],
      default: "Pending",
    },
    image: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Grievance", grievanceSchema);
