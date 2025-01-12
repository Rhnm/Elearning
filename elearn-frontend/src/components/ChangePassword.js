import React,{useEffect,useState} from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Cookies from 'js-cookie';
import AdminLeftPanel from './AdminLeftPanel';


const ChangePassword = () => {
  const initialValues = {
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  };
  const [successMessage, setSuccessMessage] = useState("");
  const validationSchema = Yup.object().shape({
    currentPassword: Yup.string().required("Current password is required"),
    newPassword: Yup.string().min(6, "Password must be at least 6 characters").required("New password is required"),
    confirmNewPassword: Yup.string().oneOf([Yup.ref("newPassword"), null], "Passwords must match").required("Confirm password is required"),
  });
  //const csrfToken = getCsrfToken();
  async function getCsrfToken() {
    // Make an AJAX request to the Django view that returns the CSRF token
    try {
      const response = await fetch('http://3.108.151.50/get-csrf-token/');
      const data = await response.json();
      const csrfToken = data.csrfToken;
      console.log('CSRF Token:', csrfToken);
      return csrfToken;
    } catch (error) {
      console.error('Error fetching CSRF token:', error);
    }
  }
  const onSubmit = async (data) => {
    console.log(data);
    try {
      
      const csrfToken = await getCsrfToken();
      const csrfToken_js = Cookies.get('csrftoken');
      console.log("Here is the token: ", csrfToken);
      axios.defaults.headers.common['X-CSRFToken'] = csrfToken_js;
      // Your API endpoint for changing the password
      axios.defaults.withCredentials = true;
      axios.post("http://3.108.151.50/change-password/", data,{headers: {'X-CSRFToken': csrfToken,'Content-Type': 'application/json'},},{withCredentials: true}).then((response)=>{  
      // Handle success, show a success message, or redirect the user
      console.log(response.data);
      setSuccessMessage("Password Changed Successfully");
    });
    } catch (error) {
      const responseData = error.response.data;
      // Handle error, show an error message, or redirect the user
      setSuccessMessage(responseData.message || "Password couldn't be changed! Try Again");
      console.error("Error changing password:", error);
    }
  };

  

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
              <h2>Change Password</h2>
              <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
                <Form>
                  <input type="hidden" name="csrfmiddlewaretoken" value={getCsrfToken} />
                  <div className="mb-3">
                    <label htmlFor="currentPassword" className="form-label">
                      Current Password
                    </label>
                    <Field type="password" id="currentPassword" name="currentPassword" className="form-control" />
                    <ErrorMessage name="currentPassword" component="div" className="text-danger" />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="newPassword" className="form-label">
                      New Password
                    </label>
                    <Field type="password" id="newPassword" name="newPassword" className="form-control" />
                    <ErrorMessage name="newPassword" component="div" className="text-danger" />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="confirmNewPassword" className="form-label">
                      Confirm New Password
                    </label>
                    <Field type="password" id="confirmNewPassword" name="confirmNewPassword" className="form-control" />
                    <ErrorMessage name="confirmNewPassword" component="div" className="text-danger" />
                  </div>

                  <button type="submit" className="btn btn-primary">
                    Change Password
                  </button>
                </Form>
              </Formik>
            </div>
          </div>
          <div id="form-message-success" className={`mb-4 ${successMessage === "Registration successfull!" ? "text-success" : "text-success"}`}>
            {successMessage}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
