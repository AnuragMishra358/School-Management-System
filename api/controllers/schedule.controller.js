const Schedule = require("../models/schedule.model");

module.exports = {
  getSchedulesWithClass: async (req, res) => {
    try {
      const classId = req.params.id;
      const schoolId = req.user.schoolId;

      const allSchedules = await Schedule.find({
        school: schoolId,
        class: classId,
      }).populate(["teacher", "subject"]);

      res.status(200).json({
        success: true,
        message: "All Schedules fetched successfully.",
        data: allSchedules,
      });
    } catch (error) {
      console.log("getAllSchedules error", error);
      res.status(500).json({
        success: false,
        message: "server error in getting Schedules.",
      });
    }
  },

  getScheduleWithId: async (req, res) => {
    try {
      const id = req.params.id;
      const schoolId = req.user.schoolId;

      const schedule = await Schedule.findOne({
        school: schoolId,
        _id: id,
      }).populate(["teacher", "subject"]);

      res.status(200).json({
        success: true,
        message: "Schedule fetched successfully.",
        data: schedule,
      });
    } catch (error) {
      console.log("getSchedule error", error);
      res.status(500).json({
        success: false,
        message: "server error in getting Schedule.",
      });
    }
  },

  createSchedule: async (req, res) => {
    try {
      // console.log("req ki body",req.body);
      const existSchedule = await Schedule.findOne({
        class: req.body.formData.class,
        school: req.user.schoolId,
        startTime: req.body.startTime,
      });
      if (existSchedule) {
        return res
          .status(409)
          .json({ success: false, message: "Schedule already exist" });
      }

      const newSchedule = new Schedule({
        school: req.user.schoolId,
        class: req.body.formData.class,
        teacher: req.body.formData.teacher,
        subject: req.body.formData.subject,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
      });

      await newSchedule.save();

      res.status(200).json({
        success: true,
        message: "Schedule created successfully.",
        data: newSchedule,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error });
    }
  },

  updateScheduleWithId: async (req, res) => {
    try {
      // console.log("print data", req.body);
      const existSchedule = await Schedule.findOne({
        class: req.body.formData.class,
        school: req.user.schoolId,
        startTime: req.body.startTime,
      });
      if (existSchedule) {
        return res
          .status(409)
          .json({ success: false, message: "Schedule already exist" });
      }

      let id = req.params.id;
      const { formData, startTime, endTime } = req.body;

      await Schedule.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            teacher: formData.teacher,
            subject: formData.subject,
            class: formData.class,
            startTime,
            endTime,
          },
        }
      );

      const ScheduleAfterUpdate = await Schedule.findOne({ _id: id }).populate([
        "teacher",
        "subject",
      ]);

      res.status(200).json({
        success: true,
        message: "Schedule updated.",
        data: ScheduleAfterUpdate,
      });
    } catch (error) {
      console.log("update Schedule error=>", error);
      res.status(500).json({
        success: false,
        message: "server error in updating Schedule.",
      });
    }
  },

  deleteScheduleWithId: async (req, res) => {
    try {
      let id = req.params.id;
      let schoolId = req.user.schoolId;

      await Schedule.findOneAndDelete({ _id: id, school: schoolId });
      res
        .status(200)
        .json({ success: true, message: "Schedule deleted successfully." });
    } catch (error) {
      console.log("delete Schedule error=>", error);
      res.status(500).json({
        success: false,
        message: "server error in deleting Schedule.",
      });
    }
  },
};
