import { useAuth } from './AuthContext';
import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import TeacherLeftPanel from "./TeacherLeftPanel";
import MyProfile from "./TeacherProfile";
import CourseForm from "./CourseForm";
import TopicsForm from "./TopicsForm";
import TestForm from "./TestForm";
import TeacherCourses from './TeacherCourses';
import StudentsTeachersSearch from './StudentsTeachersSearch';
import TopicUpdate from './TopicUpdate';

import { useNavigate } from 'react-router-dom';


const TeacherDashboard = () => {
    const auth = useAuth();
    const { isLoggedIn, userRole, userId, authToken } = useAuth();
    
    const navigate = useNavigate();
  
    useEffect(() => {
      // Check if the user is logged in and has the correct role
      if (!isLoggedIn || userRole !== 1) {
        // If not, navigate to the login page
        navigate('/login');
      }
    }, [isLoggedIn, userRole, navigate]);
  return (
    <div className="App">
      <div className='jumbotron'>
        <div className="container-fluid">
            <div className="row">
                <div className="col-3">
                <TeacherLeftPanel />
                </div>
                <div className="col-9">
                {/* Main Content */}
                <Routes>
                    <Route path="/teacher-dashboard/profile" element={<MyProfile />} />
                    <Route path="/teacher-dashboard/create-course" element={<CourseForm />} />
                    <Route path="/teacher-dashboard/create-topic" element={<TopicsForm />} />
                    <Route path="/teacher-dashboard/create-test" element={<TestForm />} />
                    <Route path="/teacher-dashboard/courses" element={<TeacherCourses />} />
                    <Route path="/teacher-dashboard/search" element={<StudentsTeachersSearch />} />
                    <Route path="/teacher-dashboard/update-topic" element={<TopicUpdate />} />
                </Routes>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
