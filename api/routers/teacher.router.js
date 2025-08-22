
const express = require("express"); // Import Express to create a router
const authMiddleware=require('../auth/auth');
const { registerTeacher, loginTeacher, updateTeacher, getTeacherOwnData, getTeacherWithQuery, getTeacherWithId, deleteTeacherWithId } = require("../controllers/teacher.controller");

const router = express.Router(); // Create an Express router instance

router.post("/register",authMiddleware(['SCHOOL']) , registerTeacher); // Route to register a new school
router.get("/fetch-with-query",authMiddleware(['SCHOOL']) , getTeacherWithQuery); // Route to get all schools
router.post("/login", loginTeacher); // Route to log in a school (should be POST ideally)
router.patch("/update/:id",authMiddleware(['SCHOOL']) ,updateTeacher); // Route to update school details by ID
router.get("/fetch-single",authMiddleware(['TEACHER']) , getTeacherOwnData); // Route to get a single school by ID
router.get("/fetch/:id",authMiddleware(['SCHOOL']) , getTeacherWithId);
router.delete("/delete/:id",authMiddleware(['SCHOOL']),deleteTeacherWithId);

module.exports = router; // Export the router to use in main app
