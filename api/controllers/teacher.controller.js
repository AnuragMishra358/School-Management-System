// Load environment variables from a .env file into process.env
require("dotenv").config();
const cloudinary = require("../utils/cloudinary"); // import cloudinary

// Import bcrypt for hashing passwords securely
const bcrypt = require("bcrypt");

// Import JSON Web Token for secure authentication tokens
const jwt = require("jsonwebtoken");

// Import Mongoose Teacher model to interact with the Teacher collection in MongoDB
const Teacher = require("../models/teacher.model");

// ============================= CONTROLLERS ================================

module.exports = {
  // ------------------------ REGISTER Teacher ------------------------
  registerTeacher: async (req, res) => {
    try {
      const teacher = await Teacher.findOne({ email: req.body.email });

      if (teacher) {
        return res.status(409).json({
          success: false,
          message: "Teacher is already registered with this email",
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
        folder: "Teachers",
      });

      // Hash the password
      const salt = bcrypt.genSaltSync(10);
      const hashPassword = bcrypt.hashSync(req.body.password, salt);

      const newTeacher = new Teacher({
        school: req.user.schoolId,
        name: req.body.name,
        qualification: req.body.qualification,
        age: req.body.age,
        gender: req.body.gender,
        email: req.body.email,
        password: hashPassword,
        teacher_image: result.secure_url, // Cloudinary image URL
      });

      const savedTeacher = await newTeacher.save();

      res.status(200).json({
        success: true,
        data: savedTeacher,
        message: "Teacher is Registered Successfully.",
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Teacher Registration Failed." });
    }
  },

  // ------------------------ LOGIN Teacher ------------------------
  loginTeacher: async (req, res) => {
    try {
      // Find the Teacher by email
      
      const teacher = await Teacher.findOne({ email: req.body.email });

      if (teacher) {
        // Compare password from request with stored hashed password
        const isAuth = bcrypt.compareSync(req.body.password, teacher.password);

        if (isAuth) {
          // Generate JWT token on successful authentication
          const jwtSecret = process.env.JWT_SECRET;

          const token = jwt.sign(
            {
              id: teacher._id,
              schoolId: teacher.school,
              name: teacher.name,
              image_url: teacher.teacher_image,
              role: "TEACHER",
            },
            jwtSecret
          );

          // Send token in response header
          res.header("Authorization", token);

          // Return basic Teacher info (not including password)
          res.status(200).json({
            success: true,
            message: "Login Successfully.",
            user: {
              id: teacher._id,
              schoolId: teacher.school,
              name: teacher.name,
              image_url: teacher.teacher_image,
              role: "TEACHER",
            },
          });
        } else {
          // Password doesn't match
          res
            .status(401)
            .json({ success: false, message: "Password is Incorrect." });
        }
      } else {
        // No Teacher found with that email
        res
          .status(401)
          .json({ success: false, message: "Email is not registered." });
      }
    } catch (e) {
      // Handle any internal errors during login
      res.status(500).json({
        success: false,
        message: "Internal Server Error [Teacher LOGIN].",
      });
    }
  },

  // ------------------------ GET ALL TeacherS ------------------------
  getTeacherWithQuery: async (req, res) => {
    try {
      const filterQuery = {};
      const schoolId = req.user.schoolId;
      filterQuery["school"] = schoolId;

      if (req.query.hasOwnProperty("search")) {
        filterQuery["name"] = { $regex: req.query.search, $options: "i" };
      }

      

      // Fetch all Teachers and exclude sensitive fields using `.select`
      const teachers = await Teacher.find(filterQuery).select([
        "-password", // Do not return password
      ]);

      // Return all Teachers
      res.status(200).json({
        success: true,
        message: "Success in fetching all Teachers.",
        teachers,
      });
    } catch (e) {
      res.status(500).json({
        success: false,
        message: "Internal Server Error [ALL Teacher DATA].",
      });
    }
  },

  // ------------------------ GET OWN Teacher DATA ------------------------
  getTeacherOwnData: async (req, res) => {
    try {
      // Extract Teacher ID from route parameters
     
      const id = req.user.id;
     
      const schoolId = req.user.schoolId;
     
      // Find Teacher by ID
      const teacher = await Teacher.findOne({
        _id: id,
        school: schoolId,
      }).select(["-password"]);

      if (teacher) {
        // If found, return it
        res.status(200).json({
          success: true,
          teacher,
        });
      } else {
        // If not found, respond with 404
        res.status(404).json({
          success: false,
          message: "Teacher not found.",
        });
      }
    } catch (e) {
      // Catch server-side errors
      res.status(500).json({
        success: false,
        message: "Internal Server Error [OWN Teacher DATA].",
      });
    }
  },

  getTeacherWithId: async (req, res) => {
    try {
      // Extract Teacher ID from route parameters
      const id = req.params.id;
      const schoolId = req.user.schoolId;

      // Find Teacher by ID
      const teacher = await Teacher.findOne({
        _id: id,
        school: schoolId,
      }).select(["-password"]);

      if (teacher) {
        // If found, return it
        res.status(200).json({
          success: true,
          teacher,
        });
      } else {
        // If not found, respond with 404
        res.status(404).json({
          success: false,
          message: "Teacher not found.",
        });
      }
    } catch (e) {
      // Catch server-side errors
      res.status(500).json({
        success: false,
        message: "Internal Server Error [OWN Teacher DATA].",
      });
    }
  },

  // ------------------------ UPDATE Teacher ------------------------
  updateTeacher: async (req, res) => {
    try {
      // Extract Teacher ID from route
      const id = req.params.id;
      const schoolId = req.user.schoolId;

      // Find the Teacher to be updated
      const teacher = await Teacher.findOne({ _id: id, school: schoolId });

      if (!teacher) {
        return res
          .status(404)
          .json({ success: false, message: "Teacher not found." });
      }

      // Handle image update if a new image is uploaded
      if (req.files && req.files.image) {
        const file = req.files.image;

        const result = await cloudinary.uploader.upload(file.tempFilePath, {
          folder: "Teachers",
        });

        teacher.teacher_image = result.secure_url;
      }

      // Update the rest of the fields from req.body
      Object.keys(req.body).forEach((field) => {
        teacher[field] = req.body[field];
      });

      if (req.body.password) {
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(req.body.password, salt);
        teacher.password = hashPassword;
      }

      // Save changes
      await teacher.save();

      res.status(200).json({
        success: true,
        message: req.files
          ? "Teacher updated Successfully"
          : "Teacher updated Successfully (No image uploaded)",
        teacher,
      });
    } catch (e) {
      res
        .status(500)
        .json({ success: false, message: "Teacher Updation Failed." });
    }
  },

  deleteTeacherWithId: async (req, res) => {
    try {
      const id = req.params.id;
      const schoolId = req.user.schoolId;
      await Teacher.findOneAndDelete({ _id: id, school: schoolId });
      const teachers = await Teacher.find({ school: schoolId });
      res
        .status(200)
        .json({
          success: true,
          message: "Teacher deleted successfully",
          teachers,
        });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Teacher Deletion Failed." });
    }
  },
};