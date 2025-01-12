// RegisterTeacher.js

import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import AdminLeftPanel from './AdminLeftPanel';

const getCsrfToken = async () => {
    const response = await axios.get('http://3.108.151.50/get-csrf-token/');
    return response.data.csrfToken;
  };

const RegisterTeacher = () => {
    

  const formik = useFormik({
    initialValues: {
      name: '',
      username: '',
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      username: Yup.string().required('Username is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string().required('Password is required'),
    }),
    onSubmit: async (values) => {
        const currentDate = new Date().toISOString();
        const requestData = {
        last_login: currentDate,
        name: values.name,
        username: values.username,
        email: values.email,
        password: values.password,
        role: 1,
        }
      try {
        const csrfToken = await getCsrfToken();
        const response = await axios.post('http://3.108.151.50/api/registerteacher/', requestData,
        {
            headers: {
                'X-CSRFToken': csrfToken,
              },
        });
        console.log(response.data); // Handle success or redirect as needed
      } catch (error) {
        console.error('Error registering teacher:', error);
        // Handle error, show a message, etc.
      }
    },
  });

  return (
    <div className="App">
        <div className="container-fluid">
            <div className="row">
            {/* Sidebar */}
                <div className="col-3" style={{ border: '1px solid #ccc',padding:'2%' }}>
                        <AdminLeftPanel />
                </div>
                <div className="col-9">
                    <div className="container mt-5">
                    <h2>Create Teacher</h2>
                        <form onSubmit={formik.handleSubmit}>
                        <label htmlFor="name">Name:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.name}
                        />
                        {formik.touched.name && formik.errors.name && <div>{formik.errors.name}</div>}

                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.username}
                        />
                        {formik.touched.username && formik.errors.username && <div>{formik.errors.username}</div>}

                        <label htmlFor="email">Email:</label>
                        <input
                            type="text"
                            id="email"
                            name="email"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.email}
                        />
                        {formik.touched.email && formik.errors.email && <div>{formik.errors.email}</div>}

                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.password}
                        />
                        {formik.touched.password && formik.errors.password && <div>{formik.errors.password}</div>}

                        <button type="submit">Register Teacher</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default RegisterTeacher;
