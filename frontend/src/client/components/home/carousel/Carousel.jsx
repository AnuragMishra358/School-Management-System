import React, { useState } from "react";
import { FaLeftLong } from "react-icons/fa6";
import { FaRightLong } from "react-icons/fa6";

const studentImages = [
  {
    url: "https://static.vecteezy.com/system/resources/previews/002/420/847/large_2x/back-to-school-background-with-school-supplies-background-free-photo.jpg",
    caption: "Explore our vibrant classrooms",
  },
  {
    url: "https://wallpaperbat.com/img/560417-background-image-for-student-portal-1920x1080-download-hd-wallpaper-wallpapertip.jpg",
    caption: "Empowering young minds every day",
  },
  {
    url: "https://img.freepik.com/premium-vector/back-school-background-with-light-bulb-rocket-pencil-launching-space-online-learning_90099-1454.jpg?w=2000",
    caption: "Learning through play and creativity",
  },
];

export const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? studentImages.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === studentImages.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="relative w-full overflow-hidden min-h-[20vh] sm:min-h-[50vh] sm:max-h-[70vh] ">
      {/* Image */}
      <img
        src={studentImages[currentIndex].url}
        alt="Student"
        className="object-cover overflow-hidden min-w-full transition-all duration-500"
      />

      {/* Overlay Caption */}
      <div className="absolute bottom-0 w-full bg-black bg-opacity-50 text-white dark:bg-gray-900 dark:bg-opacity-70 dark:text-gray-100 text-center sm:py-4">
        <p className="text-xl sm:text-2xl font-semibold">
          {studentImages[currentIndex].caption}
        </p>
      </div>

      {/* Left Button */}
      <button
        onClick={handlePrev}
        className="absolute bg-gray-300 dark:bg-gray-700 top-1/2 left-4 transform -translate-y-1/2 bg-opacity-70 text-gray-700 dark:text-gray-200 hover:bg-opacity-100 p-2 shadow"
      >
        <FaLeftLong className="text-red-500 text-2xl" />
      </button>

      {/* Right Button */}
      <button
        onClick={handleNext}
        className="absolute bg-gray-300 dark:bg-gray-700 top-1/2 right-4 transform -translate-y-1/2 bg-opacity-70 text-gray-700 dark:text-gray-200 hover:bg-opacity-100 p-2 shadow"
      >
        <FaRightLong className="text-red-500 text-2xl" />
      </button>
    </div>
  );
};
