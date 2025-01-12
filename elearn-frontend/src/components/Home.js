// Home.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Carousel, Card, Button } from 'react-bootstrap';

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    // Fetch courses
    axios.get('http://3.108.151.50/api/courses/')
      .then(response => {
        setCourses(response.data);
      })
      .catch(error => {
        console.error('Error fetching courses:', error);
      });

    // Fetch teachers
    axios.get('http://3.108.151.50/api/users/')
      .then(response => {
        setTeachers(response.data);
      })
      .catch(error => {
        console.error('Error fetching teachers:', error);
      });
  }, []);

  return (
    <div className='App jumbotron'>
      {/* Slider */}
      <Carousel>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="http://3.108.151.50/media/elearning_slider.jpeg"
            alt="First slide"
          />
          <Carousel.Caption>
            <h3>Welcome</h3>
            <p>To My Elearn Website.</p>
          </Carousel.Caption>
        </Carousel.Item>
        {/* Add more Carousel.Items as needed */}
      </Carousel>

      {/* Bootstrap Cards for Courses */}
      <div className="container mt-4">
        <h2>Courses</h2>
        <div className="row">
          {courses.map(course => (
            <div key={course.id} className="col-md-4">
              <Card className="text-center" style={{alignItems:"center"}} >
                <Card.Img variant="top" src={`http://3.108.151.50${course.image}`} style={{ width: "100px", height: "100px", borderRadius: "50%", marginTop: "10px" }} />
                <Card.Body>
                  <Card.Title>{course.course_name}</Card.Title>
                  <Card.Text>
                    {course.description}
                  </Card.Text>
                  <Button variant="primary">Learn More</Button>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Bootstrap Cards for Teachers */}
      <div className="container mt-4">
        <h2>Teachers</h2>
        <div className="row">
          {teachers.map(teacher => (
            <div key={teacher.id} className="col-md-4">
              <Card className="text-center" style={{alignItems:'center'}}>
                {/* You may need to adjust these based on your teacher model */}
                <Card.Img className="text-center" variant="top" src={teacher.image} style={{ width: "100px", height: "100px", borderRadius: "50%", marginTop: "10px" }}/>
                <Card.Body>
                  <Card.Title>{teacher.name}</Card.Title>
                  <Card.Text>
                    {teacher.email}
                  </Card.Text>
                  <Button variant="primary">View Profile</Button>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
