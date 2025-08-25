import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { baseApi } from "../../../environment";


export const Teachers = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    qualification: "",
    age: "",
    gender: "",
    password: "",
    confirmPassword: "",
    image: null,
  });

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
      qualification: "",
      age: "",
      gender: "",
      password: "",
      confirmPassword: "",
    });
    setImageUrl("");
    fileInputRef.current.value = null;
  };

  const [params, setParams] = useState({});

  const handleSearch = (e) => {
    setParams((prevParams) => ({
      ...prevParams,
      search: e.target.value || undefined,
    }));
  };

  const [teachers, setTeachers] = useState([]);
  const fetchTeachers = () => {
    axios
      .get(`${baseApi}/teacher/fetch-with-query`, { params: params })
      .then((resp) => {
        setTeachers(resp.data.teachers);
      })
      .catch((e) => {
        console.log("error in fetching teachers.");
      });
  };

  useEffect(() => {
    fetchTeachers();
  }, [params]);

  const [loading,setLoading]=useState(false);
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
    fd.append("qualification", formData.qualification);
    if (formData.password) {
      fd.append("password", formData.password);
    }
    fd.append("age", formData.age);
    fd.append("gender", formData.gender);
    if (edit) {
      try {
        setLoading(true);
        await axios.patch(`${baseApi}/teacher/update/${editId}`, fd, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        // console.log("response",response);
        toast.success("Teacher updated successfully!");
        setLoading(false);
        handleCancel();

        fetchTeachers();
      } catch (error) {
        // console.error(error);
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Something went wrong while editing Teacher.");
        }
        setLoading(false);
      }
    } else {
      try {
        setLoading(true);
        await axios.post(`${baseApi}/teacher/register`, fd, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        // console.log("response",response);
        toast.success("Teacher registered successfully!");
        setLoading(false);
        clearForm();

        fetchTeachers();
      } catch (error) {
        // console.error(error);
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Something went wrong while registering Teacher.");
        }
        setLoading(false);
      }
    }
  };

  const [edit, setEdit] = useState(false);
  const [editId, setEditId] = useState("");
  const handleEdit = async (id) => {
    setEdit(true);
    setEditId(id);
    const filteredTeacher = teachers.find((item) => item._id === id);
    setFormData({
      name: filteredTeacher.name,
      email: filteredTeacher.email,
      qualification: filteredTeacher.qualification,
      age: filteredTeacher.age,
      gender: filteredTeacher.gender,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete")) {
      await axios
        .delete(`${baseApi}/teacher/delete/${id}`)
        .then((resp) => {
          // console.log("remaining Teachers", resp);
          toast.success("Teacher deleted successfully");
          fetchTeachers();
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 to-teal-500 dark:from-gray-900 dark:to-gray-800 py-10 px-4 sm:px-6 lg:px-8">
      {edit ? (
        <h2 className="text-4xl text-center text-white font-extrabold mb-8 drop-shadow-lg">
          Edit Teacher
        </h2>
      ) : (
        <h2 className="text-4xl text-center text-white font-extrabold mb-8 drop-shadow-lg">
          Register Teacher
        </h2>
      )}

      <form
        onSubmit={handleSubmit}
        className="backdrop-blur-md bg-white/80 dark:bg-gray-900/80 rounded-3xl shadow-2xl p-6 sm:p-10 max-w-2xl mx-auto space-y-6 border border-white/40 dark:border-gray-700"
      >
        {/* Image Upload */}
        <div>
          <label className="block font-semibold mb-2 text-gray-800 dark:text-gray-200">
            Teacher Image less than 1MB{!edit && <span className="text-red-500">*</span>}
          </label>
          <input
            type="file"
            name="image"
            ref={fileInputRef}
            accept="image/*"
            required={!edit}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-700 p-3 rounded-full bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Preview"
              className="mt-3 w-full h-48 object-cover rounded-xl shadow-md"
            />
          )}
        </div>

        {/* Grid: Name, Email, Age, Qualification */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-2 text-gray-800 dark:text-gray-200">
              Teacher Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter Teacher name"
              className="w-full border border-gray-300 dark:border-gray-700 p-3 rounded-full bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
              required
              minLength={4}
            />
          </div>

          <div>
            <label className="block font-semibold mb-2 text-gray-800 dark:text-gray-200">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              className="w-full border border-gray-300 dark:border-gray-700 p-3 rounded-full bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-2 text-gray-800 dark:text-gray-200">
              Age <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="age"
              min={21}
              max={70}
              value={formData.age}
              onChange={handleChange}
              placeholder="Enter Teacher age"
              className="w-full border border-gray-300 dark:border-gray-700 p-3 rounded-full bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-2 text-gray-800 dark:text-gray-200">
              Qualification <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              placeholder="Enter Teacher qualification"
              className="w-full border border-gray-300 dark:border-gray-700 p-3 rounded-full bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
              required
            />
          </div>
        </div>

        {/* Gender */}
        <div>
          <label className="block font-semibold mb-2 text-gray-800 dark:text-gray-200">
            Gender <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-6">
            {["male", "female"].map((gender) => (
              <label
                key={gender}
                className="flex items-center text-gray-700 dark:text-gray-300 font-medium"
              >
                <input
                  type="radio"
                  name="gender"
                  value={gender}
                  checked={formData.gender === gender}
                  onChange={handleChange}
                  required
                  className="mr-2 focus:ring-2 focus:ring-sky-400"
                />
                {gender.charAt(0).toUpperCase() + gender.slice(1)}
              </label>
            ))}
          </div>
        </div>

        {/* Passwords */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-2 text-gray-800 dark:text-gray-200">
              Password {!edit && <span className="text-red-500">*</span>}
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="w-full border border-gray-300 dark:border-gray-700 p-3 rounded-full bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
              required={!edit}
              minLength={6}
            />
          </div>

          <div>
            <label className="block font-semibold mb-2 text-gray-800 dark:text-gray-200">
              Confirm Password{" "}
              {!edit && <span className="text-red-500">*</span>}
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter password"
              className="w-full border border-gray-300 dark:border-gray-700 p-3 rounded-full bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
              required={!edit}
              minLength={6}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-between">
          <button
            type="submit"
            className="px-8 bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 rounded-full transition duration-300 shadow-lg"
          >
           {loading?"Please Wait...":"Submit"} 
          </button>

          {edit && (
            <button
              type="button"
              onClick={handleCancel}
              className="px-8 bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 rounded-full transition duration-300 shadow-lg"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* Search */}
      
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 max-w-4xl mx-auto">
        <input
          type="text"
          onChange={(e) => handleSearch(e)}
          placeholder="Search with Name"
          className="w-full sm:w-auto border border-gray-300 dark:border-gray-700 p-3 rounded-full bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
        />
      </div>
      
      
      {teachers.length===0 &&
       <div className="text-xl mt-[20px] w-full text-center sm:text-3xl text-gray-200 min-h-[30vh]">
          No teacher found
        </div>
      }
      {/* Teachers List */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {teachers &&
          teachers.map((teacher) => (
            <div
              key={teacher._id}
              className="bg-white/90 dark:bg-gray-900/90 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg overflow-hidden hover:scale-105 hover:shadow-2xl transition-transform duration-300"
            >
              <img
                className="w-full h-40 object-cover"
                src={teacher.teacher_image}
                alt="Teacher"
              />
              <div className="p-4 space-y-1">
                <p className="text-gray-800 dark:text-gray-200">
                  <span className="font-bold">Name:</span> {teacher.name}
                </p>
                <p className="text-gray-800 dark:text-gray-200">
                  <span className="font-bold">Age:</span> {teacher.age}
                </p>
                <p className="text-gray-800 dark:text-gray-200">
                  <span className="font-bold">Qualification:</span>{" "}
                  {teacher.qualification}
                </p>
                <p className="text-gray-800 dark:text-gray-200">
                  <span className="font-bold">Gender:</span> {teacher.gender}
                </p>
                <p className="text-gray-800 dark:text-gray-200">
                  <span className="font-bold">Email:</span> {teacher.email}
                </p>
              </div>
              <div className="flex justify-between px-4 pb-4 text-xl">
                <button
                  onClick={() => handleEdit(teacher._id)}
                  className="text-sky-600 bg-gray-100 dark:bg-gray-800 p-2 rounded-full hover:bg-sky-100 dark:hover:bg-gray-700"
                >
                  <MdEdit />
                </button>
                <button
                  onClick={() => handleDelete(teacher._id)}
                  className="text-red-500 bg-gray-100 dark:bg-gray-800 p-2 rounded-full hover:bg-red-100 dark:hover:bg-gray-700"
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
