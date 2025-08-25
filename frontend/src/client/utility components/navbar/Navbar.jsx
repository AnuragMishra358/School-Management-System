import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { FaSchool } from "react-icons/fa";
import { AuthContext } from "../../../context/AuthContext";

export const Navbar = () => {
  const { user, authenticated } = useContext(AuthContext);

  return (
    <div className="w-full bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      <div className="flex flex-col sm:flex-row justify-between items-center px-4 sm:px-8 py-4 gap-4">
        {/* Left section: Logo and Title */}
        <div className="flex items-center gap-3 text-white text-sm sm:text-base md:text-lg lg:text-2xl">
          <NavLink
            to={"/"}
            className="hidden sm:block text-white dark:text-gray-200"
          >
            <FaSchool />
          </NavLink>
          <h2 className="sm:font-semibold text-center text-white dark:text-gray-100">
            MULTI SCHOOL MANAGEMENT SYSTEM
          </h2>
        </div>

        {/* Right section: Nav Links */}
        <div className="flex flex-wrap justify-center mx-auto gap-4 text-white text-sm sm:text-base md:text-lg lg:text-xl">
          {!authenticated && (
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-3 py-1 rounded transition-colors ${
                  isActive
                    ? "bg-yellow-500 text-white dark:bg-yellow-800" // active
                    : "bg-indigo-600 text-white dark:bg-gray-700" // inactive
                }`
              }
            >
              Home
            </NavLink>
          )}

          {authenticated ? (
            <NavLink
              to="/logout"
              className={({ isActive }) =>
                `px-3 py-1 rounded transition-colors ${
                  isActive
                    ? "bg-yellow-500 text-white dark:bg-yellow-800"
                    : "bg-indigo-600 text-white dark:bg-gray-700"
                }`
              }
            >
              Logout
            </NavLink>
          ) : (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `px-3 py-1 rounded transition-colors ${
                  isActive
                    ? "bg-yellow-500 text-white dark:bg-yellow-800"
                    : "bg-indigo-600 text-white dark:bg-gray-700"
                }`
              }
            >
              Login
            </NavLink>
          )}

          {authenticated ? (
            <NavLink
              to={`/${user.role.toLowerCase()}`}
              className={({ isActive }) =>
                `px-3 py-1 rounded transition-colors ${
                  isActive
                    ? "bg-yellow-500 text-white dark:bg-yellow-800"
                    : "bg-indigo-600 text-white dark:bg-gray-700"
                }`
              }
            >
              Dashboard
            </NavLink>
          ) : (
            <NavLink
              to="/register"
              className={({ isActive }) =>
                `px-3 py-1 rounded transition-colors ${
                  isActive
                    ? "bg-yellow-500 text-white dark:bg-yellow-800"
                    : "bg-indigo-600 text-white dark:bg-gray-700"
                }`
              }
            >
              Register
            </NavLink>
          )}
        </div>
      </div>
    </div>
  );
};
