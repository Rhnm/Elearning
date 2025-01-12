// AdminDashboard.js
import React,{ useEffect,useState } from 'react';
import AdminLeftPanel from './AdminLeftPanel';
import ChangePassword from './ChangePassword';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const AdminDashboard = ({ setShowNavbar }) => {
  const navigate = useNavigate();
  const auth = useAuth();
  useEffect(() => {
    // Call setShowNavbar(false) to hide the Navbar when the AdminDashboard component mounts
    setShowNavbar(false);
    // Redirect to the home page if not logged in or user role is not 2
  
    // Make sure to clean up by calling setShowNavbar(true) when the component is unmounted
    return () => {
      setShowNavbar(true);
    };
  }, [setShowNavbar]);
  console.log(auth.isLoggedIn);
  console.log(auth.role);

  

  



  return (
    <div className="App">
      <div className="container-fluid">
        <div className="row">
          {/* Sidebar */}
          <div className="col-3" style={{ border: '1px solid #ccc',padding:'2%' }}>
            <AdminLeftPanel />
          </div>

          {/* Main Content */}
          <div className="col-9">
            <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
              {/* Your admin dashboard content goes here */}
              <h2 className="">Admin Dashboard</h2>
              <p>Welcome to the admin dashboard!</p>

              
              {/* Add your other components and content here */}
            </main>
          </div>
        </div>
      </div>
    </div>
    
  );
};

export default AdminDashboard;
