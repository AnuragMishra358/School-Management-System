import axios from "axios";
import React, { useEffect, useState } from "react";
import { baseApi } from "../../../environment";
import { AttendancePieChart } from "../../../school/components/attendance/AttendancePieChart";

export const AttendanceStudent = () => {
  const [pieData, setPieData] = useState([]);

  const [student, setStudent] = useState("");
  const fetchStudent = async () => {
    try {
      const resp = await axios.get(`${baseApi}/student/fetch-single`);
      setStudent(resp.data.student);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchStudent();
  }, []);

  const [attendanceData, setAttendanceData] = useState([]);
  const [totalClasses, setTotalClasses] = useState(0);
  const fetchStudentAttendance = async () => {
    try {
      const resp = await axios.get(`${baseApi}/attendance/${student._id}`);
      // console.log(resp);
      setAttendanceData(resp.data.attendance);
      setTotalClasses(resp.data.attendance.length);
      const presentCount = resp.data.attendance.filter(
        (attendance) => attendance.status === "Present"
      ).length;
      const absentCount = resp.data.attendance.length - presentCount;
      // Pie chart data
      setPieData([
        { name: "Present", value: presentCount },
        { name: "Absent", value: absentCount },
      ]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (student) {
      fetchStudentAttendance();
    }
  }, [student]);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-500 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-10 px-4">
      <div className="max-w-7xl mx-auto bg-white/10 dark:bg-gray-900/10 backdrop-blur-lg rounded-2xl shadow-2xl sm:p-10">
        {/* Header */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white dark:text-gray-100 text-center mb-10 drop-shadow-lg">
          Attendance Details
        </h2>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Chart Section */}
          <div className="flex-1 flex flex-col items-center bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Attendance Overview
            </h3>
            {totalClasses === 0 ? (
              <h2 className="text-gray-500 dark:text-gray-400 text-sm sm:text-base italic">
                No Attendance Recorded
              </h2>
            ) : (
              <AttendancePieChart data={pieData} />
            )}
          </div>

          {/* Table Section */}
          <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
            <div className="overflow-x-auto rounded-lg">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-gradient-to-r from-indigo-500 to-cyan-500 dark:from-indigo-700 dark:to-cyan-700 text-white">
                    <th className="px-4 sm:px-6 py-3 text-xs sm:text-sm md:text-base font-semibold">
                      Date
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-xs sm:text-sm md:text-base font-semibold">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceData &&
                    attendanceData.map((attendance) => (
                      <tr
                        key={attendance._id}
                        className="odd:bg-gray-50 even:bg-gray-100 dark:odd:bg-gray-700 dark:even:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-indigo-900 transition-colors duration-200"
                      >
                        <td className="px-4 sm:px-6 py-3 text-gray-700 dark:text-gray-200 text-xs sm:text-sm md:text-base whitespace-nowrap">
                          {new Date(attendance.date).toLocaleDateString(
                            "en-US",
                            {
                              weekday: "short",
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </td>
                        <td
                          className={`px-4 sm:px-6 py-3 text-xs sm:text-sm md:text-base font-medium ${
                            attendance.status === "Present"
                              ? "text-green-600 dark:text-green-400"
                              : attendance.status === "Absent"
                              ? "text-red-600 dark:text-red-400"
                              : "text-yellow-600 dark:text-yellow-400"
                          }`}
                        >
                          {attendance.status}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
