import axios from "axios";
import React, { useEffect, useState } from "react";
import { baseApi } from "../../../environment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";

export const ScheduleEvent = ({
  setNewPeriod,
  selectedClass,
  fetchSchedule,
  edit,
  selectedEventId,
  setEdit,
  setSelectedEventId,
}) => {
  const periods = [
    {
      id: 1,
      label: "Period 1 (10:00 AM - 11:00 AM)",
      startTime: "10:00",
      endTime: "11:00",
    },
    {
      id: 2,
      label: "Period 2 (11:00 AM - 12:00 PM)",
      startTime: "11:00",
      endTime: "12:00",
    },
    {
      id: 3,
      label: "Period 3 (12:00 PM - 1:00 PM)",
      startTime: "12:00",
      endTime: "13:00",
    },
    {
      id: 4,
      label: "Lunch Break (1:00 PM - 2:00 PM)",
      startTime: "13:00",
      endTime: "14:00",
    },
    {
      id: 5,
      label: "Period 4 (2:00 PM - 3:00 PM)",
      startTime: "14:00",
      endTime: "15:00",
    },
    {
      id: 6,
      label: "Period 5 (3:00 PM -4:00 PM)",
      startTime: "15:00",
      endTime: "16:00",
    },
    {
      id: 7,
      label: "Period 6 (4:00 PM -5:00 PM)",
      startTime: "16:00",
      endTime: "17:00",
    },
  ];

  const [formData, setFormData] = useState({
    teacher: "",
    subject: "",
    period: "",
    date: "",
    class: selectedClass,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCancel = () => {
    setNewPeriod(false);
    setEdit(false);
    setSelectedEventId(null);
    setFormData({
      teacher: "",
      subject: "",
      period: "",
      date: "",
    });
  };

  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const fetchData = async () => {
    try {
      const teacherData = await axios.get(
        `${baseApi}/teacher/fetch-with-query`,
        { params: {} }
      );
      const subjectData = await axios.get(`${baseApi}/subject/all`);
      setTeachers(teacherData.data.teachers);
      setSubjects(subjectData.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let date = formData.date;
    let startTime = formData.period.split(",")[0];
    let endTime = formData.period.split(",")[1];

    // Select axios method and URL dynamically
    let operation = axios.post; // store function reference
    let backendUrl = `${baseApi}/schedule/create`;

    if (edit) {
      operation = axios.patch;
      backendUrl = `${baseApi}/schedule/update/${selectedEventId}`;
    }
    // console.log("print formdata",formData);
    try {
      const resp = await operation(backendUrl, {
        formData,
        startTime: new Date(
          date.setHours(startTime.split(":")[0], startTime.split(":")[1])
        ),
        endTime: new Date(
          date.setHours(endTime.split(":")[0], endTime.split(":")[1])
        ),
      });
      // console.log("printing data",resp);
      toast.success(
        edit ? "Period updated successfully" : "Period created successfully"
      );
      fetchSchedule();
      handleCancel();
    } catch (e) {
      console.error("error", e);
      toast.error(e?.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    if (!selectedEventId) return;

    axios
      .get(`${baseApi}/schedule/fetch/${selectedEventId}`)
      .then((resp) => {
        const data = resp.data.data;

        // Convert startTime and endTime to JS Date objects
        const start = new Date(data.startTime);
        const end = new Date(data.endTime);

        // Extract times in HH:mm format
        const startTimeStr = start.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
        const endTimeStr = end.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });

        // Extract just the date (ignore time)
        const dateOnly = new Date(
          start.getFullYear(),
          start.getMonth(),
          start.getDate()
        );

        // Set form data
        setFormData({
          teacher: data.teacher._id, // store ID, not name
          subject: data.subject._id, // store ID, not name
          period: `${startTimeStr},${endTimeStr}`, // format for select
          date: dateOnly, // store Date object for submission
          class: selectedClass,
        });
      })
      .catch((e) => {
        console.log("error in fetching schedule data", e);
      });
  }, [selectedEventId]);

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete?")) {
      axios
        .delete(`${baseApi}/schedule/delete/${selectedEventId}`)
        .then((resp) => {
          toast.success("schedule deleted successfully");
          fetchSchedule();
          handleCancel();
        })
        .catch((e) => {
          console.log("error", e);
          toast.error("something went wrong while deleting schedule");
        });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-xl shadow-md space-y-6"
    >
      {edit ? (
        <h4 className="text-center text-2xl text-gray-800 dark:text-gray-100">
          Edit Period
        </h4>
      ) : (
        <h4 className="text-center text-2xl text-gray-800 dark:text-gray-100">
          Add New Period
        </h4>
      )}

      <div>
        <select
          name="teacher"
          value={formData.teacher}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 dark:border-gray-700 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">-- Select a teacher --</option>
          {teachers.map((Item) => (
            <option key={Item._id} value={Item._id}>
              {Item.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <select
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 dark:border-gray-700 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">-- Select a subject --</option>
          {subjects.map((Item) => (
            <option key={Item._id} value={Item._id}>
              {Item.subject_name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <select
          name="period"
          value={formData.period}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 dark:border-gray-700 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">-- Select a period --</option>
          {periods.map((Item) => (
            <option key={Item.id} value={`${Item.startTime},${Item.endTime}`}>
              {Item.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <DatePicker
          selected={formData.date}
          onChange={(date) => {
            setFormData({ ...formData, date });
          }}
          required
          dateFormat="dd/MM/yyyy"
          placeholderText="Click to select a date"
          className="w-full border border-gray-300 dark:border-gray-700 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="flex justify-between">
        <button
          type="submit"
          className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition-colors"
        >
          Submit
        </button>

        {edit && (
          <button
            type="button"
            onClick={handleDelete}
            className="w-full sm:w-auto px-6 py-3 bg-red-500 text-white rounded-lg shadow hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        )}

        <button
          type="button"
          onClick={handleCancel}
          className="w-full sm:w-auto px-6 py-3 bg-gray-500 text-white rounded-lg shadow hover:bg-gray-700 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};
