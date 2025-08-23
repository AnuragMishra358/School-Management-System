import axios from "axios";
import React, { useEffect, useState } from "react";
import { baseApi } from "../../../environment";
import toast from "react-hot-toast";

export const Attendee = ({ classId }) => {
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [teachers, setTeachers] = useState([]);
  const fetchTeacher = async () => {
    try {
      const teacherData = await axios.get(
        `${baseApi}/teacher/fetch-with-query`,
        { params: {} }
      );

      setTeachers(teacherData.data.teachers);
    } catch (error) {
      console.log(error);
    }
  };

  const [attendee, setAttendee] = useState(null);
  const fetchAttendee = async () => {
    try {
      const resp = await axios.get(`${baseApi}/class/single/${classId}`);
      //   console.log("class", resp);
      setAttendee(resp.data.data.attendee ? resp.data.data.attendee : null);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAttendee();
  }, [classId]);

  useEffect(() => {
    fetchTeacher();
  }, []);

  const handleSubmit = async () => {
    try {
      if (!selectedTeacher) {
        toast.error("Please select a teacher");
        return;
      }
      const resp = await axios.patch(`${baseApi}/class/update/${classId}`, {
        attendee: selectedTeacher,
      });
      //   console.log("attendee", resp);
      toast.success("Attendee selected successfully");
      setSelectedTeacher("");
      fetchAttendee();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-6 w-full max-w-md mx-auto mt-6 space-y-4">
      <h2 className="text-center text-2xl font-bold text-gray-800 dark:text-gray-100 drop-shadow-sm">
        Attendee
      </h2>

      {attendee && (
        <div className="flex justify-between items-center bg-gradient-to-r from-indigo-100 to-blue-100 dark:from-gray-800 dark:to-gray-700 p-3 rounded-lg shadow-sm">
          <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Attendee Teacher:
          </h2>
          <h2 className="text-sm font-semibold text-indigo-700 dark:text-indigo-400">
            {attendee.name}
          </h2>
        </div>
      )}

      <select
        name="teacher"
        value={selectedTeacher}
        onChange={(e) => setSelectedTeacher(e.target.value)}
        required
        className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 
           focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition text-gray-800 dark:text-gray-200"
      >
        {teachers.length>0 ?
        <option value="">-- Select a teacher --</option>
        :
        <option value="">No teacher exist</option>
        }
        {teachers.map((Item) => (
          <option key={Item._id} value={Item._id}>
            {Item.name}
          </option>
        ))}
      </select>

      <button
        onClick={handleSubmit}
        className="w-full py-3 rounded-lg font-semibold text-white 
           bg-gradient-to-r from-indigo-500 to-blue-500 
           shadow-md hover:shadow-lg hover:scale-[1.02] 
           transform transition duration-200"
      >
        {attendee ? "Change Attendee" : "Select Attendee"}
      </button>
    </div>
  );
};
