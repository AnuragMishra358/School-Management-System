
const express = require("express"); // Import Express to create a router
const authMiddleware=require('../auth/auth');
const { registerStudent, loginStudent, updateStudent, getStudentOwnData, getStudentWithQuery, getStudentWithId, deleteStudentWithId } = require("../controllers/student.controller");

const router = express.Router(); // Create an Express router instance

router.post("/register",authMiddleware(['SCHOOL']) , registerStudent); // Route to register a new school
router.get("/fetch-with-query",authMiddleware(['SCHOOL','TEACHER']) , getStudentWithQuery); // Route to get all schools
router.post("/login", loginStudent); // Route to log in a school (should be POST ideally)
router.patch("/update/:id",authMiddleware(['SCHOOL']) ,updateStudent); // Route to update school details by ID
router.get("/fetch-single",authMiddleware(['STUDENT']) , getStudentOwnData); // Route to get a single school by ID
router.get("/fetch/:id",authMiddleware(['SCHOOL']) , getStudentWithId);
router.delete("/delete/:id",authMiddleware(['SCHOOL']),deleteStudentWithId);

module.exports = router; // Export the router to use in main app
