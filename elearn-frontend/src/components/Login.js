import React from "react";
import {Formik, Form, Field, ErrorMessage} from "formik"; 
import * as Yup from 'yup';
import axios from "axios";
import {useEffect,useState} from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from "react-router-dom"; // Import useHistory hook


/**
 * 
 * @returns Template taken from https://mdbootstrap.com/docs/standard/extended/login/
 */

function Login() {
  const [successMessage, setSuccessMessage] = useState(""); // State for success message
  const auth = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState();//localStorage.getItem('isLoggedIn') === 'true'
  const [userlogged_id, setUserId] = useState();
  const [userlogged_role,setUserRole] = useState();
  const [loginErr, setloginErr] = useState();
  const navigate = useNavigate(); // Initialize useNavigate hook
  const initialValues={
    username:"",
    password:"",
  };
  const reg_initialValues={
    registername:"",
    registerusername:"",
    registeremail:"",
    registerpassword:"",
    registerrepeatpass:"",
  };
  const validationSchema = Yup.object().shape({
    username:Yup.string().min(3).max(50).required("You must input an username/Email"),
    password:Yup.mixed().required("You must input a password"),
    //password:Yup.mixed().required("You must input a password"),
  })

  const reg_validationSchema = Yup.object().shape({
    registerusername:Yup.string().min(3).max(50).required("You must input an username"),
    registername:Yup.string().min(3).max(50).required("You must input a name"),
    registeremail:Yup.string().email().min(3).max(50).required("You must input an Email"),
    registerpassword:Yup.mixed().required("You must input a password"),
    registerrepeatpass: Yup.string()
    .oneOf([Yup.ref('registerpassword'), null], 'Passwords must match')
    .required('You must repeat your password'),
    //password:Yup.mixed().required("You must input a password"),
  })

  const onSubmit_reg=(data)=>{
    const currentDate = new Date().toISOString();
    const requestData = {
      last_login: currentDate,
      name: data.registername,
      username: data.registerusername,
      email: data.registeremail,
      password: data.registerpassword,
      role: 2,
    }
    
      // // Fetch CSRF token
      // const csrfTokenResponse = axios.get("http://localhost:8000/get-csrf-token/");
      // const csrfToken = csrfTokenResponse.data.csrfToken;
      // //const authToken = getAuthToken(); 
      // // Include CSRF token in the headers
      // const headers = {
      // // Add your other headers if needed
      //   "X-CSRFToken": csrfToken,  // Include the CSRF token in the headers
      // };
    
    axios.post("http://3.108.151.50/api/register/", requestData)
    .then((response)=>{
      
      setSuccessMessage("Registration successfull!");
    })
    .catch((error) => {
      if (error.response) {
        const responseData = error.response.data;
  
        // Check if the error message indicates a duplicate user
        if (responseData && responseData.errors) {
          const usernameError = responseData.errors.username;
          const emailError = responseData.errors.email;
  
          if (responseData.message.includes("user with this username already exists.")) {
            const cleanUsernameError = "Username is already taken. Please choose a different one.";
            setSuccessMessage(cleanUsernameError);
          } else if (responseData.message.includes("user with this email already exists.")) {
            const cleanEmailError = "Email is already registered. Please use a different email.";
            setSuccessMessage(cleanEmailError);
          } else {
            // If not a duplicate user error, use a generic error message
            setSuccessMessage(responseData.message || "Registration failed! Try Again");
          }
        } else {
          // If the error response doesn't have the expected structure, use a generic error message
          setSuccessMessage("Registration failed! Try Again");
        }
      } else {
        // Handle other error cases if needed
        console.error("No response received from the server:", error.request);
      }
    });
    
  };
    // Perform your login logic
    const onSubmit=(data, { setSubmitting, setErrors })=>{
      
      
      axios.post("http://3.108.151.50/api/login/", data).then((response)=>{
        
        
        if(response.data.isLogin && (response.data.role === 2 || response.data.role === 1)){
          
          auth.login(response.data.uid, response.data.role, response.data.token, response.data.username);
          setSuccessMessage("Login Successful");
          
          
          
          if (response.data.role === 2) {
            navigate("/student-dashboard");
          } else if (response.data.role === 1) {
            navigate("/teacher-dashboard");
          }
          
          setSuccessMessage("Login Successfull");
          
        }else{
          setSuccessMessage("Wrong Username or Password");
          setloginErr("Wrong username or password");
        }
      })
      .catch((error) => {
        if (error.response) {
          const responseData = error.response.data;
  
          if (responseData && responseData.non_field_errors) {
            // Display non-field errors
            setErrors({ password: responseData.non_field_errors.join(', ') });
          } else {
            // Generic error message for other errors
            setloginErr("Wrong Username or Password. Please try again.");
          }
        } else {
          setloginErr("Wrong Username or Password. Please try again.");
        }
      })
      .finally(() => {
        setSubmitting(false);
      });
      
      
    };

  
  return (
    <div className="App">
      <div className=" container-fluid" style={{paddingTop: '25px'}} >
      {/* <!-- Pills navs --> */}
        <ul className="nav nav-pills nav-justified mb-3" id="pills-tab" role="tablist">
          <li className="nav-item" role="presentation">
            <a className="nav-link active" id="tab-login" data-bs-toggle="pill" data-bs-target="#pills-login" href="#pills-login" role="tab"
              aria-controls="pills-login" aria-selected="true">Login</a>
          </li>
          <li className="nav-item" role="presentation">
            <a className="nav-link" id="tab-register"  data-bs-toggle="pill" data-bs-target="#pills-register" href="#pills-register" role="tab"
              aria-controls="pills-register" aria-selected="false">Register</a>
          </li>
        </ul>
        {/* <!-- Pills navs --> */}

        {/* <!-- Pills content --> */}
        {isLoggedIn ? (
          {/* */}

        ): (
        <div className="tab-content">
        
          <div className="tab-pane fade show active" id="pills-login" role="tabpanel" aria-labelledby="tab-login">
            <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
              <Form>

              {/* <!-- Email input --> */}
              <div className="form-outline mb-4">
                <Field type="text" id="loginName" name="username" className="form-control" />
                <ErrorMessage className="text-danger" name="username" component="span" /><br></br>
                <label className="form-label" for="loginName">Username</label><br></br>
                {loginErr && <span className="text-danger" role="alert">{loginErr}</span>}
              </div>

              {/* <!-- Password input --> */}
              <div className="form-outline mb-4">
                <Field type="password" id="loginPassword" name="password" className="form-control" />
                <ErrorMessage className="text-danger" name="password" component="span" /><br></br>
                <label className="form-label" for="loginPassword">Password</label><br></br>
                {loginErr && <span className="text-danger" role="alert">{loginErr}</span>}
              </div>

              {/* <!-- 2 column grid layout --> */}
              <div className="row mb-4">
                <div className="col-md-6 d-flex justify-content-center">
                  {/* <!-- Checkbox --> */}
                  <div className="form-check mb-3 mb-md-0">
                    <input className="form-check-input" type="checkbox" value="" id="loginCheck" checked />
                    <label className="form-check-label" for="loginCheck"> Remember me </label>
                  </div>
                </div>

                <div className="col-md-6 d-flex justify-content-center">
                  {/* <!-- Simple link --> */}
                  <a href="#!">Forgot password?</a>
                </div>
              </div>

              {/* <!-- Submit button --> */}
              <button type="submit" className="btn btn-success btn-block mb-4">Sign in</button>
              
              {/* <!-- Register buttons --> */}
              
              </Form>
            </Formik>
          </div>
        
          <div className="tab-pane fade" id="pills-register" role="tabpanel" aria-labelledby="tab-register">
          <div id="form-message-success" className={`mb-4 ${successMessage === "Registration successfull!" ? "text-success" : "text-danger"}`}>
            {successMessage}
          </div>
          <Formik initialValues={reg_initialValues} onSubmit={onSubmit_reg} validationSchema={reg_validationSchema}>
            <Form>

              {/* <!-- Name input --> */}
              <div className="form-outline mb-4">
                <Field type="text" name="registername" id="registerName" className="form-control" />
                <ErrorMessage className="text-danger" name="registername" component="span" /><br></br>
                <label className="form-label" for="registerName">Name</label>
              </div>

              {/* <!-- Username input --> */}
              <div className="form-outline mb-4">
                <Field type="text" name="registerusername" id="registerUsername" className="form-control" />
                <ErrorMessage className="text-danger" name="registerusername" component="span" /><br></br>
                <label className="form-label" for="registerUsername">Username</label>
              </div>

              {/* <!-- Email input --> */}
              <div className="form-outline mb-4">
                <Field type="email" name="registeremail" id="registerEmail" className="form-control" />
                <ErrorMessage className="text-danger" name="registeremail" component="span" /><br></br>
                <label className="form-label" for="registerEmail">Email</label>
              </div>

              {/* <!-- Password input --> */}
              <div className="form-outline mb-4">
                <Field type="password" name="registerpassword" id="registerPassword" className="form-control" />
                <ErrorMessage className="text-danger" name="registerpassword" component="span" /><br></br>
                <label className="form-label" for="registerPassword">Password</label>
              </div>

              {/* <!-- Repeat Password input --> */}
              <div className="form-outline mb-4">
                <Field type="password" name="registerrepeatpass" id="registerRepeatPassword" className="form-control" />
                <ErrorMessage className="text-danger" name="registerrepeatpass" component="span" /><br></br>
                <label className="form-label" for="registerRepeatPassword">Repeat password</label>
              </div>

              {/* <!-- Checkbox --> */}
              <div className="form-check d-flex justify-content-center mb-4">
                <input className="form-check-input me-2" type="checkbox" value="" id="registerCheck" checked
                  aria-describedby="registerCheckHelpText" />
                <label className="form-check-label" for="registerCheck">
                  I have read and agree to the terms
                </label>
              </div>

              {/* <!-- Submit button --> */}
              <button type="submit" className="btn btn-success btn-block mb-3">Sign in</button>
            </Form>
            </Formik>
            <div id="form-message-success" className={`mb-4 ${successMessage === "Registration successfull!" ? "text-success" : "text-danger"}`}>
            {successMessage}
          </div>
          </div>
        </div>
          
        )};
        {/* <!-- Pills content --> */}
          
      </div>
      
    </div>
  );
}

export default Login;