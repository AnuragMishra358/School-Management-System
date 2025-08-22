const Notice = require("../models/notice.model");

module.exports = {
  getAllNotices: async (req, res) => {
    try {
      const schoolId = req.user.schoolId;

      const allNotices = await Notice.find({ school: schoolId });

      res
        .status(200)
        .json({
          success: true,
          message: "All Notices fetched successfully.",
          data: allNotices,
        });
    } catch (error) {
      console.log("getAllNotices error", error);
      res
        .status(500)
        .json({ success: false, message: "server error in getting Notices." });
    }
  },

  getNoticeWithId: async (req, res) => {
    try {
      const schoolId = req.user.schoolId;
      const NoticeId = req.params.id;

      const NoticeData = await Notice.findOne({
        school: schoolId,
        _id: NoticeId,
      });

      res
        .status(200)
        .json({
          success: true,
          message: " Notice fetched successfully.",
          data: NoticeData,
        });
    } catch (error) {
      console.log("getNotice error", error);
      res
        .status(500)
        .json({ success: false, message: "server error in getting Notice." });
    }
  },

  createNotice: async (req, res) => {
    try {
      const existNotice = await Notice.findOne({
        title: req.body.title,
        school: req.user.schoolId,
      });

      if (existNotice) {
        return res
          .status(409)
          .json({
            success: false,
            message: "Notice already exist with this title",
          });
      }

      const { title, message, audience } = req.body;

      const newNotice = new Notice({
        school: req.user.schoolId,
        title: title,
        message: message,
        audience: audience,
      });

      await newNotice.save();

      res
        .status(200)
        .json({
          success: true,
          message: "Notice created successfully.",
          data: newNotice,
        });
    } catch (error) {
      res.status(500).json({ success: false, message: error });
    }
  },

  updateNoticeWithId: async (req, res) => {
    try {
      

      let id = req.params.id;
      await Notice.findOneAndUpdate({ _id: id }, { $set: { ...req.body } });

      const NoticeAfterUpdate = await Notice.findOne({ _id: id });

      res.status(200).json({
        success: true,
        message: "Notice updated.",
        data: NoticeAfterUpdate,
      });
    } catch (error) {
      console.log("update Notice error=>", error);
      res
        .status(500)
        .json({ success: false, message: "server error in updating Notice." });
    }
  },

  deleteNoticeWithId: async (req, res) => {
    try {
      let id = req.params.id;

      let schoolId = req.user.schoolId;

      await Notice.findOneAndDelete({ _id: id, school: schoolId });
      console.log("3");
      res
        .status(200)
        .json({ success: true, message: "Notice deleted successfully." });
    } catch (error) {
      console.log("delete Notice error=>", error);
      res
        .status(500)
        .json({ success: false, message: "server error in deleting Notice." });
    }
  },
};
