const express = require("express"); // Import Express to create a router
const authMiddleware=require('../auth/auth');
const { createNotice, getAllNotices, getNoticeWithId, updateNoticeWithId, deleteNoticeWithId } = require("../controllers/notice.controller");

const router = express.Router(); // Create an Express router instance

router.post("/create",authMiddleware(['SCHOOL']) , createNotice); // Route to register a new school
router.get("/all",authMiddleware(['SCHOOL','TEACHER','STUDENT']) , getAllNotices); // Route to get all schools
router.get("/single/:id",authMiddleware(['SCHOOL']) , getNoticeWithId);
router.patch("/update/:id",authMiddleware(['SCHOOL']) ,updateNoticeWithId); // Route to update school details by ID
router.delete("/delete/:id",authMiddleware(['SCHOOL']) ,deleteNoticeWithId); // Route to get a single school by ID

module.exports = router; // Export the router to use in main app
