const express = require("express"); // Import Express to create a router
const authMiddleware=require('../auth/auth');
const { createClass, getAllClasses, updateClassWithId, deleteClassWithId, getClassWithId, getAttendeeClass } = require("../controllers/class.controller");


const router = express.Router(); // Create an Express router instance

router.post("/create",authMiddleware(['SCHOOL']) , createClass); // Route to register a new school
router.get("/all",authMiddleware(['SCHOOL','TEACHER','STUDENT']) , getAllClasses); // Route to get all schools
router.get("/single/:id",authMiddleware(['SCHOOL']) , getClassWithId);
router.get("/attendee",authMiddleware(['TEACHER']),getAttendeeClass)
router.patch("/update/:id",authMiddleware(['SCHOOL']) ,updateClassWithId); // Route to update school details by ID
router.delete("/delete/:id",authMiddleware(['SCHOOL']) ,deleteClassWithId); // Route to get a single school by ID

module.exports = router; // Export the router to use in main app
