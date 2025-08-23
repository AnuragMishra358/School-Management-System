import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { baseApi } from "../../../environment";
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";

export const Students = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    student_class: "",
    age: "",
    gender: "",
    guardian: "",
    guardian_phone: "",
    password: "",
    confirmPassword: "",
    image: null,
  });

  const [classes, setClasses] = useState([]);

  const [imageUrl, setImageUrl] = useState("");
  const fileInputRef = useRef();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
      setImageUrl(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleCancel = () => {
    setEdit(false);
    setEditId("");
    clearForm();
  };

  const clearForm = () => {
    setFormData({
      image: null,
      name: "",
      email: "",
      student_class: "",
      age: "",
      gender: "",
      guardian: "",
      guardian_phone: "",
      password: "",
      confirmPassword: "",
    });
    setImageUrl("");
    fileInputRef.current.value = null;
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

  const [params, setParams] = useState({});

  const handleClass = (e) => {
    setParams((prevParams) => ({
      ...prevParams,
      student_class: e.target.value || undefined,
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
        console.log("error in fetching students.", e);
      });
  };

  useEffect(() => {
    fetchStudents();
  }, [params]);

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword)
      return toast.error("Passwords do not match");

    // ✅ Create FormData
    const fd = new FormData();
    if (formData.image) {
      fd.append("image", formData.image, formData.image.name);
    }
    fd.append("name", formData.name);
    fd.append("email", formData.email);
    fd.append("student_class", formData.student_class);
    if (formData.password) {
      fd.append("password", formData.password);
    }
    fd.append("age", formData.age);
    fd.append("gender", formData.gender);
    fd.append("guardian", formData.guardian);
    fd.append("guardian_phone", formData.guardian_phone);
    if (edit) {
      try {
        await axios.patch(`${baseApi}/student/update/${editId}`, fd, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        // console.log("response",response);
        toast.success("student updated successfully!");

        handleCancel();

        fetchStudents();
      } catch (error) {
        // console.error(error);
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Something went wrong while editing student.");
        }
      }
    } else {
      try {
        await axios.post(`${baseApi}/student/register`, fd, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        // console.log("response",response);
        toast.success("student registered successfully!");

        clearForm();

        fetchStudents();
      } catch (error) {
        // console.error(error);
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Something went wrong while registering student.");
        }
      }
    }
  };

  const [edit, setEdit] = useState(false);
  const [editId, setEditId] = useState("");
  const handleEdit = async (id) => {
    setEdit(true);
    setEditId(id);
    const filteredStudent = students.find((item) => item._id === id);
    setFormData({
      name: filteredStudent.name,
      email: filteredStudent.email,
      student_class: filteredStudent.student_class,
      age: filteredStudent.age,
      gender: filteredStudent.gender,
      guardian: filteredStudent.guardian,
      guardian_phone: filteredStudent.guardian_phone,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete")) {
      await axios
        .delete(`${baseApi}/student/delete/${id}`)
        .then((resp) => {
          // console.log("remaining students", resp);
          toast.success("student deleted successfully");
          fetchStudents();
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-500 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      {edit ? (
        <h2 className="text-3xl sm:text-4xl text-center text-white font-extrabold mb-8 tracking-wide drop-shadow-md">
          Edit Student
        </h2>
      ) : (
        <h2 className="text-3xl sm:text-4xl text-center text-white font-extrabold mb-8 tracking-wide drop-shadow-md">
          Register Student
        </h2>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 rounded-2xl shadow-xl p-5 sm:p-8 max-w-3xl mx-auto space-y-6 border border-gray-200"
      >
        {/* Image Upload */}
        <div>
          <label className="block font-semibold mb-2 text-gray-700 dark:text-gray-300">
            Student Image {!edit && <span className="text-red-500">*</span>}
          </label>
          <input
            type="file"
            name="image"
            ref={fileInputRef}
            accept="image/*"
            required={!edit}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Preview"
              className="mt-3 w-full h-48 object-cover rounded-lg shadow"
            />
          )}
        </div>

        {/* Grid: Name, Email, Class, Age */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block font-semibold mb-2 text-gray-700 dark:text-gray-300">
              Student Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter student name"
              className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
              minLength={4}
            />
          </div>

          <div>
            <label className="block font-semibold mb-2 text-gray-700 dark:text-gray-300">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-2 text-gray-700 dark:text-gray-300">
              Select Class <span className="text-red-500">*</span>
            </label>
            <select
              name="student_class"
              value={formData.student_class}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">-- Select a class --</option>
              {classes.map((classItem) => (
                <option
                  key={classItem._id}
                  value={`${classItem.class_text} [${classItem.class_num}]`}
                >
                  {classItem.class_text} [{classItem.class_num}]
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-2 text-gray-700 dark:text-gray-300">
              Age <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="age"
              min={3}
              value={formData.age}
              onChange={handleChange}
              placeholder="Enter student age"
              className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
        </div>

        {/* Gender */}
        <div>
          <label className="block font-semibold mb-2 text-gray-700 dark:text-gray-300">
            Gender <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-6">
            {["male", "female"].map((gender) => (
              <label
                key={gender}
                className="flex items-center text-gray-700 dark:text-gray-300"
              >
                <input
                  type="radio"
                  name="gender"
                  value={gender}
                  checked={formData.gender === gender}
                  onChange={handleChange}
                  required
                  className="mr-2 focus:ring-2 focus:ring-indigo-500"
                />
                {gender.charAt(0).toUpperCase() + gender.slice(1)}
              </label>
            ))}
          </div>
        </div>

        {/* Guardian Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block font-semibold mb-2 text-gray-700 dark:text-gray-300">
              Guardian Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="guardian"
              value={formData.guardian}
              onChange={handleChange}
              placeholder="Enter guardian name"
              className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
              minLength={4}
            />
          </div>

          <div>
            <label className="block font-semibold mb-2 text-gray-700 dark:text-gray-300">
              Guardian Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="guardian_phone"
              value={formData.guardian_phone}
              onChange={handleChange}
              placeholder="10-digit phone"
              className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
              pattern="[6-9]{1}[0-9]{9}"
              maxLength={10}
              minLength={10}
            />
          </div>
        </div>

        {/* Passwords */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block font-semibold mb-2 text-gray-700 dark:text-gray-300">
              Password {!edit && <span className="text-red-500">*</span>}
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required={!edit}
              minLength={6}
            />
          </div>

          <div>
            <label className="block font-semibold mb-2 text-gray-700 dark:text-gray-300">
              Confirm Password{" "}
              {!edit && <span className="text-red-500">*</span>}
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter password"
              className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required={!edit}
              minLength={6}
            />
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center sm:justify-between">
          <button
            type="submit"
            className="px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg shadow transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Submit
          </button>
          {edit && (
            <button
              type="button"
              onClick={handleCancel}
              className="px-8 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 rounded-lg shadow transition duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* Search and Filter */}
      {students.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 max-w-4xl mx-auto">
          <input
            type="text"
            onChange={(e) => handleSearch(e)}
            placeholder="Search by Name"
            className="w-full sm:w-auto border border-gray-300 dark:border-gray-600 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <select
            onChange={(e) => handleClass(e)}
            className="w-full sm:w-auto border border-gray-300 dark:border-gray-600 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Search by Class</option>
            {classes.map((classItem) => (
              <option
                key={classItem._id}
                value={`${classItem.class_text} [${classItem.class_num}]`}
              >
                {classItem.class_text} [{classItem.class_num}]
              </option>
            ))}
          </select>
        </div>
      )}

      {students.length === 0 && (
        <div className="text-xl mt-[20px] w-full text-center sm:text-3xl text-gray-200 min-h-[30vh]">
          No student registered yet
        </div>
      )}
      {/* Students List */}
      <div className="mt-10 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {students.length > 0 &&
          students.map((student) => (
            <div
              key={student._id}
              className="bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 rounded-xl shadow-md hover:shadow-2xl transition duration-300 border border-gray-200 overflow-hidden flex flex-col"
            >
              <img
                className="w-full h-44 object-cover"
                src={student.student_image}
                alt="Student"
              />
              <div className="p-4 flex-1">
                <p className="text-gray-900 dark:text-gray-100 font-semibold">
                  Name: {student.name}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  Age: {student.age}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  Class: {student.student_class}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  Gender: {student.gender}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  Email: {student.email}
                </p>
                <div className="mt-3 border-t dark:border-gray-600 pt-2 text-gray-700 dark:text-gray-300">
                  <p>Guardian: {student.guardian}</p>
                  <p>Guardian Phone: +91 {student.guardian_phone}</p>
                </div>
              </div>
              <div className="flex justify-between px-4 pb-3">
                <button
                  onClick={() => handleEdit(student._id)}
                  className="text-indigo-600 bg-gray-100 dark:bg-gray-800 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <MdEdit />
                </button>
                <button
                  onClick={() => handleDelete(student._id)}
                  className="text-red-600 bg-gray-100 dark:bg-gray-800 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <MdDelete />
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
