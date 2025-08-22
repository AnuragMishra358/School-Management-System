// Import mongoose to create schema and work with MongoDB
const mongoose = require("mongoose");

// Define the schema for the Subject collection
const subjectSchema = new mongoose.Schema({
  // Reference to the School that offers this subject (foreign key)
  school: { type: mongoose.Schema.ObjectId, ref: "School" },

  // Full name of the subject (e.g., "Mathematics", "Physics")
  subject_name: { type: String, required: true },

  // Codename or short name for the subject (e.g., "MATH101", "PHY")
  subject_codename: { type: String, required: true },

  // Timestamp to track when the subject was created
  createdAt: { type: Date, default: new Date() },
});

// Export the model to use it in other parts of the app
module.exports = mongoose.model("Subject", subjectSchema);
