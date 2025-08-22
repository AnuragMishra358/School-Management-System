// Import mongoose to define schema and interact with MongoDB
const mongoose = require("mongoose");

// Define the schema for the School collection
const schoolSchema = new mongoose.Schema({
  // Name of the school (required)
  school_name: { type: String, required: true },

  // Official email ID of the school (required)
  email: { type: String, required: true },

  // Name of the school's owner or admin (required)
  owner_name: { type: String, required: true },

  // File name or path of the school's image (stored as a string, required)
  school_image: { type: String, required: true },

  // Encrypted (hashed) password for school authentication (required)
  password: { type: String, required: true },

  // Date when the school record is created (defaults to current date/time)
  createdAt: { type: Date, default: new Date() },
});

// Export the model so it can be used in other files (controllers/routes)
module.exports = mongoose.model("School", schoolSchema);
