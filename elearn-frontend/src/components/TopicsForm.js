import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import TeacherLeftPanel from './TeacherLeftPanel';
import { useAuth } from './AuthContext';

const TopicsForm = () => {
  const [courses, setCourses] = useState([]);  // Assuming you have a state to store courses
  const [successMessage, setSuccessMessage] = useState(""); // State for success message
  const { userId, authToken } = useAuth();  // Use the useAuth hook
  useEffect(() => {
    // Fetch courses from your backend and set them in the state
    
    axios.get(`http://3.108.151.50/coursesfetch/?user_id=${userId}`)  // Adjust the URL based on your API endpoint
      .then(response => setCourses(response.data))
      
      .catch(error => console.error('Error fetching courses:', error));
  }, []);  // Fetch courses only once when the component mounts
  const formik = useFormik({
    initialValues: {
      courseName: '',
      topicType: '',
      title: '',
      subtitle: '',
      textContent: '',
      file: null,
    },
    validationSchema: Yup.object({
      courseName: Yup.string().required('Course Name is required'),
      topicType: Yup.string().required('Topic Type is required'),
      title: Yup.string().required('Title is required'),
      subtitle: Yup.string().required('Subtitle is required'),
      textContent: Yup.string().required('Text Content is required'),
      /* file: Yup.mixed().when('topicType', {
        is: (topicType) => topicType === 'Reading',
        then: Yup.mixed().required('File is required for Reading'),
        otherwise: Yup.mixed().notRequired(),
      }).when('topicType', {
        is: (topicType) => topicType === 'Test',
        then: Yup.mixed().notRequired(), // Add specific requirements for Test if needed
      }).when('topicType', {
        is: (topicType) => topicType === 'Video',
        then: Yup.mixed().required('Video file is required'),
        otherwise: Yup.mixed().notRequired(),
      }).when('topicType', {
        is: (topicType) => topicType === 'Audio',
        then: Yup.mixed().required('Audio file is required'),
        otherwise: Yup.mixed().notRequired(),
      }), */
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        // Find the course ID based on the selected course name
        const selectedCourse = courses.find(course => course.course_name === values.courseName);
        const course_id = selectedCourse ? selectedCourse.id : null;
        // Create a FormData object to handle file uploads
        const formData = new FormData();
        formData.append('course', course_id);
        formData.append('topic_type', values.topicType);
        formData.append('title', values.title);
        formData.append('subtitle', values.subtitle);
        formData.append('text_content', values.textContent);
        formData.append('file', values.file);
        console.log(formData);
        // Include the CSRF token if needed
        // formData.append('csrfmiddlewaretoken', '{{ csrf_token }}');

        // Submit data to Django backend using Axios
        const response = await axios.post('http://3.108.151.50/addTopics/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setSuccessMessage("Form Submitted Successfully");
        resetForm();

        console.log('Data submitted successfully:', response.data);
      } catch (error) {
        setSuccessMessage("Form Submission Failed");
        console.error('Error submitting data:', error);
      }
    },
  });

  return (
    <div className='App'>
      <div className='jumbotron'>
        <Row>
          <Col md={3}>
            <TeacherLeftPanel />
          </Col>

          <Col md={9}>
          <h2>Topic Form</h2>
            <div id="form-message-success" className={`mb-4 ${successMessage === "Form Submitted Successfully" ? "text-success" : "text-danger"}`}>
              {successMessage}
            </div>
            <Form onSubmit={formik.handleSubmit}>
              <Form.Group controlId="courseName">
                <Form.Label>Course Name:</Form.Label>
                <Form.Control
                  as="select"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.courseName}
                >
                  <option value="" label="Select a course" />
                  {courses.map(course => (
                    <option key={course.id} value={course.course_name}>{course.course_name}</option>
                  ))}
                </Form.Control>
                {formik.touched.courseName && formik.errors.courseName && (
                  <Form.Text className="text-danger">{formik.errors.courseName}</Form.Text>
                )}
              </Form.Group>

              <Form.Group controlId="topicType">
                <Form.Label>Topic Type:</Form.Label>
                <Form.Control
                  as="select"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.topicType}
                >
                  <option value="" label="Select a topic type" />
                  <option value="Reading" label="Reading" />
                  <option value="Test" label="Test" />
                  <option value="Video" label="Video" />
                  <option value="Audio" label="Audio" />
                </Form.Control>
                {formik.touched.topicType && formik.errors.topicType && (
                  <Form.Text className="text-danger">{formik.errors.topicType}</Form.Text>
                )}
              </Form.Group>

              <Form.Group controlId="title">
                <Form.Label>Title:</Form.Label>
                <Form.Control
                  type="text"
                  {...formik.getFieldProps('title')}
                />
                {formik.touched.title && formik.errors.title && (
                  <Form.Text className="text-danger">{formik.errors.title}</Form.Text>
                )}
              </Form.Group>

              <Form.Group controlId="subtitle">
                <Form.Label>Subtitle:</Form.Label>
                <Form.Control
                  type="text"
                  {...formik.getFieldProps('subtitle')}
                />
                {formik.touched.subtitle && formik.errors.subtitle && (
                  <Form.Text className="text-danger">{formik.errors.subtitle}</Form.Text>
                )}
              </Form.Group>

              <Form.Group controlId="textContent">
                <Form.Label>Text Content:</Form.Label>
                <Form.Control
                  as="textarea"
                  {...formik.getFieldProps('textContent')}
                />
                {formik.touched.textContent && formik.errors.textContent && (
                  <Form.Text className="text-danger">{formik.errors.textContent}</Form.Text>
                )}
              </Form.Group>

              {formik.values.topicType !== '' && (
                <Form.Group controlId="file">
                  <Form.Label>File:</Form.Label>
                  <Form.Control
                    type="file"
                    accept={formik.values.topicType === 'Video' ? 'video/*' : (formik.values.topicType === 'Audio' ? 'audio/*' : 'image/*')}
                    onChange={(event) => formik.setFieldValue('file', event.currentTarget.files[0])}
                  />
                  {formik.touched.file && formik.errors.file && (
                    <Form.Text className="text-danger">{formik.errors.file}</Form.Text>
                  )}
                </Form.Group>
              )}

              <Button type="submit">Submit</Button>
            </Form>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default TopicsForm;
