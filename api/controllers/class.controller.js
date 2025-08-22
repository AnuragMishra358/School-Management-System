const Class = require("../models/class.model");
const Student = require("../models/student.model");
const Exam=require("../models/examination.model");
const Schedule=require("../models/schedule.model");

module.exports = {
  
  getAllClasses: async(req,res)=>{
    try {
        
        const schoolId=req.user.schoolId;
      
        const allClasses =await Class.find({school:schoolId});
       
        res.status(200).json({success:true,message:"All classes fetched successfully.",data:allClasses});
    } catch (error) {
        console.log("getAllClasses error",error);
        res.status(500).json({success:false,message:"server error in getting classes."})
    }
  },

  getClassWithId: async(req,res)=>{
    try {
        
        const schoolId=req.user.schoolId;
        const classId=req.params.id;
      
        const classData =await Class.findOne({school:schoolId,_id:classId}).populate('attendee');
       
        res.status(200).json({success:true,message:" class fetched successfully.",data:classData});
    } catch (error) {
        console.log("getClass error",error);
        res.status(500).json({success:false,message:"server error in getting class."})
    }
  },

  getAttendeeClass: async(req,res)=>{
    try {
        
        const schoolId=req.user.schoolId;
        const attendeeId=req.user.id;
      
        const classData =await Class.find({school:schoolId,attendee:attendeeId});
       
        res.status(200).json({success:true,message:" class fetched successfully.",data:classData});
    } catch (error) {
        console.log("getClass error",error);
        res.status(500).json({success:false,message:"server error in getting class."})
    }
  },

  createClass: async (req, res) => {
    try {
       
      
      const existClass=await Class.findOne({class_num:req.body.class_num,school:req.user.schoolId});
      if(existClass){
        return res.status(409).json({success:false,message:"class already exist"});
      }
      const newClass = new Class({
        school: req.user.schoolId,
        class_text: req.body.class_text,
        class_num: req.body.class_num,
      });
      
      await newClass.save();
     
      res
        .status(200)
        .json({ success: true, message: "class created successfully.",data:newClass });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: error });
    }
  },

  updateClassWithId: async (req, res) => {
    try { 
      
      const existClass=await Class.findOne({class_num:req.body?.class_num,school:req.user.schoolId});
      if(existClass){
        return res.status(409).json({success:false,message:"class already exist"});
      }
      
      let id = req.params.id;
      
      
      await Class.findOneAndUpdate({ _id: id }, { $set: { ...req.body } });
      
      const classAfterUpdate = await Class.findOne({ _id: id });
      
      res
        .status(200)
        .json({
          success: true,
          message: "Class updated.",
          data: classAfterUpdate,
        });
    } catch (error) {
      console.log("update class error=>", error);
      res
        .status(500)
        .json({ success: false, message: "server error in updatin class." });
    }
  },

  deleteClassWithId: async (req, res) => {
    try {
      let id = req.params.id;
      let schoolId = req.user.schoolId;

      const classStudentCount=(await Student.find({student_class:id,school:schoolId})).length;
      const classExamCount=(await Exam.find({class:id,school:schoolId})).length;
      const classScheduleCount=(await Schedule.find({class:id,school:schoolId})).length;

      if((classStudentCount===0)&&(classExamCount===0)&&(classScheduleCount===0)){
        await Class.findOneAndDelete({ _id: id, school: schoolId });
        res
        .status(200)
        .json({ success: true, message: "class deleted successfully." });
      }
      else{
        res.status(500).json({success:false,message:"this class is already in use."})
      }
      
    } catch (error) {
      console.log("delete class error=>", error);
      res
        .status(500)
        .json({ success: false, message: "server error in deleting class." });
    }
  },

};
