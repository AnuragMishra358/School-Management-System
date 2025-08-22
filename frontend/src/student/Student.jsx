import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { FaHome, FaThList } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { GrFormSchedule } from "react-icons/gr";
import { IoIosNotifications } from "react-icons/io";
import { FaDeleteLeft } from "react-icons/fa6";
import { GiArchiveRegister } from "react-icons/gi";
import { PiExam } from "react-icons/pi";
import { IoLogOutOutline } from "react-icons/io5";

export const Student = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="relative">
          {/* Top Navbar */}
          <div
            className="w-full h-20 flex items-center px-4
                bg-gradient-to-r from-indigo-500 via-cyan-500 to-sky-500
                dark:from-gray-900 dark:via-gray-900 dark:to-gray-900"
          >
            {/* Button to open drawer */}
            <button
              onClick={toggleDrawer}
              className="p-3 text-2xl bg-blue-600 text-white rounded-md mr-4
               dark:bg-gray-700"
            >
              <FaThList />
            </button>

            {/* Center Title */}
            <div className="flex-1 text-center">
              <h2 className="text-white text-base sm:text-lg md:text-2xl lg:text-4xl font-bold">
                MULTI SCHOOL MANAGEMENT SYSTEM
              </h2>
            </div>
          </div>

          {/* Overlay */}
          {isOpen && (
            <div
              onClick={toggleDrawer}
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
            ></div>
          )}

          {/* Drawer panel */}
          <div
            className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg z-50 transform transition-transform duration-300 ${
              isOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Navigation
              </h2>
              <button
                onClick={toggleDrawer}
                className="text-red-600 dark:text-red-400 text-2xl"
              >
                <FaDeleteLeft />
              </button>
            </div>

            <ul className="text-gray-700 dark:text-gray-200 text-base sm:text-lg md:text-xl">
              <li className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700">
                <a
                  href="/"
                  className="py-3 px-4 flex items-center gap-3 font-medium"
                >
                  <FaHome /> Home
                </a>
              </li>
              <li className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700">
                <a
                  href="/student"
                  className="py-3 px-4 flex items-center gap-3 font-medium"
                >
                  <MdDashboard /> Your Details
                </a>
              </li>
              <li className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700">
                <a
                  href="/student/schedule"
                  className="py-3 px-4 flex items-center gap-3 font-medium"
                >
                  <GrFormSchedule /> Schedule
                </a>
              </li>
              <li className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700">
                <a
                  href="/student/attendance"
                  className="py-3 px-4 flex items-center gap-3 font-medium"
                >
                  <GiArchiveRegister /> Attendance
                </a>
              </li>
              <li className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700">
                <a
                  href="/student/examinations"
                  className="py-3 px-4 flex items-center gap-3 font-medium"
                >
                  <PiExam /> Examinations
                </a>
              </li>
              <li className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700">
                <a
                  href="/student/notice"
                  className="py-3 px-4 flex items-center gap-3 font-medium"
                >
                  <IoIosNotifications /> Notice
                </a>
              </li>
              <li className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700">
                <a
                  href="/logout"
                  className="py-3 px-4 flex items-center gap-3 font-medium"
                >
                  <IoLogOutOutline /> Logout
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div>
          <Outlet />
        </div>
      </div>
    </>
  );
};
