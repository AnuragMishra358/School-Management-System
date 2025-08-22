const express = require("express"); // Import Express to create a router
const authMiddleware=require('../auth/auth');
const { newExamination, getAllExaminations, getExaminationWithClass, updateExaminationWithId, deleteExaminationWithId, getExaminationWithId } = require("../controllers/examination.controller");

const router = express.Router(); // Create an Express router instance

router.post("/create",authMiddleware(['SCHOOL']) , newExamination); // Route to register a new school
router.get("/all",authMiddleware(['SCHOOL','TEACHER']) , getAllExaminations); // Route to get all schools
router.get("/class/:id",authMiddleware(['SCHOOL','TEACHER','STUDENT']) , getExaminationWithClass);
router.get("/:id",authMiddleware(['SCHOOL']) , getExaminationWithId);
router.patch("/update/:id",authMiddleware(['SCHOOL']) ,updateExaminationWithId); // Route to update school details by ID
router.delete("/delete/:id",authMiddleware(['SCHOOL']) ,deleteExaminationWithId); // Route to get a single school by ID

module.exports = router; // Export the router to use in main app
