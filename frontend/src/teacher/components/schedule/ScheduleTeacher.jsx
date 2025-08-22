import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import axios from "axios";
import { baseApi } from "../../../environment";

const localizer = momentLocalizer(moment);

export const ScheduleTeacher = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedClass, setSelectedClass] = useState("");
  const [classes, setClasses] = useState([]);
  const [calendarView, setCalendarView] = useState("week");

  // Fetch classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const { data } = await axios.get(`${baseApi}/class/all`);
        setClasses(data?.data || []);
        if (data?.data?.length > 0) {
          setSelectedClass(data.data[0]._id);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchClasses();
  }, []);

  const [events, setEvents] = useState([]);

  const fetchSchedule = () => {
    axios
      .get(`${baseApi}/schedule/fetch-with-class/${selectedClass}`)
      .then((resp) => {
        // console.log("printing schedule", resp);
        const respData = resp.data.data.map((x) => ({
          id: x._id,
          title: `Subject: ${x.subject?.subject_name || "N/A"}, Teacher: ${
            x.teacher?.name || "N/A"
          }`,
          start: new Date(x.startTime),
          end: new Date(x.endTime),
        }));

        setEvents(respData);
      })
      .catch((e) => {
        console.log("error in fetching schedule", e);
      });
  };

  useEffect(() => {
    if (selectedClass) {
      fetchSchedule();
    }
  }, [selectedClass]);

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8">
      {/* Title */}
      <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-6 text-center">
        Schedule
      </h2>

      <div className="flex flex-col gap-6">
        {/* Class Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <label className="text-lg font-semibold text-gray-700 dark:text-gray-300">
            Class:
          </label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            required
            className="flex-1 border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 
                   focus:outline-none focus:ring-2 focus:ring-indigo-500 
                   text-gray-700 dark:text-gray-200"
          >
            {classes.map((classItem) => (
              <option key={classItem._id} value={classItem._id}>
                {classItem.class_text} [{classItem.class_num}]
              </option>
            ))}
          </select>
        </div>

        {/* Calendar Section */}
        <div className="w-full h-auto overflow-x-auto">
          <div className="min-w-[1000px] min-h-full bg-white dark:bg-gray-900 shadow-lg rounded-xl p-4">
            <Calendar
              localizer={localizer}
              events={events}
              view={calendarView}
              onView={(newView) => setCalendarView(newView)}
              views={["week", "day", "agenda"]}
              step={30}
              timeslots={1}
              min={new Date(1970, 0, 1, 10, 0, 0)}
              max={new Date(1970, 0, 1, 17, 0, 0)}
              startAccessor="start"
              endAccessor="end"
              date={currentDate}
              onNavigate={(newDate) => setCurrentDate(newDate)}
              showMultiDayTimes
              className="w-full h-[600px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
