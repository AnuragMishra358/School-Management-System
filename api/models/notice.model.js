// Import mongoose to define the schema and model
const mongoose = require("mongoose");

// Define the schema for notices in the system
const noticeSchema = new mongoose.Schema({
  // Reference to the School model to associate notice with a specific school
  school: { type: mongoose.Schema.ObjectId, ref: "School" },

  // Title of the notice (e.g., "Holiday Notice", "Exam Update")
  title: { type: String, required: true },

  // Detailed message of the notice
  message: { type: String, required: true },

  // Audience who should see this notice (can be either student or teacher only)
  audience: { type: String, enum: ["Student", "Teacher"], required: true },

  // Automatically store the creation time of the notice
  createdAt: { type: Date, default: new Date() },
});

// Export the Notice model to use in other parts of the project
module.exports = mongoose.model("Notice", noticeSchema);
