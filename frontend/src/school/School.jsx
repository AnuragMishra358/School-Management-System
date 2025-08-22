import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { FaThList } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { MdFlightClass } from "react-icons/md";
import { MdOutlineSubject } from "react-icons/md";
import { PiStudent } from "react-icons/pi";
import { GiTeacher } from "react-icons/gi";
import { GrFormSchedule } from "react-icons/gr";
import { IoIosNotifications } from "react-icons/io";
import { FaDeleteLeft } from "react-icons/fa6";
import { FaHome } from "react-icons/fa";
import { GiArchiveRegister } from "react-icons/gi";
import { PiExam } from "react-icons/pi";
import { IoLogOutOutline } from "react-icons/io5";

export const School = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="relative">
          {/* Top Navbar */}
          <div className="w-full h-20 bg-gradient-to-r from-indigo-500 to-cyan-500 dark:from-gray-900 dark:to-gray-900 flex items-center px-4">
            {/* Drawer Button */}
            <button
              onClick={toggleDrawer}
              className="p-3 bg-blue-600 dark:bg-gray-800 text-white rounded-md mr-4"
            >
              <FaThList className="text-sm sm:text-2xl" />
            </button>

            {/* Title */}
            <div className="flex-1 text-center">
              <h2 className="text-white text-sm sm:text-lg md:text-2xl lg:text-4xl sm:font-bold">
                MULTI SCHOOL MANAGEMENT SYSTEM
              </h2>
            </div>
          </div>

          {/* Drawer Overlay */}
          {isOpen && (
            <div
              onClick={toggleDrawer}
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
            ></div>
          )}

          {/* Drawer Panel */}
          <div
            className={`fixed top-0 left-0 h-full w-40 sm:w-60 bg-white dark:bg-gray-800 shadow-lg z-50 transform transition-transform duration-300 ${
              isOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-semibold dark:text-white">
                Navigation
              </h2>
              <button onClick={toggleDrawer} className="text-red-600 text-2xl">
                <FaDeleteLeft />
              </button>
            </div>

            <ul className="text-gray-700 dark:text-gray-200 text-base sm:text-lg md:text-xl">
              <li className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700">
                <a
                  href="/"
                  className=" py-3 px-4 flex items-center gap-3 font-medium"
                >
                  <FaHome /> Home
                </a>
              </li>
              <li className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700">
                <a
                  href="/school"
                  className="py-3 px-4 flex items-center gap-3 font-medium"
                >
                  <MdDashboard /> Dashboard
                </a>
              </li>
              <li className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700">
                <a
                  href="/school/class"
                  className="py-3 px-4 flex items-center gap-3 font-medium"
                >
                  <MdFlightClass /> Class
                </a>
              </li>
              <li className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700">
                <a
                  href="/school/subjects"
                  className="py-3 px-4 flex items-center gap-3 font-medium"
                >
                  <MdOutlineSubject /> Subjects
                </a>
              </li>
              <li className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700">
                <a
                  href="/school/students"
                  className="py-3 px-4 flex items-center gap-3 font-medium"
                >
                  <PiStudent /> Students
                </a>
              </li>
              <li className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700">
                <a
                  href="/school/teachers"
                  className="py-3 px-4 flex items-center gap-3 font-medium"
                >
                  <GiTeacher /> Teachers
                </a>
              </li>
              <li className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700">
                <a
                  href="/school/schedule"
                  className="py-3 px-4 flex items-center gap-3 font-medium"
                >
                  <GrFormSchedule /> Schedule
                </a>
              </li>
              <li className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700">
                <a
                  href="/school/attendance"
                  className="py-3 px-4 flex items-center gap-3 font-medium"
                >
                  <GiArchiveRegister /> Attendance
                </a>
              </li>
              <li className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700">
                <a
                  href="/school/examinations"
                  className="py-3 px-4 flex items-center gap-3 font-medium"
                >
                  <PiExam /> Examinations
                </a>
              </li>
              <li className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700">
                <a
                  href="/school/notice"
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
        <div className="dark:text-gray-100">
          <Outlet />
        </div>
      </div>
    </>
  );
};
