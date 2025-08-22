const express = require("express"); // Import Express to create a router
const authMiddleware=require('../auth/auth');
const { createSubject, getAllSubjects, updateSubjectWithId, deleteSubjectWithId } = require("../controllers/subject.controller");



const router = express.Router(); // Create an Express router instance

router.post("/create",authMiddleware(['SCHOOL']) , createSubject); // Route to register a new school
router.get("/all",authMiddleware(['SCHOOL']) , getAllSubjects); // Route to get all schools
router.patch("/update/:id",authMiddleware(['SCHOOL']) ,updateSubjectWithId); // Route to update school details by ID
router.delete("/delete/:id",authMiddleware(['SCHOOL']) ,deleteSubjectWithId); // Route to get a single school by ID

module.exports = router; // Export the router to use in main app
