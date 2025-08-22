import axios from "axios";
import React, { useEffect, useState } from "react";
import { baseApi } from "../../../environment";
import toast from "react-hot-toast";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";

export const Subjects = () => {
  const [subject_name, setSubjectName] = useState("");
  const [subject_codename, setSubjectCodeName] = useState("");
  const [allSubjects, setallSubjects] = useState([]);
  const [addSubjectForm, setaddSubjectForm] = useState(true);
  const [editId, setEditId] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    if (
      !subject_codename ||
      subject_codename.length < 3 ||
      !subject_name ||
      subject_name.length < 4
    ) {
      return toast.error(
        "Please enter valid subject name (min 4) and codename (min 3)"
      );
    }

    const fd = new FormData();
    fd.append("subject_name", subject_name);
    fd.append("subject_codename", subject_codename);
    await axios
      .post(`${baseApi}/subject/create`, fd)
      .then((resp) => {
        // console.log("new subject added", resp);
        toast.success("subject added successfully");
        handleCancelEdit();
        getAllsubject();
      })
      .catch((e) => {
        toast.error(e.response.data.message);
        handleCancelEdit();
      });
  };

  const getAllsubject = async () => {
    await axios
      .get(`${baseApi}/subject/all`)
      .then((resp) => {
        // console.log("all subjectes",resp);
        setallSubjects(resp.data.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleDeletesubject = async (delsubject) => {
    await axios
      .delete(`${baseApi}/subject/delete/${delsubject._id}`)
      .then((resp) => {
        toast.success("subject deleted successfully");
        // console.log("deleted subject", resp);
        getAllsubject();
      })
      .catch((e) => {
        toast.error(e.response.data.message);
      });
  };

  const openEditForm = (item) => {
    setaddSubjectForm(false);
    setSubjectCodeName(item.subject_codename);
    setSubjectName(item.subject_name);
    setEditId(item._id);
  };

  const handleEditsubject = async (e) => {
    e.preventDefault();
    if (
      !subject_codename ||
      subject_codename.length < 3 ||
      !subject_name ||
      subject_name.length < 4
    ) {
      return toast.error(
        "Please enter valid subject name (min 4) and codename (min 3)"
      );
    }

    const fd = new FormData();
    fd.append("subject_name", subject_name);
    fd.append("subject_codename", subject_codename);
    await axios
      .patch(`${baseApi}/subject/update/${editId}`, fd)
      .then((resp) => {
        console.log("updated subject", resp);
        toast.success("subject updated successfully");
        handleCancelEdit();
        getAllsubject();
      })
      .catch((e) => {
        console.log("error in updating subject", e);
        toast.error(e.response.data.message);
        handleCancelEdit();
      });
  };

  const handleCancelEdit = () => {
    setaddSubjectForm(true);
    setSubjectCodeName("");
    setSubjectName("");
  };

  useEffect(() => {
    getAllsubject();
  }, []);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 py-10 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 min-h-screen">
      {addSubjectForm ? (
        <h2 className="text-gray-700 dark:text-gray-200 text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6">
          Add New subject
        </h2>
      ) : (
        <h2 className="text-gray-700 dark:text-gray-200 text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6">
          Edit subject
        </h2>
      )}

      <div>
        <form className="flex flex-col gap-5 mt-8 mb-12 px-6 py-8 w-full max-w-3xl bg-white dark:bg-gray-800 bg-opacity-95 rounded-2xl shadow-lg mx-auto">
          {/* subject Text Label and Input */}
          <label className="text-gray-700 dark:text-gray-300 font-medium text-base">
            Subject Text <i className="text-red-500">*</i>
          </label>
          <input
            className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            type="text"
            name="subject_name"
            placeholder="Enter Subject Text"
            required
            minLength={4}
            value={subject_name}
            onChange={(e) => setSubjectName(e.target.value)}
          />

          {/* subject Number Label and Input */}
          <label className="text-gray-700 dark:text-gray-300 font-medium text-base">
            Subject Codename <i className="text-red-500">*</i>
          </label>
          <input
            className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            type="text"
            name="subject_codename"
            placeholder="Enter Subject Codename"
            required
            minLength={3}
            value={subject_codename}
            onChange={(e) => setSubjectCodeName(e.target.value)}
          />

          {/* Submit / Edit Buttons */}
          {addSubjectForm ? (
            <button
              type="submit"
              onClick={(e) => submitHandler(e)}
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-md transition duration-200"
            >
              Create
            </button>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-between mt-6">
              <button
                type="submit"
                onClick={(e) => handleEditsubject(e)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md transition duration-200"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-md transition duration-200"
              >
                Cancel Edit
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Render All subjectes */}
      <div className="px-2 sm:px-6 lg:px-8">
        <div className="overflow-x-auto">
          <div className="min-w-full overflow-x-auto bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Subject Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Codename
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Edit
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Delete
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {allSubjects &&
                  allSubjects.map((item) => (
                    <tr
                      key={item._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="px-6 py-4 text-gray-800 dark:text-gray-100">
                        {item.subject_name}
                      </td>
                      <td className="px-6 py-4 text-gray-800 dark:text-gray-100">
                        {item.subject_codename}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => openEditForm(item)}
                          className="bg-gray-100 dark:bg-gray-700 rounded-full p-2 hover:bg-gray-200 dark:hover:bg-gray-600"
                        >
                          <MdEdit className="text-green-500 text-xl hover:text-green-600" />
                        </button>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleDeletesubject(item)}
                          className="bg-gray-100 dark:bg-gray-700 rounded-full p-2 hover:bg-gray-200 dark:hover:bg-gray-600"
                        >
                          <MdDelete className="text-red-500 text-xl hover:text-red-700" />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
