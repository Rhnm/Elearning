import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import axios from 'axios';
import Cookies from 'js-cookie';

import { useAuth } from './AuthContext';

const CourseDetails = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const { isLoggedIn, userId, authToken } = useAuth();
  const [successMessage, setSuccessMessage] = useState(""); // State for success message
  const getCsrfToken = async () => {
    const response = await axios.get('http://3.108.151.50/get-csrf-token/');
    return response.data.csrfToken;
  };
  
  useEffect(() => {
    
    // Fetch course details using the course ID from the URL
    axios.get(`http://3.108.151.50/api/courses/${courseId}/`)
      .then(response => {
        setCourse(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, [courseId]);

  if (!course) {
    return <div>Loading...</div>;
  }

  const handleEnroll = async () => {
    
    // Enroll the user in the course
    if (isLoggedIn && userId && courseId) {
        
        //const csrfToken =  await getCsrfToken();
        try {
            const csrfToken = await getCsrfToken();
            
            const csrfToken_js = Cookies.get('csrftoken');
            console.log("Here is the token: ", csrfToken);
            axios.defaults.headers.common['X-CSRFToken'] = csrfToken_js;
            // Your API endpoint for changing the password
            axios.defaults.withCredentials = true;
            const response = await axios.post('http://3.108.151.50/enroll/', {
            user: userId,
            course: courseId},
            {   withCredentials:true,
                
            });
            setSuccessMessage("Enrollment Successful");
            console.log(response.data); // Handle success or redirect as needed

          } catch (error) {
            if(error.response.data.error === "User is already enrolled in this course."){
                setSuccessMessage("User is already enrolled in this course.")
            }else{
                setSuccessMessage("Enrollment Failed");
            }
            
            console.error('Error registering teacher:', error);
            // Handle error, show a message, etc.
          }

          /* const csrfToken = await getCsrfToken();
            
            const csrfToken_js = Cookies.get('csrftoken');
            console.log("Here is the token: ", csrfToken);
            axios.defaults.headers.common['X-CSRFToken'] = csrfToken_js;
            // Your API endpoint for changing the password
            axios.defaults.withCredentials = true; */
      /* axios.post('http://localhost:8000/enroll/', {
        user_id: userId,
        course_id: courseId,
      }
      )
      .then(response => {
        setSuccessMessage("Enrollment Successful");
        console.log('Enrollment successful:', response.data);
        // You can handle success, e.g., show a success message
      })
      .catch(error => {
        setSuccessMessage("Enrollment Failed");
        console.error('Error enrolling:', error);
        // Handle error, e.g., show an error message
      }); */
    }
  };

  return (
    <div className="App jumbotron">
        <div id="form-message-success" className={`mb-4 ${successMessage === "Enrollment Successful" ? "text-success" : "text-danger"}`}>
            {successMessage}
          </div>
      <Container className="my-5">
        <Row>
          <Col md={6}>
            <Card>
              <Card.Img variant="top" src={course.image} alt="Course Image" />
              <Card.Body>
                <Card.Title>{course.title}</Card.Title>
                <Card.Text>{course.description}</Card.Text>
                {/* You can display more details if needed */}
                {isLoggedIn && (
                  <Button variant="primary" onClick={handleEnroll}>Enroll</Button>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CourseDetails;
