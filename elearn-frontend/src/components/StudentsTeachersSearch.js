// StudentsTeachersSearch.js

import React, { useState } from 'react';
import axios from 'axios';
import TeacherLeftPanel from './TeacherLeftPanel';

const StudentsTeachersSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResult, setSearchResult] = useState(null);

    const handleSearch = async () => {
        try {
            const response = await axios.get(`http://3.108.151.50/api/search/?name=${searchTerm}`);
            setSearchResult(response.data);
        } catch (error) {
            console.error('Error searching user:', error);
            setSearchResult(null);
        }
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
                            <div>
                                <input
                                    type="text"
                                    placeholder="Enter name to search"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <button onClick={handleSearch}>Search</button>

                                {searchResult && (
                                    <div>
                                        <h2>User Profile</h2>
                                        <p>Name: {searchTerm}</p>
                                        <p>Username: {searchResult.username}</p>
                                        <p>Email: {searchResult.email}</p>
                                        {searchResult.role === 1 && (
                                            <div>
                                                <h3>Teacher Profile</h3>
                                                <p>Status: {searchResult.teacherProfile.status}</p>
                                                <p>Info: {searchResult.teacherProfile.info}</p>
                                                <img src={`http://3.108.151.50${searchResult.teacherProfile.image}`} style={{ width: "100px", height: "100px", borderRadius: "50%", marginTop: "10px" }} alt="Teacher Profile" />
                                            </div>
                                        )}
                                        {searchResult.role === 2 && (
                                            <div>
                                                <h3>Student Profile</h3>
                                                <p>Status: {searchResult.studentProfile.status}</p>
                                                <p>Info: {searchResult.studentProfile.info}</p>
                                                <img src={`http://3.108.151.50${searchResult.studentProfile.image}`} style={{ width: "100px", height: "100px", borderRadius: "50%", marginTop: "10px" }} alt="Student Profile" />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentsTeachersSearch;
