import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { FaSchool } from "react-icons/fa";
import { AuthContext } from '../../../context/AuthContext';

export const Navbar = () => {
  const { user, authenticated } = useContext(AuthContext);

  return (
    <div className="w-full bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      <div className="flex flex-col sm:flex-row justify-between items-center px-4 sm:px-8 py-4 gap-4">

        {/* Left section: Logo and Title */}
        <div className="flex items-center gap-3 text-white text-sm sm:text-base md:text-lg lg:text-2xl">
          <NavLink to={"/"} className="hidden sm:block text-white dark:text-gray-200"><FaSchool /></NavLink>
          <h2 className="sm:font-semibold text-center text-white dark:text-gray-100">
            MULTI SCHOOL MANAGEMENT SYSTEM
          </h2>
        </div>

        {/* Right section: Nav Links */}
        <div className="flex flex-wrap justify-center mx-auto gap-4 text-white text-sm sm:text-base md:text-lg lg:text-xl">
          {!authenticated &&
            <NavLink to={"/"} className="bg-indigo-600 dark:bg-gray-700 px-3 py-1 rounded">Home</NavLink>
          }
          {authenticated ? (
            <NavLink to={"/logout"} className="bg-red-500 dark:bg-red-700 px-3 py-1 rounded">Logout</NavLink>
          ) : (
            <NavLink to={"/login"} className="bg-sky-700 dark:bg-sky-900 px-3 py-1 rounded">Login</NavLink>
          )}
          {authenticated ? (
            <NavLink to={`/${user.role.toLowerCase()}`} className="bg-sky-500 dark:bg-sky-800 px-3 py-1 rounded">Dashboard</NavLink>
          ) : (
            <NavLink to={"/register"} className="bg-emerald-800 dark:bg-emerald-900 px-3 py-1 rounded">Register</NavLink>
          )}
        </div>

      </div>
    </div>
  )
}
