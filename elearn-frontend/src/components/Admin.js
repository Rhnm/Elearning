import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import { useAuth } from './AuthContext';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const Admin = () => {
  const [loginError, setLoginError] = useState("");
  const auth = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState();//localStorage.getItem('isLoggedIn') === 'true'
  const [userlogged_id, setUserId] = useState();
  const [userlogged_role,setUserRole] = useState();
  const [loginErr, setloginErr] = useState();
  const navigate = useNavigate();
  const initialValues = {
    username: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().min(3).max(50).required("You must input a username"),
    password: Yup.string().required("You must input a password"),
  });

  const login = async (data) => {
    try {
      //const response = axios.post('http://localhost:8000/api/admin-data/', data);
      axios.post("http://3.108.151.50/api/login/", data).then((response)=>{
        if (response.data.isLogin && response.data.role === 0) {
            // Successful login, you can now make additional requests or navigate as needed
            console.log(response.data);
            setUserId(response.data.uid);
            setUserRole(response.data.role)
            setIsLoggedIn(response.data.isLogin);
            auth.login(setUserId,setUserRole);
            navigate("/admin-dashboard");
            setloginErr("");
            // For example, you might want to fetch admin data after successful login
            //fetchAdminData();
        } else {
            // Handle login failure
            setLoginError("Invalid username or password");
        }
      });
    } catch (error) {
      // Handle other errors
      console.error('Error during login:', error);
      setLoginError("An error occurred during login");
    }
  };

  const fetchAdminData = async () => {
    try {
      //const response = await axios.get('http://localhost:8000/api/admin-data/');
        axios.get("http://3.108.151.50/api/admin-data/").then((response)=>{
            // Handle admin data
            console.log(response.data);
            
        });
    } catch (error) {
      // Handle errors
      console.error('Error fetching admin data:', error);
    }
    
  };

  const onSubmit = (data) => {
    login(data);
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Admin Login</h2>
      <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
        <Form>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <Field type="text" id="username" name="username" className="form-control" />
            <ErrorMessage name="username" component="div" className="text-danger" />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <Field type="password" id="password" name="password" className="form-control" />
            <ErrorMessage name="password" component="div" className="text-danger" />
          </div>

          {loginError && <div className="text-danger mb-3">{loginError}</div>}

          <button type="submit" className="btn btn-primary">
            Log in
          </button>
        </Form>
      </Formik>
    </div>
  );
};

export default Admin;
