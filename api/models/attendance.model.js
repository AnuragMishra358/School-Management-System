// Import mongoose to define MongoDB schema
const mongoose = require("mongoose");

// Define schema for attendance collection
const attendanceSchema = new mongoose.Schema({
  // Reference to the School model (foreign key)
  school: { type: mongoose.Schema.ObjectId, ref: "School" },

  // Reference to the Student model (foreign key)
  student: { type: mongoose.Schema.ObjectId, ref: "Student" },

  // Reference to the Class model (foreign key)
  class: { type: String, required:true },

  // The date for which the attendance is being marked
  date: { type: Date, required: true },

  // Attendance status: can only be either "Present" or "Absent"
  status: {
    type: String,
    enum: ["Present", "Absent"], // restricts values
    default: "Absent",           // default if not provided
  },

  // Automatically store the creation date of the attendance record
  createdAt: { type: Date, default: new Date() },
});

// Export the model so it can be used in other parts of the app
module.exports = mongoose.model("Attendance", attendanceSchema);
