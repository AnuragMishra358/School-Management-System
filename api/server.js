require("dotenv").config(); // Load environment variables from .env file

const schoolRouter = require("./routers/school.router"); // Import school-related routes
const classRouter = require("./routers/class.router");
const subjectRouter = require("./routers/subject.router");
const studentRouter = require("./routers/student.router");
const teacherRouter = require("./routers/teacher.router");
const scheduleRouter = require("./routers/schedule.router");
const attendanceRouter = require("./routers/attendance.router");
const examinationRouter = require("./routers/examination.router");
const noticeRouter = require("./routers/notice.router");

const express = require("express"); // Import Express framework
const cors = require("cors"); // Import CORS middleware
const cookieParser = require("cookie-parser"); // Import middleware to parse cookies
const fileUpload = require("express-fileupload");
const app = express(); // Create Express app instance

app.use(express.json()); // Parse incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded form data
const corsOption = { exposedHeaders: "Authorization" };
app.use(cors(corsOption)); // Enable CORS for all routes
app.use(cookieParser()); // Parse cookies from incoming requests

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.use("/api/school", schoolRouter); // Mount school router at /api/school
app.use("/api/class", classRouter);
app.use("/api/subject", subjectRouter);
app.use("/api/student", studentRouter);
app.use("/api/teacher", teacherRouter);
app.use("/api/schedule", scheduleRouter);
app.use("/api/attendance",attendanceRouter);
app.use("/api/examination",examinationRouter);
app.use("/api/notice",noticeRouter);

const PORT = process.env.PORT; // Get port from environment variables

app.listen(PORT, () => console.log("server is running at Port=>", PORT)); // Start server on specified port
const connectWithDb = require("./config/database");
connectWithDb();

app.get('/', (req, res) => {
  res.send('MegaBackend API is running 🚀');
});
