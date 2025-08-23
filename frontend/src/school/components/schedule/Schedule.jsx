import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import { ScheduleEvent } from "./ScheduleEvent";
import axios from "axios";
import { baseApi } from "../../../environment";
import "./Schedule.css";

const localizer = momentLocalizer(moment);

export const Schedule = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [newPeriod, setNewPeriod] = useState(false);
  const [selectedClass, setSelectedClass] = useState("");
  const [classes, setClasses] = useState([]);
  const [calendarView, setCalendarView] = useState("week");

  // Fetch classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const { data } = await axios.get(`${baseApi}/class/all`);
        setClasses(data?.data || []);
        setSelectedClass(data?.data[0]?._id);
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
          title: `Subject: ${x.subject.subject_name}, Teacher: ${x.teacher.name}`,
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

  const [edit, setEdit] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const handleSelectEvent = (event) => {
    setEdit(true);
    setSelectedEventId(event.id);
    //  console.log(event);
  };

  return (
    <div className="p-1 sm:p-2 lg:p-4 space-y-2 bg-white dark:bg-gray-900 min-h-screen transition-colors">
      <h1 className="text-center text-3xl font-bold ">Schedule</h1>
      <div className="sm:flex-row sm:justify-between flex flex-col gap-4">
        
        {/* Class Selector */}
        <div className="flex items-center gap-2">
          <label className="block text-2xl font-semibold text-gray-700 dark:text-gray-200">
            Class:
          </label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            required
            className="w-full border border-gray-300 dark:border-gray-600 p-2 sm:p-3 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          > 
            <option value={""}>No class exist</option>
            {classes.map((classItem) => (
              <option key={classItem._id} value={classItem._id}>
                {classItem.class_text} [{classItem.class_num}]
              </option>
            ))}
          </select>
        </div>

        {/* Add Period Button */}
        {!newPeriod && !edit && (
          <div>
            <button
              onClick={() => {
                setNewPeriod(true);
              }}
              className="w-full sm:w-auto bg-blue-500 text-white px-4 sm:px-6 py-2 rounded-lg shadow hover:bg-blue-600 transition"
            >
              Add New Period
            </button>
          </div>
        )}
      </div>

      {/* New Period Form */}
      {(newPeriod || edit) && (
        <ScheduleEvent
          setNewPeriod={setNewPeriod}
          selectedClass={selectedClass}
          fetchSchedule={fetchSchedule}
          edit={edit}
          selectedEventId={selectedEventId}
          setSelectedEventId={setSelectedEventId}
          setEdit={setEdit}
        />
      )}

      {/* Calendar */}
      <div className="w-full h-auto overflow-x-auto overflow-y-hidden">
        <div className="min-w-[1000px] min-h-full">
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
            onSelectEvent={handleSelectEvent}
            date={currentDate}
            onNavigate={(newDate) => setCurrentDate(newDate)}
            showMultiDayTimes
            style={{ width: "100%" }}
          />
        </div>
      </div>
    </div>
  );
};
