import React, { useEffect,useState } from 'react';
import {BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import './App.css';
import Home from './components/Home';
import About from './components/About';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Contact from './components/Contact';
import Login from './components/Login';
import Admin from './components/Admin';
import AdminDashboard from './components/AdminDashboard';
import CourseList from './components/CourseList';
import {AuthProvider, useAuth} from "./components/AuthContext";
import CreateCourseComponent from './components/CreateCourseComponent';
import ChangePassword from './components/ChangePassword';
import AdminNavigation from './components/AdminNavigation';
import FileUpload from './components/FileUpload';
import Chat from './components/Chat';
import CourseForm from './components/CourseForm';
import TopicsForm from './components/TopicsForm';
import TestForm from './components/TestForm';
import RegisterTeacher from './components/RegisterTeacher';
import TeacherDashboard from './components/TeacherDashboard';
import TeacherProfile from './components/TeacherProfile';
import StudentsDashboard from './components/StudentsDashboard';
import StudentProfile from './components/StudentProfile';
import CourseDetails from './components/CourseDetails';
import MyCourses from './components/MyCourses';
import Study from './components/Study';
import TeacherCourses from './components/TeacherCourses';
import StudentsTeachersSearch from './components/StudentsTeachersSearch';
import TopicUpdate from './components/TopicUpdate';

function App(){
    const [showNavbar, setShowNavbar] = useState(true);
    useEffect(() => {
      // Run toggleTheme when the component mounts
      toggleTheme();
    }, []); // Empty dependency array ensures that this effect runs only on component mount
  
    // Check if there's a theme preference stored in local storage
    const savedTheme = localStorage.getItem('theme');
    const [theme, setTheme] = useState("light"); // Initialize with a default theme
    // If there's a theme preference, apply it
    if (savedTheme) {
      document.documentElement.setAttribute('data-bs-theme', savedTheme);
    }
    // Function to toggle between dark and light themes
    const toggleTheme = () => {
      const currentTheme = document.documentElement.getAttribute('data-bs-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
      // Apply the new theme
      document.documentElement.setAttribute('data-bs-theme', newTheme);

      // Save the theme preference in local storage
      localStorage.setItem('theme', newTheme);
    };
    
    
    return (
      <BrowserRouter>
        <AuthProvider>
        {useAuth().user?.role !== 0 && showNavbar && <Navbar theme={theme} toggleTheme={toggleTheme} />}
        {/* Include admin navigation if the user is an admin */}
        {useAuth().user?.role === 0 && <AdminNavigation theme={theme} toggleTheme={toggleTheme} />}
          <div className="row">
            <div className="container">
                <div className="toggle d-flex">
                <div className="form-check form-switch ms-auto mt-3 me-3 order-md-1" style={{position:"fixed",right:"0",top:"1%",paddingTop:"5%"}}>
                    <label className="form-check-label ms-3" htmlFor="lightSwitch">
                      <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-brightness-high" viewBox="0 0 16 16">
                          <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"></path>
                      </svg>
                    </label>
                    <input className="form-check-input btn-check" type="checkbox" onClick={() => {
                            toggleTheme() }} id="lightSwitch" checked={theme === 'light'} />
                </div>
                </div>
            </div>
          </div>
          <br />
          <div className="mt-3">
              <Routes>
                <Route path="/" exact element={<Home />} />
                <Route path="/course-list" element={<CourseList />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/create-course" element={<CreateCourseComponent />} />
                <Route path="/login" element={<Login />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin-dashboard" element={<AdminDashboard setShowNavbar={setShowNavbar} />} />
                <Route path="/admin-dashboard/change-password" element={<ChangePassword />} />
                <Route path="/fileupload" element={<FileUpload />} />
                <Route path="/chat" element={<Chat />} />
                
                <Route path="/teacher-dashboard/create-course" element={<CourseForm />} />
                
                <Route path="/teacher-dashboard/create-topic" element={<TopicsForm />} />
                <Route path="/teacher-dashboard/create-test" element={<TestForm />} />

                <Route path="/teacher-dashboard/profile" element={<TeacherProfile />} />
                <Route path="/register-teacher" element={<RegisterTeacher />} />
                
                <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
                
                
                <Route path="/student-dashboard" element={<StudentsDashboard />} />
                <Route path="/student-dashboard/student-profile" element={<StudentProfile />} />
                <Route path="/course-details/:courseId" element={<CourseDetails />} />
                <Route path="/study/:courseId" element={<Study />} />

                <Route path="/student-dashboard/my-courses/" element={<MyCourses />} />
                <Route path="/teacher-dashboard/courses" element={<TeacherCourses />} />
                <Route path="/teacher-dashboard/search" element={<StudentsTeachersSearch />} />
                <Route path="/teacher-dashboard/update-topic" element={<TopicUpdate />} />
                
              </Routes>
          </div>
          
          <Footer theme={theme} />
        </AuthProvider>
      </BrowserRouter>
    );
}

export default App;
