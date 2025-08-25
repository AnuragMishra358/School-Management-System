const Examination = require("../models/examination.model");

module.exports = {
  newExamination: async (req, res) => {
    try {
      const schoolId = req.user.schoolId;
      const { date, subjectId, classId, examType } = req.body;
      const exam=Examination.findOne({school:schoolId,class:classId,examDate:date});
      if(exam){
        res.status(500).json({success:false,message:"exam already exist on this date",data:exam});
        return ;
      }
      // console.log("date",date);
      const newExamination = new Examination({
        examDate: date,
        examType: examType,
        subject: subjectId,
        class: classId,
        school: schoolId,
      });
      await newExamination.save();
      res
        .status(200)
        .json({
          success: true,
          message: "examination created successfully",
          data: newExamination,
        });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "error in creating examination" });
    }
  },

  getAllExaminations: async (req, res) => {
    try {
      const {schoolId} = req.user;
      const allExaminations = await Examination.find({ school: schoolId }).populate(['subject','class']);
      res
        .status(200)
        .json({
          success: true,
          message: "examinations get successfully",
          data: allExaminations,
        });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "error in getting examinations" });
    }
  },

  getExaminationWithClass: async (req, res) => {
    try {
      // console.log("user",req.user);
      const {schoolId} = req.user;
      const classId = req.params.id;
      const allExaminations = await Examination.find({
        school: schoolId,
        class: classId,
      }).populate(['subject','class']);
      // console.log("exams=>",allExaminations);
      res
        .status(200)
        .json({
          success: true,
          message: "examinations get successfully",
          data: allExaminations,
        });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "error in getting examinations" });
    }
  },

  getExaminationWithId: async (req, res) => {
    try {
      const schoolId = req.user.schoolId;
      const id = req.params.id;
      const allExaminations = await Examination.findOne({
        school: schoolId,
        _id: id,
      }).populate(['subject','class']);
      res
        .status(200)
        .json({
          success: true,
          message: "examinations get successfully",
          data: allExaminations,
        });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "error in getting examinations" });
    }
  },

  updateExaminationWithId: async (req, res) => {
    try {
      const schoolId = req.user.schoolId;
      const examinationId = req.params.id;
      const { date, subjectId, examType,classId } = req.body;
      const exam=Examination.findOne({school:schoolId,class:classId,examDate:date});
      if(exam){
        res.status(500).json({success:false,message:"exam already exist on this date"});
        return ;
      }
      await Examination.findOneAndUpdate(
        { _id: examinationId, school: schoolId },
        {
          $set: {
            examDate: date,
            subject: subjectId,
            examType: examType,
            class:classId
          },
        }
      );
      res
        .status(200)
        .json({ success: true, message: "examination updated successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "error in updating examination" });
    }
  },

  deleteExaminationWithId: async (req, res) => {
    try {
      const schoolId = req.user.schoolId;
      const examinationId = req.params.id;
      await Examination.findOneAndDelete({
        _id: examinationId,
        school: schoolId,
      });
      res
        .status(200)
        .json({ success: true, message: "examination deleted successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "error in deleting examination" });
    }
  },
};
