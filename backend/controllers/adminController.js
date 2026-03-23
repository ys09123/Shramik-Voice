import User from "../models/User.js";
import Grievance from "../models/Grievance.js";

export const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });

    const totalGrievances = await Grievance.countDocuments();

    const recentGrievances = await Grievance.find({})
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalGrievances,
        recentGrievances,
      },
    });
  } catch (err) {
    console.error("Get stats error: ", err);
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .select("-password")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (err) {
    console.error("Get all users error: ", err);
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

export const getAllGrievances = async (req, res) => {
  try {
    const grievances = await Grievance.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: grievances.length,
      grievances,
    });
  } catch (err) {
    console.error("Get grievances error: ", err);
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

export const updateGrievanceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ["Pending", "In Review", "Closed", "Rejected"];

    if (!allowed.includes(status)) {
      return res.status(400).json({
        message: "Invalid status value.",
      });
    }

    const grievance = await Grievance.findByIdAndUpdate(
      id,
      { status },
      { returnDocument: "after" },
    );

    if (!grievance) {
      return res.status(404).json({
        message: "Grievance not found.",
      });
    }

    res.json({
      success: true,
      grievance,
    });
  } catch (err) {
    console.error("Update status error: ", err);
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};
