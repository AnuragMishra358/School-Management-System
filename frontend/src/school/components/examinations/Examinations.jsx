import axios from "axios";
import React, { useEffect, useState } from "react";
import { baseApi } from "../../../environment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";

export const Examinations = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [examinations, setExaminations] = useState([]);
  const [examForm, setExamForm] = useState(false);
  const [formData, setFormData] = useState({
    subject: "",
    examType: "",
    date: new Date(),
  });

  const [subjects, setSubjects] = useState([]);

  const fetchSubjects = async () => {
    try {
      const subjectData = await axios.get(`${baseApi}/subject/all`);
      setSubjects(subjectData.data.data);
    } catch (error) {
      console.log(error);
    }
  };

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
    fetchSubjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!selectedClass) {
        toast.error("please select any class");
        return;
      }
      // console.log("date", formData.date);
      const formattedDate = formData.date.toISOString().split("T")[0];
      let backendUrl = `${baseApi}/examination/create`;
      let operation = axios.post;
      if (edit) {
        backendUrl = `${baseApi}/examination/update/${editId}`;
        operation = axios.patch;
      }
      await operation(backendUrl, {
        date: formattedDate,
        examType: formData.examType,
        subjectId: formData.subject,
        classId: selectedClass,
      });
      // console.log("exam", resp);
      toast.success(
        edit ? "exam updated successfully" : "exam created successfully"
      );
      handleCancel();
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "something went wrong");
    }
    fetchExaminations();
  };

  const handleCancel = () => {
    setFormData({
      subject: "",
      examType: "",
      date: new Date(),
    });
    setExamForm(false);
    setEdit(false);
    setEditId("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

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

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseApi}/examination/delete/${id}`);
      fetchExaminations();
      toast.success("exam deleted successfully");
    } catch (error) {
      console.log(error);
      toast.error("error in deleting exam");
    }
  };
  const [edit, setEdit] = useState(false);
  const [editId, setEditId] = useState("");
  const handleEdit = async (id) => {
    try {
      setEditId(id);
      const resp = await axios.get(`${baseApi}/examination/${id}`);
      // console.log("edit",resp);
      setFormData({
        subject: resp.data.data.subject._id,
        examType: resp.data.data.examType,
        date: new Date(resp.data.data.examDate),
      });
      setSelectedClass(resp.data.data.class._id);
      setExamForm(true);
      setEdit(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-100 via-sky-200 to-cyan-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="text-2xl font-bold text-center text-indigo-700 dark:text-indigo-300 mb-6">
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
          className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-xl bg-white dark:bg-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-400 shadow-sm transition"
        >
          <option value="">📘 Select Class</option>
          {classes.map((classItem) => (
            <option key={classItem._id} value={classItem._id}>
              {classItem.class_text} [{classItem.class_num}]
            </option>
          ))}
        </select>
      </div>

      {/* Exam Form */}
      {examForm && (
        <form
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg space-y-6"
        >
          <div>
            <input
              name="examType"
              placeholder="Enter exam type"
              required
              value={formData.examType}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">-- Select a subject --</option>
              {subjects.map((Item) => (
                <option key={Item._id} value={Item._id}>
                  {Item.subject_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <DatePicker
              selected={formData.date}
              onChange={(date) => {
                setFormData({ ...formData, date });
              }}
              required
              dateFormat="dd/MM/yyyy"
              placeholderText="Click to select a date"
              className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <button
              type="submit"
              className="flex-1 sm:flex-none px-6 py-3 bg-gradient-to-r from-indigo-600 to-sky-500 text-white rounded-lg shadow hover:from-indigo-700 hover:to-sky-600 transition-all"
            >
              {edit ? "Edit Exam" : "Create Exam"}
            </button>

            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 sm:flex-none px-6 py-3 bg-gray-500 text-white rounded-lg shadow hover:bg-gray-700 transition-colors"
            >
              {edit ? "Cancel Edit" : "Cancel"}
            </button>
          </div>
        </form>
      )}

      {/* Examination Table */}
      <div className="max-w-5xl mx-auto mt-10 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
        <h2 className="text-xl font-semibold text-indigo-700 dark:text-indigo-300 mb-4">
          Examination List
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <thead className="bg-gradient-to-r from-indigo-500 to-sky-400 text-white">
              <tr>
                <th className="p-3 text-left">Exam Date</th>
                <th className="p-3 text-left">Subject</th>
                <th className="p-3 text-left">Class</th>
                <th className="p-3 text-left">Exam Type</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {examinations &&
                examinations.map((exam) => (
                  <tr
                    key={exam._id}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-indigo-50 dark:hover:bg-gray-700 transition"
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
                    <td className="p-3 flex gap-2 justify-center">
                      <button
                        onClick={() => handleEdit(exam._id)}
                        className="px-4 py-1 bg-yellow-400 text-white rounded-md shadow hover:bg-yellow-500 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(exam._id)}
                        className="px-4 py-1 bg-red-500 text-white rounded-md shadow hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setExamForm(true)}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-400 text-white rounded-lg shadow hover:from-green-600 hover:to-emerald-500 transition"
          >
            ➕ Add Exam
          </button>
        </div>
      </div>
    </div>
  );
};
