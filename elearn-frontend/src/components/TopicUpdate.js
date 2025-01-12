// TopicUpdate.js
import React, { useState, useEffect, useField } from 'react';
import { Formik, useFormik, Field} from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Form, FormControl, FormGroup, FormLabel, Button, Row, Col } from 'react-bootstrap';
import TeacherLeftPanel from './TeacherLeftPanel';
import { useAuth } from './AuthContext';
import Cookies from 'js-cookie';

const getCsrfToken = async () => {
    const response = await axios.get('http://3.108.151.50/get-csrf-token/');
    return response.data.csrfToken;
  };

const TopicUpdate = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [topics, setTopics] = useState([]);
  const [topic, setTopic] = useState([]);
  const { userId } = useAuth();
  const [successMessage, setSuccessMessage] = useState(""); 
  
  useEffect(() => {
    axios.get(`http://3.108.151.50/coursesfetch/?user_id=${userId}`)
      .then(response => setCourses(response.data))
      .catch(error => console.error('Error fetching courses:', error));
  }, [userId]);

  useEffect(() => {
    if (selectedCourse) {
      axios.get(`http://3.108.151.50/api/topics/?course_id=${selectedCourse}`)
        .then(response => setTopics(response.data))
        .catch(error => console.error('Error fetching topics:', error));
    }
  }, [selectedCourse]);

  useEffect(() => {
    if (selectedTopic) {
      axios.get(`http://3.108.151.50/api/topic_get/?topic_id=${selectedTopic}`)
        .then(response => {
            setTopic(response.data);
            formik.setValues({
                topicType: response.data.topic_type,
                title: response.data.title || '',
                subtitle: response.data.subtitle,
                textContent: response.data.text_content,
                file: response.data.file,
              });
        })
        .catch(error => console.error('Error fetching topics:', error));
    }
  }, [selectedTopic]);
  

  const formik = useFormik({
    initialValues: {
        topicType: topic.topic_type,
        title: topic.title,
        subtitle: topic.subtitle,
        textContent: topic.text_content,
        file: topic.file,
      },
    validationSchema: Yup.object({
      title: Yup.string().required('Title is required'),
      subtitle: Yup.string().required('Subtitle is required'),
      textContent: Yup.string().required('Text Content is required'),
      topicType: Yup.string().required('Topic Type is required'),
    }),

    onSubmit: async (values, {resetForm}) => {
      try {
        const csrfToken = await getCsrfToken();
        const csrfToken_js = Cookies.get('csrftoken');
            console.log("Here is the token: ", csrfToken);
            axios.defaults.headers.common['X-CSRFToken'] = csrfToken_js;
            // Your API endpoint for changing the password
            axios.defaults.withCredentials = true;
            

        const formData = new FormData();
          formData.append('course', selectedCourse);
          formData.append('topic_type', values.topicType);
          formData.append('title', values.title);
          formData.append('subtitle', values.subtitle);
          formData.append('text_content', values.textContent);
          formData.append('file', values.file);
          console.log(formData);

        await axios.put(`http://3.108.151.50/update_topic/?course_id=${selectedCourse}&topic_id=${selectedTopic}&user_id=${userId}`, formData);
        console.log("Topic updated successfully");
        setSuccessMessage("Topic updated successfully");
        resetForm();
      } catch (error) {
        setSuccessMessage("Topic update Failed");
        console.error("Error updating Topic: ", error);
      }
    },
  });

  

  return (
    <div className='App jumbotron'>
      <Row>
        <Col md={3}>
          <TeacherLeftPanel />
        </Col>
        <Col md={9}>
          <h2>Update Topic</h2>

          <div id="form-message-success" className={`mb-4 ${successMessage === "Topic updated successfully" ? "text-success" : "text-danger"}`}>
            {successMessage}
          </div>
             
          <div className="form-group">
            <label htmlFor="course">Select a Course</label>
            <select
              className="form-control"
              name="course"
              onChange={(e) => setSelectedCourse(e.target.value)}
              value={selectedCourse}
            >
              <option value="" label="Select a course" />
              {courses.map(course => (
                <option key={course.id} value={course.id}>{course.course_name}</option>
              ))}
            </select>
          </div>

          {selectedCourse && (
            <div className="form-group">
              <label htmlFor="topic_id">Select a Topic</label>
              <select
                className="form-control"
                name="topic_id"
                onChange={(e) => setSelectedTopic(e.target.value)}
                value={selectedTopic}
              >
                <option value="" label="Select a topic" />
                {topics.map(topic => (
                  <option key={topic.id} value={topic.id}>{topic.title}</option>
                ))}
              </select>
            </div>
          )}

        <Formik
            
            initialValues={{
              topicType: topic.topic_type,
              title: topic.title,
              subtitle: topic.subtitle,
              textContent: topic.text_content,
              file: topic.file,
            }}
            validationSchema={formik.validationSchema}
            onSubmit={formik.onSubmit}
        >
          
            <Form onSubmit={formik.handleSubmit} encType="multipart/form-data">

              <FormGroup controlId="topicType">
                <FormLabel>Topic Type:</FormLabel>
                <FormControl
                    as="select"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="topicType"
                    value={topic.topic_type}
                >
                  <option value="" label="Select a topic type" />
                  <option value="Reading" label="Reading" />
                  <option value="Test" label="Test" />
                  <option value="Video" label="Video" />
                  <option value="Audio" label="Audio" />
                </FormControl>
                {formik.touched.topicType && formik.errors.topicType && (
                  <Form.Text className="text-danger">{formik.errors.topicType}</Form.Text>
                )}
              </FormGroup>

              <FormGroup controlId="title">
                <FormLabel>Title:</FormLabel>
                <FormControl
                  type="text"
                  {...formik.getFieldProps('title')}
                />
                {formik.touched.title && formik.errors.title && (
                  <Form.Text className="text-danger">{formik.errors.title}</Form.Text>
                )}
              </FormGroup>

              <FormGroup controlId="subtitle">
                <FormLabel>Subtitle:</FormLabel>
                <FormControl
                  type="text"
                  {...formik.getFieldProps('subtitle')}
                />
                {formik.touched.subtitle && formik.errors.subtitle && (
                  <Form.Text className="text-danger">{formik.errors.subtitle}</Form.Text>
                )}
              </FormGroup>

              <FormGroup controlId="textContent">
                <FormLabel>Text Content:</FormLabel>
                <FormControl
                  as="textarea"
                  {...formik.getFieldProps('textContent')}
                />
                {formik.touched.textContent && formik.errors.textContent && (
                  <Form.Text className="text-danger">{formik.errors.textContent}</Form.Text>
                )}
              </FormGroup>

              

              {topic.topicType !== '' && (
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

              {formik.values.file !== '' && (
                <FormGroup controlId="file">
                  <FormLabel>Current File:</FormLabel>
                  <img src={`http://3.108.151.50${topic.file}`} alt="Topic Image" style={{ width: '250px', height: '250px', borderRadius: '50%', marginTop: '10px' }} />
                </FormGroup>
              )}

              <Button type="submit">Update Topic</Button>
            </Form>
          </Formik>
        </Col>
      </Row>
    </div>
  );
};

export default TopicUpdate;
