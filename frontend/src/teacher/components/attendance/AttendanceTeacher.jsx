import axios from "axios";
import React, { useEffect, useState } from "react";
import { baseApi } from "../../../environment";
import toast from "react-hot-toast";

export const AttendanceTeacher = () => {
  const [attendanceStatus, setAttendanceStatus] = useState({});
  const [selectedClass, setSelectedClass] = useState("");
  const [classes, setClasses] = useState("");
  const fetchClass = async () => {
    try {
      const resp = await axios.get(`${baseApi}/class/attendee`);
      // console.log("resp",resp);
      setClasses(resp.data.data);
      if (resp.data.data.length > 0) {
        setSelectedClass(
          `${resp.data.data[0].class_text} [${resp.data.data[0].class_num}]`
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (studentId, status) => {
    setAttendanceStatus((prevStatus) => ({
      ...prevStatus,
      [studentId]: status,
    }));
  };

  useEffect(() => {
    fetchClass();
  }, []);

  const singleStudentAttendance = async (studentId, status) => {
    try {
      await axios.post(`${baseApi}/attendance/mark`, {
        studentId,
        status,
        date: new Date(),
        studentClass: selectedClass,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const [attendanceChecked, setAttendanceChecked] = useState(false);
  const [students, setStudents] = useState([]);
  const checkAttendanceAndFetchStudents = async () => {
    try {
      if (selectedClass) {
        const responseStudent = await axios.get(
          `${baseApi}/student/fetch-with-query`,
          { params: { student_class: selectedClass } }
        );
        const responseCheck = await axios.get(
          `${baseApi}/attendance/check/${selectedClass}`
        );
        // console.log("attendance",responseCheck);
        if (!responseCheck.data.attendanceTaken) {
          setStudents(responseStudent.data.students);
          responseStudent.data.students.forEach((student) => {
            handleChange(student._id, "Present");
          });
          setAttendanceChecked(false);
        } else {
          setAttendanceChecked(true);
          setStudents([]);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkAttendanceAndFetchStudents();
  }, [selectedClass]);

  const handleSubmit = async () => {
    try {
      await Promise.all(
        students.map((student) =>
          singleStudentAttendance(student._id, attendanceStatus[student._id])
        )
      );
      toast.success("Attendance marked successfully");
      checkAttendanceAndFetchStudents();
    } catch (error) {
      toast.error("Error in marking attendance");
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-indigo-600 via-blue-700 to-cyan-500 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 p-4 sm:p-6">
      {/* Heading */}
      <h1 className="text-3xl font-bold text-white drop-shadow mb-6 text-center">
        Attendance
      </h1>

      {classes.length !== 0 ? (
        <div className="w-full max-w-2xl space-y-6">
          {/* Info */}
          <p className="text-white text-center font-medium text-lg">
            ✅ You are attendee of{" "}
            <span className="font-bold text-yellow-300">{classes.length}</span>{" "}
            classes
          </p>

          {/* Select Class */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-3">
            <label className="text-white font-semibold dark:text-gray-300">
              Select Class:
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="rounded-lg border border-gray-300 dark:border-gray-600 p-2 w-full sm:w-64 bg-white dark:bg-gray-800 
                     focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-700 dark:text-gray-200"
            >
              {classes.map((x) => (
                <option key={x._id} value={`${x.class_text} [${x.class_num}]`}>
                  {x.class_text}
                </option>
              ))}
            </select>
          </div>
        </div>
      ) : (
        <div className="text-center text-red-200 dark:text-red-400 font-semibold text-lg mt-4">
          ❌ You are not attendee of any class
        </div>
      )}

      {/* Student Table */}
      {students.length > 0 ? (
        <div className="overflow-x-auto w-full max-w-3xl mt-8">
          <table className="w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
            <thead className="bg-gradient-to-r from-indigo-500 to-cyan-500 dark:from-gray-900 dark:to-gray-900 text-white">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr
                  key={student._id}
                  className={`border-t ${
                    index % 2 === 0
                      ? "bg-gray-50 dark:bg-gray-700"
                      : "bg-white dark:bg-gray-800"
                  }`}
                >
                  <td className="p-3 text-gray-900 dark:text-gray-200">
                    {student.name}
                  </td>
                  <td className="p-3">
                    <select
                      value={attendanceStatus[student._id]}
                      onChange={(e) =>
                        handleChange(student._id, e.target.value)
                      }
                      className="rounded-md border border-gray-300 dark:border-gray-600 px-3 py-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 
                             focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Absent">Absent</option>
                      <option value="Present">Present</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-6 text-center text-white dark:text-gray-200 font-medium">
          {attendanceChecked ? (
            <p>✅ Attendance is already taken for this class</p>
          ) : (
            <p>ℹ️ No student in this class</p>
          )}
        </div>
      )}

      {/* Submit Button */}
      {!attendanceChecked && students.length > 0 && (
        <button
          onClick={handleSubmit}
          className="mt-6 px-6 py-2 rounded-full bg-yellow-400 dark:bg-slate-900 text-black font-semibold hover:bg-yellow-300 dark:hover:bg-slate-950 dark:text-white transition"
        >
          Submit Attendance
        </button>
      )}
    </div>
  );
};
