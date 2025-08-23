import axios from "axios";
import React, { useEffect, useState } from "react";
import { baseApi } from "../../../../environment";

export const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedName, setSelectedName] = useState("");
  const [schools, setSchools] = useState([]);

  const openModal = (img, name) => {
    setSelectedImage(img);
    setSelectedName(name);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setSelectedName("");
  };

  useEffect(() => {
    axios.get(`${baseApi}/school/all`).then((resp) => {
      setSchools(resp.data.schools);
    });
  }, []);

  return (
    <div className="bg-[url(https://as1.ftcdn.net/v2/jpg/06/98/77/30/1000_F_698773077_SQeQ2GK8d6fTeqntbuioSweyyCVxaB7M.jpg)] flex items-center justify-center p-6">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-300 dark:text-gray-100 mb-4">
          Registered Schools
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {!schools &&
           <div className="min-h-[50vh] bg-slate-50 dark:bg-slate-800 text-2xl font-bold text-gray-600 dark:text-gray-300">Fetching School Data...</div>
          }
          {/* Gallery Items */}
          {schools &&
            schools.map((school, index) => (
            <div
              key={index}
              onClick={() =>
                openModal(`${school.school_image}`, school.school_name)
              }
              className="bg-white dark:bg-gray-800 rounded overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer"
            >
              <img
                src={`${school.school_image}`}
                alt={school.school_name}
                className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
              />
              <div className="p-4 text-center bg-slate-300 dark:bg-gray-700">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  {school.school_name}
                </h2>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fullscreen Image Modal */}
      {selectedImage && (
        <div
          onClick={closeModal}
          className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center"
        >
          <div className="relative max-w-3xl w-full px-4">
            <button
              onClick={closeModal}
              className="absolute top-2 right-8 text-red-400 text-5xl font-bold hover:text-red-600"
            >
              &times;
            </button>
            <img
              src={selectedImage}
              alt={selectedName}
              className="w-full max-h-[90vh] object-contain rounded-lg"
            />
            <p className="text-center text-white dark:text-gray-200 mt-4 text-2xl font-semibold">
              {selectedName}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
