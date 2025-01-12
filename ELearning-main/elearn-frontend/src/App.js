import React, { Component } from 'react';
import {BrowserRouter as Router, Routes, Route, BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from './logo.svg';
import './App.css';
import Header from './Header';
import Nav from './Nav';
import Footer from './Footer';
import CourseList from './components/CourseList';
import {useEffect,useState} from 'react';

class App extends Component {
  render() {
    useEffect(() => {
      // Run toggleTheme when the component mounts
      toggleTheme();
    }, []); // Empty dependency array ensures that this effect runs only on component mount
    // Check if there's a theme preference stored in local storage
    const savedTheme = localStorage.getItem('theme');
    const [theme, setTheme] = useState("light"); // Initialize with a default theme
    // If there's a theme preference, apply it
    if (savedTheme) {
      document.documentElement.setAttribute('data-bs-theme', savedTheme);
    }
    // Function to toggle between dark and light themes
    const toggleTheme = () => {
      const currentTheme = document.documentElement.getAttribute('data-bs-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
      // Apply the new theme
      document.documentElement.setAttribute('data-bs-theme', newTheme);

      // Save the theme preference in local storage
      localStorage.setItem('theme', newTheme);
    };
    return (
      <Provider store={store}>
        <BrowserRouter>
          <AuthProvider>
            <Navbar theme={theme} toggleTheme={toggleTheme} />
            <div class="row">
              <div class="container">
                  <div class="toggle d-flex">
                  <div class="form-check form-switch ms-auto mt-3 me-3 order-md-1">
                      <label class="form-check-label ms-3" for="lightSwitch">
                      <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-brightness-high" viewBox="0 0 16 16">
                          <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"></path>
                      </svg>
                      </label>
                      <input class="form-check-input btn-check" type="checkbox" onClick={() => {
                              toggleTheme() }} id="lightSwitch" checked={theme === 'light'} />
                  </div>
                  </div>
              </div>
            </div>
            <br />
            <div className="mt-3">
                <Routes>
                  <Route path="/" exact element={<Home />} />
                  <Route path="/course-list" element={<CourseList />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/privacy" element={<Privacy />} />
                </Routes>
            </div>
            <Footer theme={theme} />
          </AuthProvider>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
