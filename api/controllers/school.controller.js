// Load environment variables from a .env file into process.env
require("dotenv").config();
const cloudinary = require("../utils/cloudinary"); // import cloudinary

// Import built-in modules for handling file paths and filesystem operations
const path = require("path");
const fs = require("fs");

// Import bcrypt for hashing passwords securely
const bcrypt = require("bcrypt");

// Import JSON Web Token for secure authentication tokens
const jwt = require("jsonwebtoken");

// Import Mongoose School model to interact with the school collection in MongoDB
const School = require("../models/school.model");

// ============================= CONTROLLERS ================================

module.exports = {
  // ------------------------ REGISTER SCHOOL ------------------------
  registerSchool: async (req, res) => {
    try {
      const school = await School.findOne({ email: req.body.email });

      if (school) {
        return res.status(409).json({
          success: false,
          message: "School is already registered with this email",
        });
      }

      const file = req?.files?.image;

      if (!file) {
        return res
          .status(400)
          .json({ success: false, message: "Image file is required" });
      }

      // Upload to Cloudinary from buffer
      const result = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "schools",
      });

      // Hash the password
      const salt = bcrypt.genSaltSync(10);
      const hashPassword = bcrypt.hashSync(req.body.password, salt);

      const newSchool = new School({
        school_name: req.body.school_name,
        email: req.body.email,
        owner_name: req.body.owner_name,
        password: hashPassword,
        school_image: result.secure_url, // Cloudinary image URL
      });

      const savedSchool = await newSchool.save();

      res.status(200).json({
        success: true,
        data: savedSchool,
        message: "School is Registered Successfully.",
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "School Registration Failed." });
    }
  },

  // ------------------------ LOGIN SCHOOL ------------------------
  loginSchool: async (req, res) => {
    try {
      // Find the school by email
      const school = await School.findOne({ email: req.body.email });

      if (school) {
        // Compare password from request with stored hashed password
        const isAuth = bcrypt.compareSync(req.body.password, school.password);

        if (isAuth) {
          // Generate JWT token on successful authentication
          const jwtSecret = process.env.JWT_SECRET;

          const token = jwt.sign(
            {
              id: school._id,
              schoolId: school._id,
              owner_name: school.owner_name,
              school_name: school.school_name,
              image_url: school.school_image,
              role: "SCHOOL",
            },
            jwtSecret
          );

          // Send token in response header
          res.header("Authorization", token);

          // Return basic school info (not including password)
          res.status(200).json({
            success: true,
            message: "Login Successfully.",
            user: {
              id: school._id,
              owner_name: school.owner_name,
              school_name: school.school_name,
              image_url: school.school_image,
              role: "SCHOOL",
            },
          });
        } else {
          // Password doesn't match
          res
            .status(401)
            .json({ success: false, message: "Password is Incorrect." });
        }
      } else {
        // No school found with that email
        res
          .status(401)
          .json({ success: false, message: "Email is not registered." });
      }
    } catch (e) {
      // Handle any internal errors during login
      res.status(500).json({
        success: false,
        message: "Internal Server Error [SCHOOL LOGIN].",
      });
    }
  },

  // ------------------------ GET ALL SCHOOLS ------------------------
  getAllSchools: async (req, res) => {
    try {
      // Fetch all schools and exclude sensitive fields using `.select`
      const schools = await School.find().select([
        "-password", // Do not return password
        "-_id", // Do not return MongoDB _id
        "-email", // Do not return email
        "-owner_name", // Do not return owner's name
        "-createdAt", // Do not return creation time
      ]);

      // Return all schools
      res.status(200).json({
        success: true,
        message: "Success in fetching all schools.",
        schools,
      });
    } catch (e) {
      res.status(500).json({
        success: false,
        message: "Internal Server Error [ALL SCHOOL DATA].",
      });
    }
  },

  // ------------------------ GET OWN SCHOOL DATA ------------------------
  getSchoolOwnData: async (req, res) => {
    try {
      // Extract school ID from route parameters
      const id = req.user.schoolId;

      // Find school by ID
      const school = await School.findOne({ _id: id }).select(["-password"]);

      if (school) {
        // If found, return it
        res.status(200).json({
          success: true,
          school,
        });
      } else {
        // If not found, respond with 404
        res.status(404).json({
          success: false,
          message: "School not found.",
        });
      }
    } catch (e) {
      // Catch server-side errors
      res.status(500).json({
        success: false,
        message: "Internal Server Error [OWN SCHOOL DATA].",
      });
    }
  },

  // ------------------------ UPDATE SCHOOL ------------------------
  updateSchool: async (req, res) => {
    try {
      // Extract school ID from route
      const id = req.user.schoolId;

      // Find the school to be updated
      const school = await School.findOne({ _id: id });

      if (!school) {
        return res
          .status(404)
          .json({ success: false, message: "School not found." });
      }

      // Handle image update if a new image is uploaded
      if (req.files && req.files.image) {
        const file = req.files.image;

        const result = await cloudinary.uploader.upload(file.tempFilePath, {
          folder: "schools",
        });

        school.school_image = result.secure_url;
      }

      // Update the rest of the fields from req.body
      Object.keys(req.body).forEach((field) => {
        school[field] = req.body[field];
      });

      // Save changes
      await school.save();

      res.status(200).json({
        success: true,
        message: req.files
          ? "School updated Successfully"
          : "School updated Successfully (No image uploaded)",
        school,
      });
    } catch (e) {
      res
        .status(500)
        .json({ success: false, message: "School Update Failed." });
    }
  },
};
