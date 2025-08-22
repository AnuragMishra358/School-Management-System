import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import axios from "axios";
import { baseApi } from "../../../environment";
import "./ScheduleStudent.css"

const localizer = momentLocalizer(moment);

export const ScheduleStudent = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState("week");

  const [student, setStudent] = useState("");
  const fetchStudent = async () => {
    try {
      const resp = await axios.get(`${baseApi}/student/fetch-single`);
      setStudent(resp.data.student);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchStudent();
  }, []);

  // Fetch classes
  const [studentClass, setStudentClass] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const stuClass = student.student_class.split(" ")[0];
        const { data } = await axios.get(`${baseApi}/class/all`);
        const classData = data.data.filter((x) => x.class_text === stuClass);
        console.log("classData", classData);
        setSelectedClass(classData[0]._id);
        setStudentClass(classData[0].class_text);
      } catch (error) {
        console.error(error);
      }
    };
    if (student) {
      fetchClasses();
    }
  }, [student]);

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
        Schedule of your class [{studentClass}]
      </h2>

      <div className="flex flex-col gap-6">
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
