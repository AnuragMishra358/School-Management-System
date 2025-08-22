// Import mongoose to define the schema and interact with MongoDB
const mongoose = require("mongoose");

// Define the schema for the Student collection
const studentSchema = new mongoose.Schema({
  // Reference to the School this student belongs to (foreign key)
  school: { type: mongoose.Schema.ObjectId, ref: "School" },

  // Student's email address (must be unique and required)
  email: { type: String, required: true },

  // Full name of the student
  name: { type: String, required: true },

  // Class of the student (can be "5th", "10th", etc., stored as string)
  student_class: { type: String, required: true },

  // Age of the student
  age: { type: String, required: true },

  // Gender of the student (e.g., Male/Female/Other)
  gender: { type: String, required: true },

  // Name of the student's guardian/parent
  guardian: { type: String, required: true },

  // Contact number of the guardian (used in emergencies/communication)
  guardian_phone: { type: String, required: true },

  // File name or path of the student's profile photo (stored as string)
  student_image: { type: String, required: true },

  // Hashed password for student login/authentication
  password: { type: String, required: true },

  // Automatically records the date and time when student is registered
  createdAt: { type: Date, default: new Date() },
});

// Export the model to use it in controllers and routes
module.exports = mongoose.model("Student", studentSchema);
