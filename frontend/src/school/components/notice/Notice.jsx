import axios from "axios";
import React, { useEffect, useState } from "react";
import { baseApi } from "../../../environment";
import toast from "react-hot-toast";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";

export const Notice = () => {
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    audience: "",
  });

  const [selectedAudience, setSelectedAudience] = useState("All");

  const Audience = [
    {
      id: 1,
      role: "Teacher",
    },
    {
      id: 2,
      role: "Student",
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const clearForm = () => {
    setFormData({
      title: "",
      message: "",
      audience: "",
    });
    setEditId("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      var operation = axios.post;
      var backendUrl = `${baseApi}/notice/create`;
      if (editId) {
        operation = axios.patch;
        backendUrl = `${baseApi}/notice/update/${editId}`;
      }
      await operation(backendUrl, {
        title: formData.title,
        audience: formData.audience,
        message: formData.message,
      });
      toast.success(
        editId ? "notice updated successfully" : "notice created successfully"
      );
      clearForm();
      fetchAllNotices();
    } catch (error) {
      console.log("error in creating notice", error);
      toast.error(error?.response?.data?.message || "something went wrong");
    }
  };

  const [notices, setNotices] = useState([]);
  const fetchAllNotices = async () => {
    try {
      const resp = await axios.get(`${baseApi}/notice/all`);
      // console.log(resp);
      const allNotices = resp.data.data;
      const filteredNotices =
        selectedAudience === "All"
          ? allNotices
          : allNotices.filter((x) => x.audience === selectedAudience);

      setNotices(filteredNotices);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllNotices();
  }, [selectedAudience]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseApi}/notice/delete/${id}`);
      toast.success("notice deleted successfully");
      fetchAllNotices();
    } catch (error) {
      console.log(error);
      toast.error("error in deleting notice");
    }
  };

  const [editId, setEditId] = useState("");
  const handleEdit = async (id) => {
    try {
      setEditId(id);
      const resp = await axios.get(`${baseApi}/notice/single/${id}`);
      // console.log("edit",resp);
      setFormData({
        title: resp.data.data.title,
        message: resp.data.data.message,
        audience: resp.data.data.audience,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700 dark:from-gray-900 dark:via-gray-800 dark:to-black p-6">
      {/* Heading */}
      <h1 className="text-3xl font-extrabold text-white drop-shadow-md mb-6">
        Notice Board
      </h1>

      {/* Form Card */}
      <div className="w-full max-w-2xl bg-white dark:bg-gray-900 shadow-2xl rounded-2xl p-8">
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
            {editId ? "Edit Notice" : "Create New Notice"}
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title Input */}
          <input
            type="text"
            name="title"
            placeholder="Title*"
            required
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none dark:bg-gray-800 dark:text-gray-200"
          />

          {/* Message Input */}
          <textarea
            name="message"
            placeholder="Message*"
            required
            value={formData.message}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none dark:bg-gray-800 dark:text-gray-200"
          />

          {/* Audience Select */}
          <select
            name="audience"
            required
            value={formData.audience}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            <option value="">Select Audience</option>
            {Audience.map((x) => (
              <option key={x.id} value={x.role}>
                {x.role}
              </option>
            ))}
          </select>

          {/* Submit Button */}
          <div className="flex flex-col gap-2 sm:flex-row justify-between">
            <button
              type="submit"
              className="px-4 bg-blue-600 text-white py-3 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300"
            >
              {editId ? "Edit Notice" : "Add Notice"}
            </button>
            <button
              type="button"
              onClick={clearForm}
              className="px-4 bg-gray-600 text-white py-3 rounded-lg shadow-md hover:bg-gray-700 transition-all duration-300"
            >
              {editId ? "Cancel Edit" : "Cancel"}
            </button>
          </div>
        </form>
      </div>

      {/* Audience Filter */}
      {notices.length>0 &&
      <div>
      <h2 className="text-2xl font-bold text-white mt-10">
        Notices For {selectedAudience}
      </h2>
      <div className="flex flex-wrap gap-3 my-6 justify-center">
        <button
          onClick={() => setSelectedAudience("Student")}
          className={`px-5 py-2 rounded-lg font-medium transition-all ${
            selectedAudience === "Student"
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-white dark:bg-gray-800 dark:text-gray-200 text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          Student Notices
        </button>
        <button
          onClick={() => setSelectedAudience("Teacher")}
          className={`px-5 py-2 rounded-lg font-medium transition-all ${
            selectedAudience === "Teacher"
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-white dark:bg-gray-800 dark:text-gray-200 text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          Teacher Notices
        </button>
        <button
          onClick={() => setSelectedAudience("All")}
          className={`px-5 py-2 rounded-lg font-medium transition-all ${
            selectedAudience === "All"
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-white dark:bg-gray-800 dark:text-gray-200 text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          All Notices
        </button>
      </div>
      </div>
      }
      
      {notices.length===0 &&
         <div className="text-xl mt-[20px] w-full text-center sm:text-3xl text-gray-200 min-h-[30vh]">
          No notice created yet
        </div>
      }
      {/* Notices List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full ">
        {notices &&
          notices.map((x) => (
            <div
              key={x._id}
              className="bg-gradient-to-br from-sky-50 via-white to-blue-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 rounded-2xl shadow-md p-6 border border-blue-100 dark:border-gray-700 hover:shadow-xl hover:scale-[1.01] transition-all duration-300"
            >
              {/* Title */}
              <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-400 mb-2 truncate">
                Title: {x.title}
              </h2>

              {/* Message */}
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Message: {x.message}
              </p>

              {/* Footer */}
              <div className="flex flex-col text-sm text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-3">
                <span className="flex font-medium items-center gap-1">
                  👥 Audience:{" "}
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {x.audience}
                  </span>
                </span>
                <span className="flex font-medium items-center gap-1">
                  📅 Posted On:{" "}
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {new Date(x.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => handleEdit(x._id)}
                  className="flex items-center justify-center px-3 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-all"
                >
                  <MdEdit size={18} />
                </button>
                <button
                  onClick={() => handleDelete(x._id)}
                  className="flex items-center justify-center px-3 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition-all"
                >
                  <MdDelete size={18} />
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
