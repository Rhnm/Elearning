// AdminNavigation.js
import React from 'react';
import { Link } from 'react-router-dom';
import {useEffect,useState} from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Import useAuth

const AdminNavigation = ({ theme, toggleTheme }) => {
    const auth = useAuth(); // Get authentication state and actions from context
    const location = useLocation();
    //const theme = document.documentElement.getAttribute('data-bs-theme');
    const queryParams = new URLSearchParams(location.search);
    const Y_isLoggedIn = queryParams.get('isLoggedIn') === 'true';
    console.log(Y_isLoggedIn);
    if(Y_isLoggedIn){
        auth.login();
    }
  return (
    <div className="App">
        <nav className = {`navbar ${theme === 'dark' ? 'navbar-dark' : 'navbar-light'} ${theme === 'dark' ? 'bg-dark' : 'bg-light'} navbar-expand-lg fixed-top border-bottom border-grey`}>
            <div class="container-fluid">
                <Link to="/" className = "navbar-brand">ELEARN</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasDarkNavbar" aria-controls="offcanvasDarkNavbar" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
                </button>
                
                <div className={`offcanvas offcanvas-end ${theme === 'dark' ? 'text-bg-dark' : 'text-bg-light'}`} tabindex="-1" id="offcanvasDarkNavbar" aria-labelledby="offcanvasDarkNavbarLabel">
                    <div className="offcanvas-header">
                        <Link to="/" className = "navbar-brand">ELEARN</Link>
                        
                        <button type="button" className={`btn-close  ${theme === 'dark' ? 'btn-close-white' : 'btn-close-dark'}`} data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>
                    <div className="offcanvas-body">
                        <ul className="navbar-nav mr-auto" >
                            <li className="navbar-item">
                            <Link to="/course-list" className="nav-link">CourseList</Link>
                            </li>
                            <li className="navbar-item">
                            <Link to="/about" className="nav-link">About</Link>
                            </li>
                            <li className="navbar-item">
                            <Link to="/contact" className="nav-link">Contact</Link>
                            </li>
                            
                        </ul>
                        <ul className="navbar-nav justify-content-end flex-grow-1 pe-3 navbar-right">
                            {/* <li>
                            <Link to="/login" className="nav-link">Login</Link>
                            </li> */}
                            <li>
                                {auth.isLoggedIn ?(
                                    <Link to="/login" className="nav-link" onClick={auth.logout}>
                                        Logout
                                    </Link>
                                    ) : (
                                    <Link to="/login" className="nav-link">
                                        Login
                                    </Link>
                                )}
                            </li>
                            
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    </div>
  );
};

export default AdminNavigation;
