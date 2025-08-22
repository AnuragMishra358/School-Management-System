// Import mongoose to work with MongoDB
const mongoose = require("mongoose");

// Define the schema for the Teacher collection
const teacherSchema = new mongoose.Schema({
  // Reference to the school the teacher belongs to
  school: { type: mongoose.Schema.ObjectId, ref: "School" },

  // Teacher's email address (must be provided)
  email: { type: String, required: true },

  // Teacher's full name (must be provided)
  name: { type: String, required: true },

  // Educational qualification of the teacher (e.g., B.Ed, M.Sc)
  qualification: { type: String, required: true },

  // Age of the teacher (stored as string)
  age: { type: String, required: true },

  // Gender of the teacher (e.g., Male, Female, Other)
  gender: { type: String, required: true },

  // Path or filename of the teacher's profile image
  teacher_image: { type: String, required: true },

  // Password for login (should be stored in hashed form)
  password: { type: String, required: true },

  // Timestamp to record when the teacher record was created
  createdAt: { type: Date, default: new Date() },
});

// Export the Teacher model so it can be used in other files
module.exports = mongoose.model("Teacher", teacherSchema);
