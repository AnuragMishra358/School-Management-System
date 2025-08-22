import axios from "axios";
import React, { useContext, useState } from "react";
import toast from "react-hot-toast";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { baseApi } from "../../../environment";

export const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    role: "student",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  async function submitHandler(e) {
    e.preventDefault();

    try {
      let backendUrl;

      if (formData.role === "school") {
        backendUrl = `${baseApi}/school/login`;
      } else if (formData.role === "teacher") {
        backendUrl = `${baseApi}/teacher/login`;
      } else if (formData.role === "student") {
        backendUrl = `${baseApi}/student/login`;
      }
      const res = await axios.post(backendUrl, formData);

      const token = res.headers.get("Authorization");
      const user = res.data.user;

      if (token) {
        localStorage.setItem("token", token);
      }

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        login(user);
      }

      toast.success("Login Successfully");

      setFormData({
        email: "",
        password: "",
      });

      navigate(`/${formData.role}`);
    } catch (e) {
      console.log(e);
      toast.error(
        e.response?.data?.message || e.message || "Something went wrong"
      );
    }
  }

  return (
    <div className="py-10 bg-[url(https://img.freepik.com/premium-vector/school-background-with-texture-design-with-educational-icons-pattern-dark-background_490981-69.jpg?w=2000)] bg-cover bg-center min-h-screen overflow-hidden dark:bg-gray-900">
      <h2 className="text-gray-200 dark:text-gray-100 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-center">
        Login
      </h2>

      <form
        onSubmit={(e) => submitHandler(e)}
        className="flex flex-col gap-2 mt-8 mb-10 px-4 py-6 w-[90vw] sm:w-[70vw] md:w-[50vw] lg:w-[30vw] bg-white bg-opacity-90 dark:bg-gray-800 dark:bg-opacity-90 rounded-xl shadow-xl shadow-slate-800 m-auto"
      >
        {/* Role */}
        <label className="text-gray-700 dark:text-gray-200 font-medium px-1 text-sm sm:text-base">
          Role <i className="text-red-500">*</i>
        </label>
        <select
          value={formData.role}
          name="role"
          onChange={handleChange}
          className="bg-gray-100 dark:bg-gray-700 dark:text-gray-100 p-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        >
          <option value={"school"}>School Owner</option>
          <option value={"teacher"}>Teacher</option>
          <option value={"student"}>Student</option>
        </select>

        {/* Email */}
        <label className="text-gray-700 dark:text-gray-200 font-medium px-1 text-sm sm:text-base">
          Email <i className="text-red-500">*</i>
        </label>
        <input
          className="bg-gray-100 dark:bg-gray-700 dark:text-gray-100 p-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          type="email"
          name="email"
          placeholder="Enter email"
          required
          value={formData.email}
          onChange={handleChange}
        />

        {/* Password */}
        <label className="text-gray-700 dark:text-gray-200 font-medium px-1 text-sm sm:text-base">
          Password <i className="text-red-500">*</i>
        </label>
        <input
          className="bg-gray-100 dark:bg-gray-700 dark:text-gray-100 p-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          type="password"
          name="password"
          placeholder="Enter password"
          required
          minLength={6}
          value={formData.password}
          onChange={handleChange}
        />

        {/* Submit */}
        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
};
