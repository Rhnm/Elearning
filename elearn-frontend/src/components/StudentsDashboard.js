// StudentsDashboard.js
import React, { useState,useEffect } from "react";
import StudentsLeftPanel from "./StudentsLeftPanel.js";
import { Route, Routes } from "react-router-dom";
import { Card } from 'react-bootstrap';
import StudentProfile from "./StudentProfile.js";
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import MyCourses from "./MyCourses";
import axios from 'axios';

const getCsrfToken = async () => {
  const response = await axios.get('http://3.108.151.50/get-csrf-token/');
  return response.data.csrfToken;
};

const StudentsDashboard = () => {
  const { isLoggedIn, userRole, userId, authToken,username } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [enrolledCoursesCount, setEnrolledCoursesCount] = useState(0);
    const [updateHistory, setUpdateHistory] = useState([]);
    const [successMessage, setSuccessMessage] = useState(""); 
    

  useEffect(() => {
    const checkAuthentication = async () => {
      // Wait for the authentication data to be available
      while (!isLoggedIn || userRole === null) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Once authentication data is available, check for the correct role
      if (!isLoggedIn || userRole !== 2) {
        // If not, navigate to the login page
        navigate('/login');
      } else {
        // If the user has the correct role, set loading to false
        setLoading(false);
        // Fetch the number of enrolled courses
        fetchEnrolledCoursesCount();
        fetchUpdateHistory();
      }
    };

    checkAuthentication();
  }, [isLoggedIn, userRole, navigate]);

  const fetchEnrolledCoursesCount = async () => {
    try {
      const response = await axios.get(`http://3.108.151.50/enrolled/?user_id=${userId}`, {
        params: {
          course_id: null,  // You might need to adjust this based on your API
        },
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      // Update the enrolledCoursesCount state with the count from the response
      setEnrolledCoursesCount(response.data.length);
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
    }
  };

  const fetchUpdateHistory = async () => {
    try {
      const response = await axios.get(`http://3.108.151.50/updatehistory/?user_id=${userId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      // Update the enrolledCoursesCount state with the count from the response
      //setUpdateHistory(response.data);
      
      // Fetch additional data for each history entry
    const historyPromises = response.data.map(async (history) => {
      const usernameResponse = await axios.get(`http://3.108.151.50/get-username/?user_id=${history.user}`);
      const coursenameResponse = await axios.get(`http://3.108.151.50/get-course/?course_id=${history.course}`);
      const topicnameResponse = await axios.get(`http://3.108.151.50/api/topic_get/?topic_id=${history.topic}`);

      return {
        ...history,
        username: usernameResponse.data.username,
        coursename: coursenameResponse.data.title,
        topicname: topicnameResponse.data.title,
      };
    });

    const updatedUpdateHistory = await Promise.all(historyPromises);

    // Update the state with additional data
    setUpdateHistory(updatedUpdateHistory);




    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
    }
  };
  const markHistoryAsInactive = async (historyId) => {
    try {
      // Make an Axios request to update the status to "inactive"
      const csrfToken = await getCsrfToken();
      await axios.put(`http://3.108.151.50/updatehistory/?history_id=${historyId}`, {
        headers: {
          'X-CSRFToken': csrfToken,
        },
      });

      // Update the local state to reflect the change
      const updatedHistory = updateHistory.map(history => {
        if (history.id === historyId) {
          return { ...history, status: "inactive" };
        }
        return history;
      });
      setSuccessMessage("Status Updated Successfully");
      setUpdateHistory(updatedHistory);
      navigate("/student-dashboard");
    } catch (error) {
      setSuccessMessage("Status Update Failed!");
      console.error('Error marking history as inactive:', error);
    }
  };


  
  return (
    <div className="App">
      <div className="jumbotron">
    <div className="container-fluid">
      <div className="row">
        <div className="col-3">
          <StudentsLeftPanel />
        </div>
        <div className="col-9">
        <div id="form-message-success" className={`mb-4 ${successMessage === "Status Updated Successfully" ? "text-success" : "text-danger"}`}>
            {successMessage}
          </div>
          <div className="mb-3"></div>
          {/* Bootstrap Card */}
          <Card className="bg-success text-white">
                <Card.Body>
                  <Card.Title>Welcome, {username}!</Card.Title>
                  <Card.Text>
                    You have enrolled in {enrolledCoursesCount} courses.
                  </Card.Text>
                </Card.Body>
              </Card>

              {/* Display update history */}
            {updateHistory.map((history) => (
              <div key={history.id} className="alert alert-primary alert-dismissible" role="alert">
                Topic {history.topicname} of Course {history.coursename} was updated by Teacher: {history.username}
                {history.status !== 'inactive' && (
                <button type="button" class="close" data-dismiss="alert" aria-label="Close" onClick={() => markHistoryAsInactive(history.id)}>
                  <span aria-hidden="true">&times;</span>
                </button>
                )}
              </div>
            ))}

          <Routes>
            <Route path="/student-dashboard/student-profile/" element={<StudentProfile />} />
            <Route path="/student-dashboard/my-courses/" element={<MyCourses />} />
            {/* Add more routes as needed */}
          </Routes>
        </div>
      </div>
    </div>
    </div>
    </div>
  );
};

export default StudentsDashboard;
