import axios from "axios";
import React, { useEffect, useState } from "react";
import { baseApi } from "../../../environment";
import { Attendee } from "./Attendee";
import { NavLink } from "react-router-dom";

export const AttendanceStudentList = () => {
  const [classes, setClasses] = useState([]);

  const fetchClasses = async (req, res) => {
    await axios
      .get(`${baseApi}/class/all`)
      .then((resp) => {
        setClasses(resp.data.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const [params, setParams] = useState({});
  const [selectedClass, setSelectedClass] = useState(null);

  const handleClass = (e) => {
    const [id, classText] = e.target.value.split("|");
    setSelectedClass(id);
    setParams((prevParams) => ({
      ...prevParams,
      student_class: classText || undefined,
    }));
  };

  const handleSearch = (e) => {
    setParams((prevParams) => ({
      ...prevParams,
      search: e.target.value || undefined,
    }));
  };

  const [students, setStudents] = useState([]);
  const fetchStudents = () => {
    axios
      .get(`${baseApi}/student/fetch-with-query`, { params: params })
      .then((resp) => {
        setStudents(resp.data.students);
      })
      .catch((e) => {
        console.log("error in fetching class.");
      });
  };

  useEffect(() => {
    fetchStudents();
  }, [params]);

  useEffect(() => {
    fetchClasses();
  }, []);

  const [attendanceData, setAttendanceData] = useState({});
  const fetchAttendanceForStudents = async (students) => {
    const attendancePromises = students.map((student) =>
      fetchAttendanceForStudent(student._id)
    );
    const results = await Promise.all(attendancePromises);
    const updatedAttendanceData = {};
    results.forEach(({ studentId, attendancePercentage }) => {
      updatedAttendanceData[studentId] = attendancePercentage;
    });
    setAttendanceData(updatedAttendanceData);
  };

  const fetchAttendanceForStudent = async (studentId) => {
    try {
      const resp = await axios.get(`${baseApi}/attendance/${studentId}`);
      const attendanceRecords = resp.data.attendance;
      // console.log("attendanceRecords",attendanceRecords);
      const totalClasses = attendanceRecords.length;
      const presentCount = attendanceRecords.filter(
        (attendance) => attendance.status === "Present"
      ).length;

      const attendancePercentage =
        totalClasses > 0 ? (presentCount / totalClasses) * 100 : 0;
      return { studentId, attendancePercentage };
    } catch (error) {
      console.error(
        `Error in fetching attendance for student ${studentId}`,
        error
      );
      return { studentId, attendancePercentage: 0 };
    }
  };

  useEffect(() => {
    if (students.length > 0) {
      fetchAttendanceForStudents(students);
    }
  }, [students]);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-500 via-sky-500 to-teal-400 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-10 px-4 sm:px-6 lg:px-12">
      {/* Heading */}
      <h2 className="text-4xl font-bold text-center text-white dark:text-gray-100 drop-shadow-lg tracking-wide">
        Students Attendance
      </h2>

      <div className="flex flex-col lg:flex-row gap-8 mt-10 max-w-7xl mx-auto">
        {/* Left Section (Search + Select + Attendee) */}
        <div className="flex flex-col items-center lg:items-start gap-6 bg-white/90 dark:bg-gray-800 p-6 rounded-2xl shadow-2xl w-full lg:w-1/3">
          {/* Search Input */}
          <input
            type="text"
            onChange={(e) => handleSearch(e)}
            placeholder="🔍 Search by Name"
            className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-xl bg-gray-50 dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-400 shadow-sm transition"
          />

          {/* Class Select */}
          <select
            onChange={(e) => handleClass(e)}
            className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-xl bg-gray-50 dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-400 shadow-sm transition"
          >
            <option value="">📘 Search by Class</option>
            {classes.map((classItem) => (
              <option
                key={classItem._id}
                value={`${classItem._id}|${classItem.class_text} [${classItem.class_num}]`}
                className="dark:bg-gray-700 dark:text-gray-100"
              >
                {classItem.class_text} [{classItem.class_num}]
              </option>
            ))}
          </select>

          {/* Attendee Chart */}
          {selectedClass && (
            <div className="w-full flex justify-center">
              <Attendee classId={selectedClass} />
            </div>
          )}
        </div>

        {/* Right Section (Table) */}
        <div className="overflow-x-auto bg-white/95 dark:bg-gray-800 shadow-2xl rounded-2xl w-full lg:w-2/3">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 rounded-xl overflow-hidden">
            <thead className="bg-gradient-to-r from-sky-600 to-teal-500 dark:from-gray-700 dark:to-gray-600">
              <tr>
                {[
                  "Name",
                  "Gender",
                  "Guardian Phone",
                  "Class",
                  "Percentage",
                  "View",
                ].map((head) => (
                  <th
                    key={head}
                    className="px-6 py-4 text-left text-sm font-semibold text-white dark:text-gray-100 uppercase tracking-wide"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-700">
              {students &&
                students.map((student) => (
                  <tr
                    key={student._id}
                    className="hover:bg-sky-50/70 dark:hover:bg-gray-700 transition duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      {student.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {student.gender}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {student.guardian_phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {student.student_class}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                      {attendanceData[student._id] !== undefined ? (
                        <span
                          className={`${
                            attendanceData[student._id] >= 75
                              ? "text-green-600"
                              : "text-red-500"
                          }`}
                        >
                          {attendanceData[student._id].toFixed(2)}%
                        </span>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500">
                          No Data
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <NavLink
                        to={`/school/attendance/${student._id}`}
                        className="px-4 py-2 bg-gradient-to-r from-sky-500 to-teal-400 text-white rounded-xl shadow hover:scale-105 transform transition font-medium"
                      >
                        Details
                      </NavLink>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
