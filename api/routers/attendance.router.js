
const express = require("express"); // Import Express to create a router
const authMiddleware=require('../auth/auth');
const { markAttendance, getAttendance, checkAttendance } = require("../controllers/attendance.controller");

const router = express.Router(); // Create an Express router instance

router.post("/mark",authMiddleware(['TEACHER']) , markAttendance); // Route to register a new school
router.get("/:studentId",authMiddleware(['SCHOOL','STUDENT']) , getAttendance); // Route to get all schools
router.get("/check/:class",authMiddleware(['TEACHER']) ,checkAttendance); // Route to update school details by ID


module.exports = router; // Export the router to use in main app
