import React, { useState, useEffect } from "react";
import axios from "axios";
import StudentsLeftPanel from "./StudentsLeftPanel";
import { useAuth } from './AuthContext';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const StudentProfile = () => {
    const navigate = useNavigate();
    const { isLoggedIn, userRole, userId, authToken } = useAuth();
    const [profileData, setProfileData] = useState({
        status: "",
        info: "",
        image: null,
      });
    
      const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(true);

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
      }
    };
    
    checkAuthentication();
  }, [isLoggedIn, userRole, navigate]);

  
    
    
  

  useEffect(() => {
    
    if(isLoggedIn && userId && authToken && userRole === 2){
    // Fetch teacher profile data when component mounts
    
    axios.get(`http://3.108.151.50/api/student-profile/?user_id=${userId}`)
      .then((response) => {
        setProfileData(response.data);
        
      })
      .catch((error) => {
        console.error("Error fetching teacher profile:", error);
      });
    }
  }, [isLoggedIn, userRole, userId, authToken]);

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
    if(isLoggedIn && userId && authToken && userRole === 2){
    const formData = new FormData();
    formData.append('status', profileData.status);
    formData.append('info', profileData.info);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    axios.put(`http://3.108.151.50/api/student-profile/?user_id=${userId}`, formData)
      .then((response) => {
        // Handle success, e.g., show a success message
        console.log("Profile updated successfully:", response.data);
      })
      .catch((error) => {
        // Handle error, e.g., show an error message
        console.error("Error updating teacher profile:", error);
      });
    }
  };

  return (
    <div className="App jumbotron">
      <Container>
        <Row>
          <Col md={3}>
            <StudentsLeftPanel />
          </Col>
          <Col md={9}>
            <h2>My Profile</h2>

            <Form>
            {profileData.image && (
                  <img
                    src={`http://3.108.151.50${profileData.image}`}
                    alt="Profile"
                    style={{ width: "100px", height: "100px", borderRadius: "50%", marginTop: "10px" }}
                  />
                )}
            <Form.Group controlId="image">
                <Form.Label>Image:</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={handleImageChange}
                />
                
              </Form.Group>
              <Form.Group controlId="status">
                <Form.Label>Status:</Form.Label>
                <Form.Control
                  type="text"
                  name="status"
                  value={profileData.status}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group controlId="info">
                <Form.Label>Info:</Form.Label>
                <Form.Control
                  as="textarea"
                  name="info"
                  value={profileData.info}
                  onChange={handleInputChange}
                />
              </Form.Group>

              

              <Button onClick={handleUpdateProfile}>Update Profile</Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default StudentProfile;
