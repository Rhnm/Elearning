import React from "react";
import { Link , useLocation} from "react-router-dom";
import { NavLink,Outlet } from 'react-router-dom';
const TeacherLeftPanel = () => {
  const location = useLocation();
  return (
    <nav id="teacher-sidebar" className="col-md-3 col-lg-2 d-md-block bg-light sidebar">
      <div className="position-sticky">
        <ul className="nav flex-column">
          <li className="nav-item">
            <NavLink className="nav-link" to="/teacher-dashboard/profile" activeClassName="active">
              My Profile
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/teacher-dashboard/create-course" activeClassName="active">
              Create Course
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/teacher-dashboard/create-topic" activeClassName="active">
              Create Topic
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/teacher-dashboard/create-test" activeClassName="active">
              Create Test
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/teacher-dashboard/courses" activeClassName="active">
              My Courses
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/teacher-dashboard/search" activeClassName="active">
              Search
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/teacher-dashboard/update-topic" activeClassName="active">
              Update Topic
            </NavLink>
          </li>
          
        </ul>
      </div>
      <hr />
      <Outlet />
    </nav>
  );
};

export default TeacherLeftPanel;
