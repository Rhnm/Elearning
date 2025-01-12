// MyProfile.js

import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import axios from "axios";
import TeacherLeftPanel from "./TeacherLeftPanel";
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const TeacherProfile = () => {
  const [successMessage, setSuccessMessage] = useState(""); // State for success message
    const auth = useAuth();
  const [profileData, setProfileData] = useState({
    status: "",
    info: "",
    image: null,
  });

  const [imageFile, setImageFile] = useState(null);

  const { isLoggedIn, userRole, userId, authToken } = useAuth();
    
    const navigate = useNavigate();
  
    useEffect(() => {
      // Check if the user is logged in and has the correct role
      if (!isLoggedIn || userRole !== 1) {
        // If not, navigate to the login page
        navigate('/login');
      }
    }, [isLoggedIn, userRole, navigate]);

  useEffect(() => {
    // Fetch teacher profile data when component mounts
    
    axios.get(`http://3.108.151.50/api/teacher-profile/?user_id=${auth.userId}`)
      .then((response) => {
        setProfileData(response.data);
        
        
      })
      .catch((error) => {
        
        console.error("Error fetching teacher profile:", error);
      });
  }, []);

  const handleInputChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);

    // You may want to preview the selected image
    // For simplicity, let's just log the file name
    console.log("Selected Image:", file.name);
  };

  const handleUpdateProfile = () => {
    const formData = new FormData();
    formData.append('status', profileData.status);
    formData.append('info', profileData.info);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    axios.put(`http://3.108.151.50/api/teacher-profile/?user_id=${auth.userId}`, formData)
      .then((response) => {
        // Handle success, e.g., show a success message
        setSuccessMessage("Data Update Successfully");
        console.log("Profile updated successfully:", response.data);
      })
      .catch((error) => {
        // Handle error, e.g., show an error message
        setSuccessMessage("Data Update Failed");
        console.error("Error updating teacher profile:", error);
      });
  };

  return (
    <div className="App">
      <div className="jumbotron">
        <Row>
          <Col md={3}>
            <TeacherLeftPanel />
          </Col>
          <Col md={9}>
            <h2>My Profile</h2>
            <div id="form-message-success" className={`mb-4 ${successMessage === "Data Update Successfully" ? "text-success" : "text-danger"}`}>
            {successMessage}
            </div>
            <Form>
            {profileData.image && (
                  <img
                    src={`http://3.108.151.50${profileData.image}`}
                    alt="Profile"
                    style={{ width: '100px', height: '100px', borderRadius: '50%', marginTop: '10px' }}
                  />
                )}
            <Form.Group className="mb-3" controlId="image">
                <Form.Label>Image:</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                
              </Form.Group>
              <Form.Group className="mb-3" controlId="status">
                <Form.Label>Status:</Form.Label>
                <Form.Control
                  type="text"
                  name="status"
                  value={profileData.status}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="info">
                <Form.Label>Info:</Form.Label>
                <Form.Control
                  as="textarea"
                  name="info"
                  value={profileData.info}
                  onChange={handleInputChange}
                />
              </Form.Group>
              
              <Button variant="primary" onClick={handleUpdateProfile}>
                Update Profile
              </Button>
            </Form>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default TeacherProfile;
