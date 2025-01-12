// AdminLeftPanel.js
import React from 'react';
import { Link } from 'react-router-dom';

const AdminLeftPanel = () => {
  return (
    <nav id="sidebar" className="col-md-3 col-lg-2 d-md-block bg-light sidebar">
      <div className="position-sticky">
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link className="nav-link active" to="/admin-dashboard">
              Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/admin-dashboard/change-password">
              Change Password
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/register-teacher">
              Register Teacher
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default AdminLeftPanel;
