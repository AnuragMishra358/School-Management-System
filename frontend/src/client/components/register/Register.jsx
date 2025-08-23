import axios from "axios";
import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import { baseApi } from "../../../environment";
import { useNavigate } from "react-router-dom";

export const Register = () => {
  const [formData, setFormData] = useState({
    school_name: "",
    email: "",
    owner_name: "",
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

  const navigate=useNavigate();
  const [loading,setLoading]=useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!formData.image) return toast.error("Please upload an image");
    if (!formData.school_name.trim() || formData.school_name.length < 6)
      return toast.error("School name too short");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!formData.owner_name.trim() || formData.owner_name.length < 4)
      return toast.error("Owner name too short");
    if (formData.password.length < 6) return toast.error("Password too short");
    if (formData.password !== formData.confirmPassword)
      return toast.error("Passwords do not match");

    const fd = new FormData();
    fd.append("image", formData.image, formData.image.name);
    fd.append("school_name", formData.school_name);
    fd.append("email", formData.email);
    fd.append("owner_name", formData.owner_name);
    fd.append("password", formData.password);

    try {
      await axios.post(`${baseApi}/school/register`, fd, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("School registered successfully!");
      navigate("/login")
      setLoading(false);
      setFormData({
        school_name: "",
        email: "",
        owner_name: "",
        password: "",
        confirmPassword: "",
        image: null,
      });
      setImageUrl("");
      fileInputRef.current.value = null;
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong while registering school.");
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-10 bg-[url(https://img.freepik.com/premium-vector/school-background-with-texture-design-with-educational-icons-pattern-dark-background_490981-69.jpg?w=2000)] dark:bg-gray-900">
      <h2 className="text-4xl text-center text-white font-bold mb-6">
        Register School
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 dark:text-gray-200 rounded-lg shadow-lg p-6 max-w-xl mx-auto space-y-4"
      >
        {/* Image Upload */}
        <div>
          <label className="block font-medium mb-1">
            School Image <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            name="image"
            ref={fileInputRef}
            accept="image/*"
            required
            onChange={handleChange}
            className="block w-full border border-gray-300 dark:border-gray-600 p-2 rounded-md bg-gray-50 dark:bg-gray-700"
          />
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Preview"
              className="mt-3 w-full h-48 object-cover rounded-md shadow"
            />
          )}
        </div>

        {/* School Name */}
        <div>
          <label className="block font-medium mb-1">
            School Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="school_name"
            value={formData.school_name}
            onChange={handleChange}
            placeholder="Enter school name"
            className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-md bg-gray-50 dark:bg-gray-700"
            required
            minLength={6}
          />
        </div>

        {/* Email */}
        <div>
          <label className="block font-medium mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
            className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-md bg-gray-50 dark:bg-gray-700"
            required
          />
        </div>

        {/* Owner Name */}
        <div>
          <label className="block font-medium mb-1">
            Owner Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="owner_name"
            value={formData.owner_name}
            onChange={handleChange}
            placeholder="Enter owner name"
            className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-md bg-gray-50 dark:bg-gray-700"
            required
            minLength={4}
          />
        </div>

        {/* Password */}
        <div>
          <label className="block font-medium mb-1">
            Password <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password"
            className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-md bg-gray-50 dark:bg-gray-700"
            required
            minLength={6}
          />
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block font-medium mb-1">
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Re-enter password"
            className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-md bg-gray-50 dark:bg-gray-700"
            required
            minLength={6}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition"
        >
          {loading?"Registering":"Submit"}
        </button>
      </form>
    </div>
  );
};
