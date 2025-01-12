// TestForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import TeacherLeftPanel from './TeacherLeftPanel';
import { useNavigate } from "react-router-dom"; // Import useHistory hook


const TestForm = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [courses, setCourses] = useState([]);
  const [topics, setTopics] = useState([]);
  const [successMessage, setSuccessMessage] = useState(""); 
  const [formData, setFormData] = useState({
    courseId: '',
    topicId: '',
    questions: [{ question: '', option_a: '', option_b: '', option_c: '', option_d: '', answer: '' }],
  });

  useEffect(() => {
    // Fetch courses from your backend
    axios.get('http://3.108.151.50/api/courses/')  // Adjust the URL based on your API endpoint
      .then(response => setCourses(response.data))
      .catch(error => console.error('Error fetching courses:', error));
  }, []);

  const fetchTopics = (courseId) => {
    // Fetch topics based on the selected course from your backend
    axios.get(`http://3.108.151.50/api/topics/?course_id=${courseId}`)
      .then(response => setTopics(response.data))
      .catch(error => console.error('Error fetching topics:', error));
  };

  const handleCourseChange = (e) => {
    const courseId = e.target.value;
    setFormData({
      ...formData,
      courseId,
      topicId: '',  // Reset topicId when course changes
    });
    fetchTopics(courseId);
  };

  const handleTopicChange = (e) => {
    setFormData({
      ...formData,
      topicId: e.target.value,
    });
  };

  const handleQuestionChange = (index, fieldName, value) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[index][fieldName] = value;
    setFormData({
      ...formData,
      questions: updatedQuestions,
    });
  };

  const handleOptionChange = (index, optionType, value) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[index][`option_${optionType}`] = value;
    setFormData({
      ...formData,
      questions: updatedQuestions,
    });
  };

  const handleAnswerChange = (index, value) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[index].answer = value;
    setFormData({
      ...formData,
      questions: updatedQuestions,
    });
  };

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [...formData.questions, { question: '', option_a: '', option_b: '', option_c: '', option_d: '', answer: '' }],
    });
  };

  const handleSubmit = () => {

    const transformedData = {
        questions: formData.questions.map((question, index) => ({
          course: formData.courseId,
          topic: formData.topicId,
          question: question.question,
          option_a: question.option_a,
          option_b: question.option_b,
          option_c: question.option_c,
          option_d: question.option_d,
          answer: question.answer,
          
        })),
      };


    console.log(transformedData);
try{
  axios.post('http://3.108.151.50/api/tests/', transformedData)
      .then(response => {
        setSuccessMessage("Question Submitted successfully!");
        console.log('Data submitted successfully:', response.data);
        // You can handle success, e.g., redirect to a success page
        navigate("/teacher-dashboard/create-test");
      })
   
      .catch(error => console.error('Error submitting data:', error));

}catch(error){
  setSuccessMessage("Question Submission Failed");
        console.error('Error submitting data:', error);
}
    // Submit data to Django backend using Axios
    
  };

  return (
    <div className="App jumbotron">
      <Container>
        <Row>
          <Col md={3}>
            <TeacherLeftPanel />
          </Col>
          <Col md={9}>
            <h2>Test Form</h2>
            <div id="form-message-success" className={`mb-4 ${successMessage === "Question Submitted successfully!" ? "text-success" : "text-danger"}`}>
              {successMessage}
            </div>
            <Form>
              <Form.Group controlId="course">
                <Form.Label>Select Course:</Form.Label>
                <Form.Control as="select" onChange={handleCourseChange} value={formData.courseId}>
                  <option value="" label="Select a course" />
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>{course.course_name}</option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="topic">
                <Form.Label>Select Topic:</Form.Label>
                <Form.Control as="select" onChange={handleTopicChange} value={formData.topicId}>
                  <option value="" label="Select a topic" />
                  {topics.map(topic => (
                    <option key={topic.id} value={topic.id}>{topic.title}</option>
                  ))}
                </Form.Control>
              </Form.Group>

              <div>
                {formData.questions.map((question, index) => (
                  <div key={index}>
                    <Form.Label htmlFor={`question-${index}`}>Question {index + 1}:</Form.Label>
                    <Form.Control
                      type="text"
                      id={`question-${index}`}
                      value={question.question}
                      onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                    />
                    <Form.Label>Option A:</Form.Label>
                    <Form.Control
                      type="text"
                      value={question.option_a}
                      onChange={(e) => handleOptionChange(index, 'a', e.target.value)}
                    />
                    <Form.Label>Option B:</Form.Label>
                    <Form.Control
                      type="text"
                      value={question.option_b}
                      onChange={(e) => handleOptionChange(index, 'b', e.target.value)}
                    />
                    <Form.Label>Option C:</Form.Label>
                    <Form.Control
                      type="text"
                      value={question.option_c}
                      onChange={(e) => handleOptionChange(index, 'c', e.target.value)}
                    />
                    <Form.Label>Option D:</Form.Label>
                    <Form.Control
                      type="text"
                      value={question.option_d}
                      onChange={(e) => handleOptionChange(index, 'd', e.target.value)}
                    />
                    <Form.Label htmlFor={`answer-${index}`}>Answer:</Form.Label>
                    <Form.Control
                      type="text"
                      id={`answer-${index}`}
                      value={question.answer}
                      onChange={(e) => handleAnswerChange(index, e.target.value)}
                    />
                  </div>
                ))}
              </div>

              <Button type="button" onClick={addQuestion}>Add Question</Button>
              <Button type="button" onClick={handleSubmit}>Submit</Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default TestForm;
