import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card,Carousel } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { Link } from 'react-router-dom';

const MyCourses = () => {
  const { isLoggedIn, userId, authToken,username } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        if (isLoggedIn && userId) {
            
          const response = await axios.get(`http://3.108.151.50/enrolled/?user_id=${userId}`, {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          });
          setEnrolledCourses(response.data);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching enrolled courses:', error);
        setIsLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, [isLoggedIn, userId, authToken]);

  if (isLoading) {
    // You can render a loading spinner or message here
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <Container className="my-5">
        
        {/* Slider */}
            <Carousel>
                <Carousel.Item>
                <img
                    className="d-block w-100"
                    src="http://3.108.151.50/media/mycourses.jpeg"
                    alt="First slide"
                />
                <Carousel.Caption>
                    <h2>My Enrolled Courses</h2>
                </Carousel.Caption>
                </Carousel.Item>
                {/* Add more Carousel.Items as needed */}
            </Carousel>
            <div className='mb-3'></div>
        <Row>
          {enrolledCourses.map(encourse => (
            <Col key={encourse.id} md={4}>
              <Card className="mb-4">
                  <Card.Img variant="top" src={encourse.image} alt="Course Image" />
                  <Card.Body>
                    <Card.Title>{encourse.title}</Card.Title>
                    <Card.Text>{encourse.description}</Card.Text>
                    {/* You can add more information if needed */}
                    <Link to={`/study/${encourse.course}`} className="btn btn-primary">
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

export default MyCourses;