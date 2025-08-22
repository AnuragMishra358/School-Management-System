// Import mongoose for schema creation
const mongoose = require("mongoose");

// Define schema for the Class collection
const classSchema = new mongoose.Schema({
  // Reference to the School model (foreign key)
  school: { type: mongoose.Schema.ObjectId, ref: "School" },

  // Class name or section in text form (e.g., "10th A")
  class_text: { type: String, required: true },

  // Numerical value of the class (e.g., 10 for 10th grade)
  class_num: { type: String, required: true },

  // Reference to the Teacher who is responsible for the class
  attendee: { type: mongoose.Schema.ObjectId, ref: "Teacher" },

  // Timestamp of when the class record was created
  createdAt: { type: Date, default: new Date() },
});

// Export the model to use in other parts of the application
module.exports = mongoose.model("Class", classSchema);
