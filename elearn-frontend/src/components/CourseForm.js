// CourseForm.js
import React,{useState} from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import TeacherLeftPanel from './TeacherLeftPanel';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const CourseForm = () => {
  const navigate = useNavigate();
  const { isLoggedIn, userRole, userId, authToken,username } = useAuth();
  const [successMessage, setSuccessMessage] = useState(""); // State for success message
  const formik = useFormik({
    initialValues: {
      courseName: '',
      title: '',
      image: null, // Change the type to 'File'
      description: '',
    },
    validationSchema: Yup.object({
      courseName: Yup.string().required('Course Name is required'),
      title: Yup.string().required('Title is required'),
      image: Yup.mixed().required('Image is required'), // Change the validation for file
      description: Yup.string().required('Description is required'),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        // Create a FormData object to handle file uploads
        const formData = new FormData();
        formData.append('course_name', values.courseName);
        formData.append('title', values.title);
        formData.append('image', values.image);
        formData.append('description', values.description);
        formData.append('user',userId);

        // Include the CSRF token
        formData.append('csrfmiddlewaretoken', '{{ csrf_token }}');


        // Submit data to Django backend using Axios
        const response = await axios.post('http://3.108.151.50/addCourses/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        if(response.data){
          setSuccessMessage("Form Submitted Successfully");
          // Reset the form after successful submission
          resetForm();
          formik.setFieldValue('image', null);
          //navigate('/teacher-dashboard/create-course');
        }
        console.log('Data submitted successfully:', response.data);
      } catch (error) {
        setSuccessMessage("Form Submission Failed!");
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
          <h2>Course Form</h2>
            <div id="form-message-success" className={`mb-4 ${successMessage === "Form Submitted Successfully" ? "text-success" : "text-danger"}`}>
              {successMessage}
            </div>
            <Form onSubmit={formik.handleSubmit}>
              <Form.Group controlId="courseName">
                <Form.Label>Course Name:</Form.Label>
                <Form.Control
                  type="text"
                  {...formik.getFieldProps('courseName')}
                />
                {formik.touched.courseName && formik.errors.courseName && (
                  <Form.Text className="text-danger">{formik.errors.courseName}</Form.Text>
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

              <Form.Group controlId="image">
                <Form.Label>Image:</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={(event) => formik.setFieldValue('image', event.currentTarget.files[0])}
                />
                {formik.touched.image && formik.errors.image && (
                  <Form.Text className="text-danger">{formik.errors.image}</Form.Text>
                )}
              </Form.Group>

              <Form.Group controlId="description">
                <Form.Label>Description:</Form.Label>
                <Form.Control
                  as="textarea"
                  {...formik.getFieldProps('description')}
                />
                {formik.touched.description && formik.errors.description && (
                  <Form.Text className="text-danger">{formik.errors.description}</Form.Text>
                )}
              </Form.Group>

              <Button type="submit">Submit</Button>
            </Form>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default CourseForm;
