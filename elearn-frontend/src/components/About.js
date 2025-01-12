import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const About = () => {
  return (
    <Container className="mt-5">
      <Row>
        <Col md={6}>
          <h2>About Us</h2>
          <p>
          Welcome to our eLearning platform, where knowledge meets innovation! At our core, we are a dynamic startup committed to breaking barriers in education, ensuring that aspiring students can seamlessly pursue their dreams even amidst the hustle of life. Recognizing the challenges faced by many young and ambitious individuals who find themselves juggling work and family responsibilities, our platform stands as a beacon of opportunity.
          </p>
          <p>
          Our eLearning site is designed to empower these dedicated individuals by offering courses led by efficient and experienced teachers. We believe that learning should not be confined to traditional classrooms, and that's why we've curated a diverse range of courses tailored to cater to the needs of those striving for success in their careers. What sets us apart is our unwavering commitment to maintaining 100% transparency in all our offerings. We understand the importance of trust and accountability in the learning journey, and we take pride in fostering an environment where students can learn with confidence.
          </p>
          <p>
          Our initiative is not just about education; it's about fostering a community of learners who are ambitious, dynamic, and determined to make a mark in their respective fields. We recognize the struggles of those who strive to balance work, family, and education, and we stand as a supportive partner in their journey. Join us in this transformative learning experience, where knowledge knows no bounds, and aspirations are nurtured to flourish. Together, let's build a future where education is accessible to all, no matter the constraints life presents.
          </p>
        </Col>
        <Col md={6}>
          <img
            src="http://localhost:8000/media/about.jpeg"
            alt="About Us"
            className="img-fluid rounded"
          />
        </Col>
      </Row>
    </Container>
  );
};

export default About;