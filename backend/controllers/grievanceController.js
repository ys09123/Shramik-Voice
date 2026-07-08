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
      .select("title description category status image remark createdAt")
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

/**
 * @name withdrawGrievance
 * @description Worker withdraws their own grievance — only allowed when status is Pending
 * @access Protected (worker)
 */
export const withdrawGrievance = async (req, res) => {
  try {
    const grievance = await Grievance.findById(req.params.id);

    if (!grievance) {
      return res.status(404).json({ message: "Grievance not found." });
    }

    if (grievance.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to withdraw this grievance." });
    }

    if (grievance.status !== "Pending") {
      return res.status(400).json({
        message: `Cannot withdraw a grievance that is already "${grievance.status}".`,
      });
    }

    await grievance.deleteOne();

    res.json({ success: true, message: "Grievance withdrawn successfully." });
  } catch (err) {
    console.error("Error withdrawing grievance: ", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
