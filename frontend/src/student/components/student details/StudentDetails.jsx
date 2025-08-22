import axios from "axios";
import React, { useEffect, useState } from "react";
import { baseApi } from "../../../environment";

export const StudentDetails = () => {
  const [student, setStudent] = useState("");
  const fetchStudent = async () => {
    try {
      const resp = await axios.get(`${baseApi}/student/fetch-single`);
      console.log(resp);
      setStudent(resp.data.student);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchStudent();
  }, []);

  return (
    <div className="w-full flex justify-center px-4">
      {student && (
        <div className="rounded-2xl sm:px-6 w-full bg-white dark:bg-gray-900 p-4">
          {/* Header */}
          <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-2 text-center">
            Student Details
          </h2>

          {/* Profile Image */}
          <div className="flex justify-center mb-2">
            <img
              src={student.student_image}
              alt="Student"
              className="w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] object-cover rounded-full border-4 border-indigo-200 dark:border-indigo-700 shadow-md"
            />
          </div>

          {/* Info Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <tbody>
                <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                  <td className="py-2 font-semibold text-gray-600 dark:text-gray-300">
                    Name:
                  </td>
                  <td className="py-2 text-gray-800 dark:text-gray-100">
                    {student.name}
                  </td>
                </tr>
                <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                  <td className="py-2 font-semibold text-gray-600 dark:text-gray-300">
                    Email:
                  </td>
                  <td className="py-2 text-gray-800 dark:text-gray-100">
                    {student.email}
                  </td>
                </tr>
                <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                  <td className="py-2 font-semibold text-gray-600 dark:text-gray-300">
                    Age:
                  </td>
                  <td className="py-2 text-gray-800 dark:text-gray-100">
                    {student.age}
                  </td>
                </tr>
                <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                  <td className="py-2 font-semibold text-gray-600 dark:text-gray-300">
                    Gender:
                  </td>
                  <td className="py-2 text-gray-800 dark:text-gray-100">
                    {student.gender}
                  </td>
                </tr>
                <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                  <td className="py-2 font-semibold text-gray-600 dark:text-gray-300">
                    Class:
                  </td>
                  <td className="py-2 text-gray-800 dark:text-gray-100">
                    {student.student_class}
                  </td>
                </tr>
                <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                  <td className="py-2 font-semibold text-gray-600 dark:text-gray-300">
                    Guardian:
                  </td>
                  <td className="py-2 text-gray-800 dark:text-gray-100">
                    {student.guardian}
                  </td>
                </tr>
                <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                  <td className="py-2 font-semibold text-gray-600 dark:text-gray-300">
                    Guardian Phone:
                  </td>
                  <td className="py-2 text-gray-800 dark:text-gray-100">
                    {student.guardian_phone}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
