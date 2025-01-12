import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';  // Import useAuth
import TeacherLeftPanel from './TeacherLeftPanel';

const TeacherCourses = () => {
  const { userId, authToken } = useAuth();  // Use the useAuth hook

  const [courses, setCourses] = useState([]);
  const [enrolledStudents, setEnrolledStudents] = useState({});
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    // Fetch courses based on userId
    axios.get(`http://3.108.151.50/coursesfetch/?user_id=${userId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
    .then(response => {
      setCourses(response.data);
    })
    .catch(error => {
      console.error('Error fetching teacher courses:', error);
    });
  }, [userId, authToken]);

  const handleCourseSelection = (courseId) => {
    // Fetch enrolled students for the selected course
    axios.get(`http://3.108.151.50/enrolledfetch/?course_id=${courseId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },

    })
    .then(response => {
      setEnrolledStudents(response.data);
      setSelectedCourse(courseId);
    })
    .catch(error => {
      console.error('Error fetching enrolled students:', error);
    });
  };

  return (
    <div className='App'>
        <div className='jumbotron'>
        <div className="container-fluid ">
            <div className="row">
                <div className="col-3">
                <TeacherLeftPanel />
                </div>
                
                <div className="col-9">
                    <h2>Your Courses</h2>
                    <div className="flex-end">
                    
                        {courses.map(course => (

                        <div class="accordion" id="accordionExample">
                            <div class="accordion-item">
                                <h2 class="accordion-header" key={course.id} onClick={() => handleCourseSelection(course.id)} style={{cursor:'pointer'}}>
                                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                <u><h3 style={{pointer:'cursor'}}>{course.title}</h3>
                                <p>Course Name: {course.course_name}</p>
                                <p>Description: {course.description}</p></u>
                                </button>
                                </h2>            
                            
                            
                            {selectedCourse && selectedCourse === course.id && (
                            <div>
                                <p><u><i>Enrolled Students:</i></u></p>
                                
                                {enrolledStudents
                                    .filter(student => student.course === course.id)
                                    .map(filteredStudent => (
                                        <div id="collapseOne" class="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                                            <div class="accordion-body" key={filteredStudent.id}></div>
                                        
                                            <strong>
                                                <ul>
                                            <li>{filteredStudent.name}</li>
                                                </ul>
                                            </strong>
                                        </div>
                                ))}
                            
                            </div>

                            )}
                            
                            </div>
                        </div>
                        ))}
                    
                    </div>
                </div>
            </div>
        </div>
        </div>
    </div>
    
  );
};

export default TeacherCourses;
