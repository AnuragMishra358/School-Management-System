import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { School } from "./school/School";
import { Class } from "./school/components/class/Class";
import { Dashboard } from "./school/components/dashboard/Dashboard";
import { Examinations } from "./school/components/examinations/Examinations";
import { Notice } from "./school/components/notice/Notice";
import { Schedule } from "./school/components/schedule/Schedule";
import { Students } from "./school/components/students/Students";
import { Teachers } from "./school/components/teachers/Teachers";
import { Subjects } from "./school/components/subjects/Subjects";
import { Client } from "./client/Client";
import { Register } from "./client/components/register/Register";
import { Login } from "./client/components/login/Login";
import { Home } from "./client/components/home/Home";
import { Teacher } from "./teacher/Teacher";
import { AttendanceTeacher } from "./teacher/components/attendance/AttendanceTeacher";
import { ExaminationsTeacher } from "./teacher/components/examinations/ExaminationsTeacher";
import { NoticeTeacher } from "./teacher/components/notice/NoticeTeacher";
import { ScheduleTeacher } from "./teacher/components/schedule/ScheduleTeacher";
import { TeacherDetails } from "./teacher/components/teacher details/TeacherDetails";
import { Student } from "./student/Student";
import { StudentDetails } from "./student/components/student details/StudentDetails";
import { AttendanceStudent } from "./student/components/attendance/AttendanceStudent";
import { NoticeStudent } from "./student/components/notice/NoticeStudent";
import { ScheduleStudent } from "./student/components/schedule/ScheduleStudent";
import { ExaminationsStudent } from "./student/components/examinations/ExaminationsStudent";
import { Toaster } from "react-hot-toast";
import { ProtectedRoute } from "./guard/ProtectedRoute";
import { AttendanceStudentList } from "./school/components/attendance/AttendanceStudentList";
import { AttendanceDetails } from "./school/components/attendance/AttendanceDetails";
import { LogOut } from "./client/components/logout/LogOut";
import { DraggableButton } from "./basic_utility_components/draggable/DraggableButton";


function App() {
 
  
  return (
   
      <BrowserRouter>
        <Toaster />
        <DraggableButton />
        <Routes>
          {/* school */}
          <Route
            path="school"
            element={
              <ProtectedRoute allowedRoles={["SCHOOL"]}>
                <School />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="attendance" element={<AttendanceStudentList />} />
            <Route path="attendance/:id" element={<AttendanceDetails />} />
            <Route path="class" element={<Class />} />
            <Route path="examinations" element={<Examinations />} />
            <Route path="notice" element={<Notice />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="students" element={<Students />} />
            <Route path="subjects" element={<Subjects />} />
            <Route path="teachers" element={<Teachers />} />
          </Route>

          {/* student */}
          <Route
            path="student"
            element={
              <ProtectedRoute allowedRoles={["STUDENT"]}>
                <Student />
              </ProtectedRoute>
            }
          >
            <Route index element={<StudentDetails />} />
            <Route path="attendance" element={<AttendanceStudent />} />
            <Route path="notice" element={<NoticeStudent />} />
            <Route path="schedule" element={<ScheduleStudent />} />
            <Route path="examinations" element={<ExaminationsStudent />} />
          </Route>

          {/* teacher */}
          <Route
            path="teacher"
            element={
              <ProtectedRoute allowedRoles={["TEACHER"]}>
                <Teacher />
              </ProtectedRoute>
            }
          >
            <Route index element={<TeacherDetails />} />
            <Route path="attendance" element={<AttendanceTeacher />} />
            <Route path="examinations" element={<ExaminationsTeacher />} />
            <Route path="notice" element={<NoticeTeacher />} />
            <Route path="schedule" element={<ScheduleTeacher />} />
          </Route>

          {/* client */}
          <Route path="/" element={<Client />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="logout" element={<LogOut />} />
          </Route>
        </Routes>
      </BrowserRouter>
    
  );
}

export default App;
