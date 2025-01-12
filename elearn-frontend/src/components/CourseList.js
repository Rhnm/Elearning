import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Carousel } from 'react-bootstrap';
import axios from 'axios';
import {Link} from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const CourseList = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  const { isLoggedIn, userRole, userId, authToken } = useAuth();
  

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      // Wait for the authentication data to be available
      while (!isLoggedIn || userRole === null) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Once authentication data is available, check for the correct role
      if (!isLoggedIn ) {
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
      // Check if the user is logged in and has the correct role
     
        // If not, navigate to the login page
         // If authenticated, fetch the courses
      axios.get('http://3.108.151.50/api/courses/')
      .then(response => {
        setCourses(response.data);
        setIsLoading(false); // Set loading to false when data is fetched
      })
      .catch(error => {
        console.error(error);
        setIsLoading(false); // Set loading to false in case of an error
      });
        
      
    }, []);
    
    
  console.log(courses);
  return (
    <div className="App"> 
    <Container className="my-5">
    <Carousel>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="http://3.108.151.50/media/courseslist.jpeg"
            alt="First slide"
          />
          {/* <Carousel.Caption>
            <h3>Welcome</h3>
            <p>To My Elearn Website.</p>
          </Carousel.Caption> */}
        </Carousel.Item>
        {/* Add more Carousel.Items as needed */}
      </Carousel>
      <div className='mb-3'></div>
      <Row>
        {/* Slider */}
      
        {courses.map(course => (
          <Col key={course.id} md={4}>
            <Card className="mb-4">
              <Card.Img variant="top" src={`http://3.108.151.50${course.image}`} alt="Course Image" />
              <Card.Body>
                <Card.Title>{course.title}</Card.Title>
                <Card.Text>{course.description}</Card.Text>
                
                {/* Link to the CourseDetails page with the course.id as a parameter */}
                <Link to={`/course-details/${course.id}`} className="btn btn-primary">
                    View Details
                </Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
    </div>
  );
};

export default CourseList;
