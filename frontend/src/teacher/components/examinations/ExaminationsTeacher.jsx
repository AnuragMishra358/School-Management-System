import axios from "axios";
import React, { useEffect, useState } from "react";
import { baseApi } from "../../../environment";

export const ExaminationsTeacher = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [examinations, setExaminations] = useState([]);

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

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchExaminations = async () => {
    try {
      var backendUrl = `${baseApi}/examination/all`;
      if (selectedClass) {
        backendUrl = `${baseApi}/examination/class/${selectedClass}`;
      }

      const resp = await axios.get(backendUrl);
      // console.log("examination", resp);
      setExaminations(resp.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchExaminations();
  }, [selectedClass]);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-100 via-sky-200 to-cyan-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 p-6">
      <div className="text-2xl font-bold text-center text-indigo-700 dark:text-gray-200 mb-6">
        Examinations
      </div>

      {/* Select Class */}
      <div className="max-w-2xl mx-auto mb-8">
        <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
          Change Class
        </label>
        <select
          value={selectedClass}
          onChange={(e) => {
            setSelectedClass(e.target.value);
          }}
          className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 
                 focus:outline-none focus:ring-2 focus:ring-sky-400 dark:focus:ring-sky-500 shadow-sm transition"
        >
          <option value="">📘 Select Class</option>
          {classes.map((classItem) => (
            <option key={classItem._id} value={classItem._id}>
              {classItem.class_text} [{classItem.class_num}]
            </option>
          ))}
        </select>
      </div>

      {/* Examination Table */}
      <div className="max-w-5xl mx-auto mt-10 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
        <h2 className="text-xl font-semibold text-indigo-700 dark:text-gray-200 mb-4">
          Examination List
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
            <thead className="bg-gradient-to-r from-indigo-500 to-sky-400 dark:from-indigo-700 dark:to-sky-700 text-white">
              <tr>
                <th className="p-3 text-left">Exam Date</th>
                <th className="p-3 text-left">Subject</th>
                <th className="p-3 text-left">Class</th>
                <th className="p-3 text-left">Exam Type</th>
              </tr>
            </thead>
            <tbody>
              {examinations &&
                examinations.map((exam) => (
                  <tr
                    key={exam._id}
                    className="border-b hover:bg-indigo-50 dark:hover:bg-gray-700 transition"
                  >
                    <td className="p-3 text-gray-900 dark:text-gray-200">
                      {new Date(exam.examDate).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </td>
                    <td className="p-3 text-gray-900 dark:text-gray-200">
                      {exam.subject.subject_name}
                    </td>
                    <td className="p-3 text-gray-900 dark:text-gray-200">
                      {exam.class.class_text}
                    </td>
                    <td className="p-3 text-gray-900 dark:text-gray-200">
                      {exam.examType}
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
