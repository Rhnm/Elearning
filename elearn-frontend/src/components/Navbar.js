import React  from "react";
import {Link,NavLink} from 'react-router-dom';
import {useEffect,useState} from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Import useAuth
/**
 * 
 * @returns Template made using https://getbootstrap.com/docs/5.3/components/navbar/
 */
function Navbar({ theme, toggleTheme }) {
    const auth = useAuth(); // Get authentication state and actions from context
    const { isLoggedIn, userRole, userId, authToken } = useAuth();
    
   
      
    
  return (
    <div className="App">
        
      <nav className = {`mt-3 navbar ${theme === 'dark' ? 'navbar-dark' : 'navbar-light'} ${theme === 'dark' ? 'bg-dark' : 'bg-light'} navbar-expand-lg fixed-top border-bottom border-grey`} style={{paddingTop:"0%"}}>
            <div class="container-fluid">
                <Link to="/" className = "navbar-brand">ELEARN</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasDarkNavbar" aria-controls="offcanvasDarkNavbar" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
                </button>
                
                <div className={`offcanvas offcanvas-end ${theme === 'dark' ? 'text-bg-dark' : 'text-bg-light'}`} tabindex="-1" id="offcanvasDarkNavbar" aria-labelledby="offcanvasDarkNavbarLabel">
                    <div className="offcanvas-header">
                        <Link to="/" className = "navbar-brand">ELEARN</Link>
                        
                        <button type="button" className={`btn-close  ${theme == 'dark' ? 'btn-close-white' : 'btn-close-dark'}`} data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>
                    <div className="offcanvas-body">
                        <ul className="navbar-nav mr-auto" >
                            <li className="navbar-item">
                            <NavLink to="/course-list" className="nav-link" activeClassName="active"v>CourseList</NavLink>
                            </li>
                            <li className="navbar-item">
                            <NavLink to="/about" className="nav-link" activeClassName="active">About</NavLink>
                            </li>
                            <li className="navbar-item">
                            <NavLink to="/contact" className="nav-link" activeClassName="active">Contact</NavLink>
                            </li>
                            
                        </ul>
                        <ul className="navbar-nav justify-content-end flex-grow-1 pe-3 navbar-right">
                            {/* <li>
                            <Link to="/login" className="nav-link">Login</Link>
                            </li> */}
                            <li>
                                {isLoggedIn && userId && userRole === 2 && authToken ? (
                                    <NavLink to="/student-dashboard/" className="nav-link"  activeClassName="active">
                                    Dashboard
                                    </NavLink>
                                ) : (
                                    // Render alternative content or leave it empty
                                    null
                                )}
                                </li>
                                <li>
                                {isLoggedIn && userId && userRole === 1 && authToken ? (
                                    <NavLink to="/teacher-dashboard/" className="nav-link"  activeClassName="active">
                                    Dashboard
                                    </NavLink>
                                ) : (
                                    // Render alternative content or leave it empty
                                    null
                                )}
                                </li>
                                <li>
                                {isLoggedIn && userId && userRole && authToken ? (
                                    <Link to="/login" className="nav-link" onClick={auth.logout} >
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
}

export default Navbar;