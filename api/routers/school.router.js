const express = require("express"); // Import Express to create a router
const authMiddleware=require('../auth/auth');

const {
  registerSchool,
  getAllSchools,
  loginSchool,
  updateSchool,
  getSchoolOwnData,
} = require("../controllers/school.controller"); // Import controller functions

const router = express.Router(); // Create an Express router instance

router.post("/register", registerSchool); // Route to register a new school
router.get("/all", getAllSchools); // Route to get all schools
router.post("/login", loginSchool); // Route to log in a school (should be POST ideally)
router.patch("/update",authMiddleware(['SCHOOL']) ,updateSchool); // Route to update school details by ID
router.get("/fetch-single",authMiddleware(['SCHOOL']) , getSchoolOwnData); // Route to get a single school by ID

module.exports = router; // Export the router to use in main app
