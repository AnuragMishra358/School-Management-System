const moment = require("moment");
const Attendance=require("../models/attendance.model");

module.exports ={

    markAttendance: async(req,res)=>{
        try {
            const {studentId,date,status,studentClass}=req.body;
            const schoolId=req.user.schoolId;
          
            const newAttendance=new Attendance({
                student:studentId,
                date:date,
                status:status,
                class:studentClass,
                school:schoolId
            })
           
            await newAttendance.save();
          
            res.status(200).json({success:true,message:"Attendance marked successfully",newAttendance});
        } catch (error) {
            res.status(500).json({success:false, message:"error in marking attendance"})
        }
    },

    getAttendance:async(req,res)=>{
        try {
            const {studentId}=req.params;
            const attendance=await Attendance.find({student:studentId}).populate('student');
            res.status(200).json({success:true,message:"attendance fetched successfully",attendance})
        } catch (error) {
            res.status(500).json({success:false,message:"error in getting attendance"})
        }
    },

    checkAttendance: async (req,res)=>{
        
        try{
            const today = moment().startOf('day');
            const attendanceForToday=await Attendance.findOne({
                class:req.params.class,
                date:{
                    $gte:today.toDate(),
                    $lt:moment(today).endOf('day').toDate()
                }
            })

            if(attendanceForToday){
               return res.status(200).json({attendanceTaken:true,message:"attendance already taken"})
            }
            else{
                return res.status(200).json({attendanceTaken:false,message:"No Attendance taken yet for today"})
            }
        }
        catch(error){
            res.status(500).json({success:false,message:"error in checking attendance"})
        }
    }   
}