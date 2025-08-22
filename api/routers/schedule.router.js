const express = require("express"); // Import Express to create a router
const authMiddleware=require('../auth/auth');
const { createSchedule, getSchedulesWithClass, updateScheduleWithId, deleteScheduleWithId, getScheduleWithId } = require("../controllers/schedule.controller");

const router = express.Router(); // Create an Express router instance

router.post("/create",authMiddleware(['SCHOOL']) , createSchedule); // Route to register a new school
router.get("/fetch-with-class/:id",authMiddleware(['SCHOOL','TEACHER','STUDENT']) , getSchedulesWithClass); // Route to get all schools
router.get("/fetch/:id",authMiddleware(['SCHOOL']) , getScheduleWithId);
router.patch("/update/:id",authMiddleware(['SCHOOL']) ,updateScheduleWithId); // Route to update school details by ID
router.delete("/delete/:id",authMiddleware(['SCHOOL']) ,deleteScheduleWithId); // Route to get a single school by ID

module.exports = router; // Export the router to use in main app
