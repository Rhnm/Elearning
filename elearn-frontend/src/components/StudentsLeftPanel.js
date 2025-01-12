// StudentsLeftPanel.js
import React from "react";
import { Link } from "react-router-dom";
import { NavLink, Outlet } from "react-router-dom";

const StudentsLeftPanel = () => {
  return (
    <div className="App">
    <div className="mt-3"></div>
    <nav id="sidebar" className="col-md-3 col-lg-2 d-md-block bg-light sidebar mb-4">
      <div className="position-sticky">
        <ul className="nav flex-column">
          <li className="nav-item">
            <NavLink to="/student-dashboard/student-profile/" className="nav-link" activeClassName="active">
              My Profile
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/student-dashboard/my-courses/" className="nav-link" activeClassName="active">
              My Courses
            </NavLink>
          </li>
          {/* Add more links for additional routes */}
        </ul>
      </div>
      <hr />
      <Outlet />
    </nav>
    </div>
  );
};

export default StudentsLeftPanel;
