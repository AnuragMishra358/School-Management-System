// Import mongoose to define the schema
const mongoose = require("mongoose");

// Define the schema for storing examination details
const examinationSchema = new mongoose.Schema({
  // Reference to the School model (foreign key)
  school: { type: mongoose.Schema.ObjectId, ref: "School" },

  // Date on which the exam will be conducted
  examDate: { type: Date, required: true },

  // Reference to the Subject model (foreign key)
  subject: { type: mongoose.Schema.ObjectId, ref: "Subject" },

  // Type of exam (e.g., "Midterm", "Final", "Unit Test", etc.)
  examType: { type: String, required: true },

  // Reference to the Class model (foreign key)
  class: { type: mongoose.Schema.ObjectId, ref: "Class" },

  // Automatically store the date when this exam record was created
  createdAt: { type: Date, default: new Date() },
});

// Export the Examination model so it can be used elsewhere
module.exports = mongoose.model("Examination", examinationSchema);
