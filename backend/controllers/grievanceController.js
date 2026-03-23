import User from "../models/User.js";
import Grievance from "../models/Grievance.js";

export const createGrievance = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({
        message: "Please provide the necessary details.",
      });
    }

    const grievance = await Grievance.create({
      user: req.user._id,
      title,
      description,
      category,
      status: "Pending",
      image: req.file ? `/uploads/${req.file.filename}` : null,
    });

    res.status(201).json({
      success: true,
      message: "Grievance filed successfully",
      grievance,
    });
  } catch (err) {
    console.error("Error creating grievance: ", err);
    res.status(500).json({
      message: "Server Error. Please try again.",
      error: err.message,
    });
  }
};

export const getMyGrievances = async (req, res) => {
  try {
    const grievances = await Grievance.find({ user: req.user._id })
      .select("title description category status createdAt")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: grievances.length,
      grievances,
    });
  } catch (err) {
    console.error("Error fetching grievances: ", err);
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};
