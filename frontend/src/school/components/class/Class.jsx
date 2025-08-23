import axios from "axios";
import React, { useEffect, useState } from "react";
import { baseApi } from "../../../environment";
import toast from "react-hot-toast";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";

export const Class = () => {
  const [class_text, setClassText] = useState("");
  const [class_num, setClassNum] = useState("");
  const [allClasses, setAllClasses] = useState([]);
  const [addClassForm, setAddClassForm] = useState(true);
  const [editId, setEditId] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!class_num || !class_text) {
      return toast.error("please enter valid Class Text and Class Number");
    }
    const fd = new FormData();
    fd.append("class_text", class_text);
    fd.append("class_num", class_num);
    await axios
      .post(`${baseApi}/class/create`, fd)
      .then((resp) => {
        // console.log("new class added", resp);
        toast.success("class added successfully");
        handleCancelEdit();
        getAllClass();
      })
      .catch((e) => {
        toast.error(e.response.data.message);
        handleCancelEdit();
      });
  };

  const getAllClass = async () => {
    await axios
      .get(`${baseApi}/class/all`)
      .then((resp) => {
        // console.log("all classes",resp);
        setAllClasses(resp.data.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleDeleteClass = async (delclass) => {
    await axios
      .delete(`${baseApi}/class/delete/${delclass._id}`)
      .then((resp) => {
        toast.success("class deleted successfully");
        // console.log("deleted class", resp);
        getAllClass();
      })
      .catch((e) => {
        toast.error(e.response.data.message);
      });
  };

  const openEditForm = (item) => {
    setAddClassForm(false);
    setClassNum(item.class_num);
    setClassText(item.class_text);
    setEditId(item._id);
  };

  const handleEditClass = async (e) => {
    e.preventDefault();
    if (!class_num || !class_text) {
      return toast.error("please fill all fields");
    }
    const fd = new FormData();
    fd.append("class_text", class_text);
    fd.append("class_num", class_num);
    await axios
      .patch(`${baseApi}/class/update/${editId}`, fd)
      .then((resp) => {
        toast.success("class updated successfully");
        handleCancelEdit();
        getAllClass();
      })
      .catch((e) => {
        console.log("error in updating class", e);
        toast.error(e.response.data.message);
        handleCancelEdit();
      });
  };

  const handleCancelEdit = () => {
    setAddClassForm(true);
    setClassNum("");
    setClassText("");
  };

  useEffect(() => {
    getAllClass();
  }, []);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 py-8 px-4">
      {addClassForm ? (
        <h2 className="text-gray-700 dark:text-gray-200 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-center">
          Add New Class
        </h2>
      ) : (
        <h2 className="text-gray-700 dark:text-gray-200 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-center">
          Edit Class
        </h2>
      )}

      <div>
        <form className="flex flex-col gap-4 mt-8 mb-10 px-6 py-8 w-full max-w-[82vw] bg-white dark:bg-gray-800 bg-opacity-95 rounded-2xl shadow-md sm:shadow-lg mx-auto">
          {/* Class Text Label and Input */}
          <label className="text-gray-700 dark:text-gray-300 font-medium text-sm sm:text-base">
            Class Text <i className="text-red-500">*</i>
          </label>
          <input
            className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            type="text"
            name="class_text"
            placeholder="Enter Class Text"
            required
            minLength={3}
            value={class_text}
            onChange={(e) => setClassText(e.target.value)}
          />

          {/* Class Number Label and Input */}
          <label className="text-gray-700 dark:text-gray-300 font-medium text-sm sm:text-base">
            Class Number <i className="text-red-500">*</i>
          </label>
          <input
            className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            type="text"
            name="class_num"
            placeholder="Enter Class Number"
            required
            value={class_num}
            onChange={(e) => setClassNum(e.target.value)}
          />

          {/* Submit / Edit Buttons */}
          {addClassForm ? (
            <button
              type="submit"
              onClick={(e) => submitHandler(e)}
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-8 rounded-md transition duration-200"
            >
              Create
            </button>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-between mt-4">
              <button
                type="submit"
                onClick={(e) => handleEditClass(e)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md transition duration-200"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-md transition duration-200"
              >
                Cancel Edit
              </button>
            </div>
          )}
        </form>
      </div>

      {allClasses.length===0 &&
        <div className="text-2xl w-full text-center sm:text-5xl text-gray-200 min-h-[30vh]">
          No class created yet
        </div>
      }
      {/* Render All Classes */}
      <div className="flex flex-wrap max-w-[95vw] justify-center gap-6">
        {allClasses &&
          allClasses.map((item) => (
            <div
              key={item._id}
              className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 shadow-sm hover:shadow-md transition duration-200 rounded-lg p-4 w-60 sm:w-56 text-center"
            >
              <h3 className="text-gray-800 dark:text-gray-100 font-semibold text-base sm:text-lg mb-3">
                Class:{" "}
                <span className="text-blue-600 dark:text-blue-400">
                  {item.class_text}
                </span>{" "}
                [{item.class_num}]
              </h3>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => openEditForm(item)}
                  className="bg-gray-100 dark:bg-gray-700 rounded-full p-2 hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  <MdEdit className="text-green-500 text-xl hover:text-green-600" />
                </button>
                <button
                  onClick={() => handleDeleteClass(item)}
                  className="bg-gray-100 dark:bg-gray-700 rounded-full p-2 hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  <MdDelete className="text-red-500 text-xl hover:text-red-700" />
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
