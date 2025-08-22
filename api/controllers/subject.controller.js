const Subject = require("../models/subject.model");
const Exam=require("../models/examination.model");
const Schedule=require("../models/schedule.model");

module.exports = {
  
  getAllSubjects: async(req,res)=>{
    try {
        
        const schoolId=req.user.schoolId;
      
        const allSubjects =await Subject.find({school:schoolId});
       
        res.status(200).json({success:true,message:"All subjects fetched successfully.",data:allSubjects});
    } catch (error) {
        console.log("getAllSubjects error",error);
        res.status(500).json({success:false,message:"server error in getting subjects."})
    }
  },

  createSubject: async (req, res) => {
    try {
       
      
      const existSubject=await Subject.findOne({subject_name:req.body.subject_name,school:req.user.schoolId});
      if(existSubject){
        return res.status(409).json({success:false,message:"subject already exist"});
      }

      const newSubject = new Subject({
        school: req.user.schoolId,
        subject_name: req.body.subject_name,
        subject_codename: req.body.subject_codename,
      });
      
      await newSubject.save();
     
      res
        .status(200)
        .json({ success: true, message: "Subject created successfully.",data:newSubject });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: error });
    }
  },

  updateSubjectWithId: async (req, res) => {
    try {
     
      const existSubject=await Subject.findOne({subject_name:req.body.subject_name,school:req.user.schoolId});
     
      if(existSubject){
        return res.status(409).json({success:false,message:"subject already exist"});
      }
     
      let id = req.params.id;
    
      await Subject.findOneAndUpdate({ _id: id}, { $set: { ...req.body } });
    
      const subjectAfterUpdate = await Subject.findOne({ _id: id });
    
      res
        .status(200)
        .json({
          success: true,
          message: "Subject updated.",
          data: subjectAfterUpdate,
        });
    } catch (error) {
      console.log("update subject error=>", error);
      res
        .status(500)
        .json({ success: false, message: "server error in updating subject." });
    }
  },

  deleteSubjectWithId: async (req, res) => {
    try {
      let id = req.params.id;
      let schoolId = req.user.schoolId;

     
      const subjectExamCount=(await Exam.find({subject:id,school:schoolId})).length;
      const subjectScheduleCount=(await Schedule.find({subject:id,school:schoolId})).length;

      if((subjectExamCount===0)&&(subjectScheduleCount===0)){
        await Subject.findOneAndDelete({ _id: id, school: schoolId });
        res
        .status(200)
        .json({ success: true, message: "subject deleted successfully." });
      }
      else{
        res.status(500).json({success:false,message:"this subject is already in use."})
      }
      
    } catch (error) {
      console.log("delete subject error=>", error);
      res
        .status(500)
        .json({ success: false, message: "server error in deleting subject." });
    }
  },

};
