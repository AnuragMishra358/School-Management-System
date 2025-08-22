// Import mongoose to define schema and interact with MongoDB
const mongoose = require("mongoose");

// Define the schema for scheduling classes or lectures
const scheduleSchema = new mongoose.Schema({
  // Reference to the School model to associate the schedule with a particular school
  school: { type: mongoose.Schema.ObjectId, ref: "School" },

  // Reference to the Teacher model who is responsible for the scheduled lecture
  teacher: { type: mongoose.Schema.ObjectId, ref: "Teacher" },

  // Reference to the Subject model to indicate the subject being taught
  subject: { type: mongoose.Schema.ObjectId, ref: "Subject" },

  // Reference to the Class model where the lecture will take place
  class: { type: mongoose.Schema.ObjectId, ref: "Class" },

  // Start time of the lecture or scheduled class (Date object)
  startTime: { type: Date, required: true },

  // End time of the lecture or scheduled class (Date object)
  endTime: { type: Date, required: true },

  // Automatically store the creation date of the schedule entry
  createdAt: { type: Date, default: new Date() },
});

// Export the model so it can be used in routes/controllers
module.exports = mongoose.model("Schedule", scheduleSchema);
