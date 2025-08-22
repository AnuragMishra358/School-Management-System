// Load environment variables from a .env file into process.env
require("dotenv").config();
const cloudinary = require("../utils/cloudinary"); // import cloudinary

// Import bcrypt for hashing passwords securely
const bcrypt = require("bcrypt");

// Import JSON Web Token for secure authentication tokens
const jwt = require("jsonwebtoken");

// Import Mongoose Student model to interact with the Student collection in MongoDB
const Student = require("../models/student.model");

// ============================= CONTROLLERS ================================

module.exports = {
  // ------------------------ REGISTER Student ------------------------
  registerStudent: async (req, res) => {
    try {
      const student = await Student.findOne({ email: req.body.email });

      if (student) {
        return res.status(409).json({
          success: false,
          message: "Student is already registered with this email",
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
        folder: "Students",
      });

      // Hash the password
      const salt = bcrypt.genSaltSync(10);
      const hashPassword = bcrypt.hashSync(req.body.password, salt);

      const newStudent = new Student({
        school: req.user.schoolId,
        name: req.body.name,
        student_class: req.body.student_class,
        age: req.body.age,
        gender: req.body.gender,
        guardian: req.body.guardian,
        guardian_phone: req.body.guardian_phone,
        email: req.body.email,
        password: hashPassword,
        student_image: result.secure_url, // Cloudinary image URL
      });

      const savedStudent = await newStudent.save();

      res.status(200).json({
        success: true,
        data: savedStudent,
        message: "Student is Registered Successfully.",
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Student Registration Failed." });
    }
  },

  // ------------------------ LOGIN Student ------------------------
  loginStudent: async (req, res) => {
    try {
      // Find the Student by email
      const student = await Student.findOne({ email: req.body.email });

      if (student) {
        // Compare password from request with stored hashed password
        const isAuth = bcrypt.compareSync(req.body.password, student.password);

        if (isAuth) {
          // Generate JWT token on successful authentication
          const jwtSecret = process.env.JWT_SECRET;

          const token = jwt.sign(
            {
              id: student._id,
              schoolId: student.school,
              name: student.name,
              image_url: student.student_image,
              role: "STUDENT",
            },
            jwtSecret
          );

          // Send token in response header
          res.header("Authorization", token);

          // Return basic Student info (not including password)
          res.status(200).json({
            success: true,
            message: "Login Successfully.",
            user: {
              id: student._id,
              schoolId: student.school,
              name: student.name,
              image_url: student.student_image,
              role: "STUDENT",
            },
          });
        } else {
          // Password doesn't match
          res
            .status(401)
            .json({ success: false, message: "Password is Incorrect." });
        }
      } else {
        // No Student found with that email
        res
          .status(401)
          .json({ success: false, message: "Email is not registered." });
      }
    } catch (e) {
      // Handle any internal errors during login
      res.status(500).json({
        success: false,
        message: "Internal Server Error [Student LOGIN].",
      });
    }
  },

  // ------------------------ GET ALL StudentS ------------------------
  getStudentWithQuery: async (req, res) => {
    try {
      const filterQuery = {};
      const schoolId = req.user.schoolId;
      filterQuery["school"] = schoolId;

      if (req.query.hasOwnProperty("search")) {
        filterQuery["name"] = { $regex: req.query.search, $options: "i" };
      }

      if (req.query.hasOwnProperty("student_class")) {
        filterQuery["student_class"] = req.query.student_class;
      }
      
      // Fetch all Students and exclude sensitive fields using `.select`
      const students = await Student.find(filterQuery).select([
        "-password", // Do not return password
      ]);

      // Return all Students
      res.status(200).json({
        success: true,
        message: "Success in fetching all Students.",
        students,
      });
    } catch (e) {
      res.status(500).json({
        success: false,
        message: "Internal Server Error [ALL Student DATA].",
      });
    }
  },

  // ------------------------ GET OWN Student DATA ------------------------
  getStudentOwnData: async (req, res) => {
    try {
      // Extract Student ID from route parameters
      const id = req.user.id;
      const schoolId = req.user.schoolId;

      // Find Student by ID
      const student = await Student.findOne({
        _id: id,
        school: schoolId,
      }).select(["-password"]);

      if (student) {
        // If found, return it
        res.status(200).json({
          success: true,
          student,
        });
      } else {
        // If not found, respond with 404
        res.status(404).json({
          success: false,
          message: "Student not found.",
        });
      }
    } catch (e) {
      // Catch server-side errors
      res.status(500).json({
        success: false,
        message: "Internal Server Error [OWN Student DATA].",
      });
    }
  },

  getStudentWithId: async (req, res) => {
    try {
      // Extract Student ID from route parameters
      const id = req.params.id;
      const schoolId = req.user.schoolId;

      // Find Student by ID
      const student = await Student.findOne({
        _id: id,
        school: schoolId,
      }).select(["-password"]);

      if (student) {
        // If found, return it
        res.status(200).json({
          success: true,
          student,
        });
      } else {
        // If not found, respond with 404
        res.status(404).json({
          success: false,
          message: "Student not found.",
        });
      }
    } catch (e) {
      // Catch server-side errors
      res.status(500).json({
        success: false,
        message: "Internal Server Error [OWN Student DATA].",
      });
    }
  },

  // ------------------------ UPDATE Student ------------------------
  updateStudent: async (req, res) => {
    try {
      // Extract Student ID from route
      const id = req.params.id;
      const schoolId = req.user.schoolId;

      // Find the Student to be updated
      const student = await Student.findOne({ _id: id, school: schoolId });

      if (!student) {
        return res
          .status(404)
          .json({ success: false, message: "Student not found." });
      }

      // Handle image update if a new image is uploaded
      if (req.files && req.files.image) {
        const file = req.files.image;

        const result = await cloudinary.uploader.upload(file.tempFilePath, {
          folder: "Students",
        });

        student.student_image = result.secure_url;
      }

      // Update the rest of the fields from req.body
      Object.keys(req.body).forEach((field) => {
        student[field] = req.body[field];
      });

      if (req.body.password) {
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(req.body.password, salt);
        student.password = hashPassword;
      }

      // Save changes
      await student.save();

      res.status(200).json({
        success: true,
        message: req.files
          ? "Student updated Successfully"
          : "Student updated Successfully (No image uploaded)",
        student,
      });
    } catch (e) {
      res
        .status(500)
        .json({ success: false, message: "Student Updation Failed." });
    }
  },

  deleteStudentWithId: async (req, res) => {
    try {
      const id = req.params.id;
      const schoolId = req.user.schoolId;
      await Student.findOneAndDelete({ _id: id, school: schoolId });
      const students = await Student.find({ school: schoolId });
      res
        .status(200)
        .json({
          success: true,
          message: "student deleted successfully",
          students,
        });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Student Deletion Failed." });
    }
  },
};
