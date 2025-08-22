import React, { useEffect, useRef, useState } from "react";
import { baseApi } from "../../../environment";
import axios from "axios";
import { MdEdit } from "react-icons/md";
import toast from "react-hot-toast";

export const Dashboard = () => {
  const [imageUrl, setImageUrl] = useState("");
  const fileInputRef = useRef();
  const [image, setImage] = useState(null);
  const [schoolName, setSchoolName] = useState("");
  const [message, setMessage] = useState("");

  const [openForm, setOpenForm] = useState(false);

  const [school, setSchool] = useState(null);

  const fetchSchool = () => {
    axios
      .get(`${baseApi}/school/fetch-single`)
      .then((resp) => {
        // console.log("school data",resp.data.school.school_image);
        setSchool(resp.data.school);
        setSchoolName(resp.data.school.school_name);
      })
      .catch((e) => {
        console.log("Error", e);
      });
  };

  const handleSubmitEdit = (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("school_name", schoolName);
    if (image) {
      fd.append("image", image, image.name);
    }
    axios
      .patch(`${baseApi}/school/update`, fd)
      .then((resp) => {
        toast.success("School Updated Successfully");
        setMessage(resp.data);
        handleCancelEdit();
      })
      .catch((e) => {
        console.log("error", e);
        toast.error(e.resp.data.message || "Updation failed please try again");
      });
  };

  const handleChange = (e) => {
    const { value, files } = e.target;
    if (files) {
      setImage(files[0]);
      setImageUrl(URL.createObjectURL(files[0]));
      //  console.log("school image ",files[0]);
      // console.log("school image name",files[0].name);
    } else {
      setSchoolName(value);
      // console.log("school name",value);
    }
  };

  const handleCancelEdit = () => {
    setImageUrl("");
    setImage(null);
    fileInputRef.current.value = null;
    setSchoolName(school.school_name);
    setOpenForm(false);
  };

  useEffect(() => {
    fetchSchool();
  }, [message]);

  return (
    <div className="flex flex-col md:px-2 w-full bg-gray-100 dark:bg-gray-900">
      <div className="text-3xl font-bold text-center my-2 text-blue-800 dark:text-blue-400">
        Dashboard
      </div>

      {openForm && (
        <div className="mb-8">
          <h2 className="text-2xl text-center font-semibold text-gray-700 dark:text-gray-200 mb-4">
            Edit School
          </h2>

          <form
            onSubmit={handleSubmitEdit}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 max-w-xl w-full mx-auto space-y-4"
          >
            {/* Image Upload */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                School Image
              </label>
              <input
                type="file"
                name="image"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleChange}
                className="block w-full border border-gray-300 dark:border-gray-600 p-2 rounded-lg bg-white dark:bg-gray-700 shadow-sm focus:ring focus:ring-blue-200 dark:focus:ring-blue-400"
              />
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="mt-4 w-full h-52 object-cover rounded-xl border shadow-md"
                />
              )}
            </div>

            {/* School Name */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                School Name
              </label>
              <input
                type="text"
                name="school_name"
                value={schoolName}
                onChange={handleChange}
                placeholder="Enter school name"
                className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-lg bg-white dark:bg-gray-700 shadow-sm focus:ring focus:ring-blue-200 dark:focus:ring-blue-400"
                required
                minLength={6}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-all duration-200"
              >
                Submit Edit
              </button>

              <button
                type="button"
                onClick={handleCancelEdit}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 rounded-lg transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {school && (
        <div
          style={{
            backgroundImage: `url(${school.school_image})`,
          }}
          className="h-[78vh] sm:h-[80vh] w-full bg-center bg-cover relative rounded-sm shadow-lg overflow-hidden"
        >
          <div className="absolute inset-0 bg-black/20 flex justify-center items-center">
            <h3 className="text-white font-semibold text-2xl md:text-4xl text-center px-4">
              {school.school_name}
            </h3>
          </div>
          <button
            onClick={() => setOpenForm(true)}
            className="absolute bottom-6 right-6 bg-white dark:bg-gray-800 hover:bg-yellow-100 dark:hover:bg-gray-700 rounded-full h-12 w-12 flex items-center justify-center shadow-lg transition"
          >
            <MdEdit className="text-3xl text-black dark:text-white" />
          </button>
        </div>
      )}
    </div>
  );
};
