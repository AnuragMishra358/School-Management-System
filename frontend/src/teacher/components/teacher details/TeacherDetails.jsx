import axios from "axios";
import React, { useEffect, useState } from "react";
import { baseApi } from "../../../environment";

export const TeacherDetails = () => {
  const [teacher, setTeacher] = useState("");
  const fetchTeacher = async () => {
    try {
      const resp = await axios.get(`${baseApi}/teacher/fetch-single`);
      console.log(resp);
      setTeacher(resp.data.teacher);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTeacher();
  }, []);

  return (
    <div className="w-full flex justify-center px-4">
      {teacher && (
        <div className="rounded-2xl sm:px-6 w-full">
          {/* Header */}
          <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-2 text-center">
            Teacher Details
          </h2>

          {/* Profile Image */}
          <div className="flex justify-center mb-2">
            <img
              src={teacher.teacher_image}
              alt="Teacher"
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
                  <td className="py-2 dark:text-gray-200">{teacher.name}</td>
                </tr>
                <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                  <td className="py-2 font-semibold text-gray-600 dark:text-gray-300">
                    Email:
                  </td>
                  <td className="py-2 dark:text-gray-200">{teacher.email}</td>
                </tr>
                <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                  <td className="py-2 font-semibold text-gray-600 dark:text-gray-300">
                    Age:
                  </td>
                  <td className="py-2 dark:text-gray-200">{teacher.age}</td>
                </tr>
                <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                  <td className="py-2 font-semibold text-gray-600 dark:text-gray-300">
                    Gender:
                  </td>
                  <td className="py-2 dark:text-gray-200">{teacher.gender}</td>
                </tr>
                <tr className="border-gray-200 dark:border-gray-700">
                  <td className="py-2 font-semibold text-gray-600 dark:text-gray-300">
                    Qualification:
                  </td>
                  <td className="py-2 dark:text-gray-200">
                    {teacher.qualification}
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
