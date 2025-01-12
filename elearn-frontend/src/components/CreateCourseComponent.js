// CreateCourseComponent.jsx
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  image: Yup.mixed().required('Image is required'),
  description: Yup.string().required('Description is required'),
});

const CreateCourseComponent = () => {
  const initialValues = {
    name: '',
    image: null,
    description: '',
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('image', values.image);
    formData.append('description', values.description);

    try {
      await axios.post('http://3.108.151.50/courses/', formData);
      console.log('Course created successfully!');
      resetForm();
    } catch (error) {
      console.error('Error creating course:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
      <Form>
        <div>
          <label>
            Name:
            <Field type="text" name="name" />
            <ErrorMessage name="name" component="div" className="error" />
          </label>
        </div>
        <div>
          <label>
            Image:
            <Field type="file" name="image" />
            <ErrorMessage name="image" component="div" className="error" />
          </label>
        </div>
        <div>
          <label>
            Description:
            <Field as="textarea" name="description" />
            <ErrorMessage name="description" component="div" className="error" />
          </label>
        </div>
        <div>
          <button type="submit">Create Course</button>
        </div>
      </Form>
    </Formik>
  );
};

export default CreateCourseComponent;
