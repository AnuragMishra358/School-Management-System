import axios from "axios";
import React, { useEffect, useState } from "react";
import { baseApi } from "../../../environment";

export const ExaminationsStudent = () => {
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

  // Fetch classes
  const [studentClass, setStudentClass] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const stuClass = student.student_class.split(" ")[0];
        const { data } = await axios.get(`${baseApi}/class/all`);
        const classData = data.data.filter((x) => x.class_text === stuClass)[0];
        setSelectedClass(classData._id);
        setStudentClass(classData.class_text);
      } catch (error) {
        console.error(error);
      }
    };
    if (student) {
      fetchClasses();
    }
  }, [student]);

  const [examinations, setExaminations] = useState([]);
  const fetchExaminations = async () => {
    try {
      const resp = await axios.get(
        `${baseApi}/examination/class/${selectedClass}`
      );
      setExaminations(resp.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (selectedClass) {
      fetchExaminations();
    }
  }, [selectedClass]);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-100 via-sky-200 to-cyan-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-800 p-6">
      <div className="text-2xl font-bold text-center text-indigo-700 dark:text-indigo-400 mb-6">
        Examinations of your class [{studentClass}]
      </div>

      {/* Examination Table */}
      <div className="max-w-5xl mx-auto mt-10 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
        <h2 className="text-xl font-semibold text-indigo-700 dark:text-indigo-400 mb-4">
          Examination List
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
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
                    className="border-b hover:bg-indigo-50 dark:hover:bg-indigo-900 transition"
                  >
                    <td className="p-3 text-gray-800 dark:text-gray-200">
                      {new Date(exam.examDate).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </td>
                    <td className="p-3 text-gray-800 dark:text-gray-200">
                      {exam.subject.subject_name}
                    </td>
                    <td className="p-3 text-gray-800 dark:text-gray-200">
                      {exam.class.class_text}
                    </td>
                    <td className="p-3 text-gray-800 dark:text-gray-200">
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
