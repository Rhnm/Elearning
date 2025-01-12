import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, ListGroup, Button } from 'react-bootstrap';
import Chat from './Chat'; 

const Study = () => {
    const { courseId } = useParams();
const [courseDetails, setCourseDetails] = useState({});
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [isChatVisible, setIsChatVisible] = useState(true);

  const toggleChatVisibility = () => {
    setIsChatVisible((prev) => !prev);
  };

  useEffect(() => {
    
    // Fetch course topics when the component mounts
    axios.get(`http://3.108.151.50/api/study/${courseId}/`)
      .then(response => {
        setCourseDetails(response.data.course);
        setTopics(response.data.topics);
    })
      .catch(error => console.error('Error fetching topics:', error));
  }, [courseId]);

  const handleTopicClick = (topicId) => {
    // Fetch and set the selected topic data when a topic is clicked
    axios.get(`http://3.108.151.50/api/topic_get/?topic_id=${topicId}`)
      .then(response => setSelectedTopic(response.data))
      .catch(error => console.error('Error fetching topic data:', error));
       
  };
 

  return (
    <div className='App jumbotron'>
    <Container className="mt-4">
    
      <Row>
        <Col md={3}>
          {/* Left panel with course topics */}
          <p><b>{courseDetails.title}</b></p>
          <ListGroup>
            {topics.map(topic => (
              <ListGroup.Item key={topic.id}>
                <Button variant="link" onClick={() => handleTopicClick(topic.id)}>
                  {topic.title}
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
        <Col md={9}>
          {/* Right content area for displaying selected topic data */}
          {selectedTopic && (
            <div>
            <h1 className="mb-4 display-4">{selectedTopic.topic_type}</h1>
            <h3 className="mb-3">{selectedTopic.title}</h3>
            <h2 className="mb-2">{selectedTopic.subtitle}</h2>
            <p className="mb-4">{selectedTopic.text_content}</p>
              {selectedTopic.file && (
      <>
        {(() => {
          const lastDotIndex = selectedTopic.file.lastIndexOf('.');
          const fileExtension = lastDotIndex !== -1 ? selectedTopic.file.slice(lastDotIndex + 1) : '';

          switch (fileExtension.toLowerCase()) {
            case 'png':
            case 'jpg':
            case 'jpeg':
              return <img src={`http://3.108.151.50${selectedTopic.file}`} width="50%" alt="Image" />;
            case 'pdf':
              return <a href={selectedTopic.file} target="_blank" rel="noopener noreferrer">Open PDF</a>;
            case 'mp4':
            case 'webm':
              return (
                <video width="320" height="240" controls>
                  <source src={selectedTopic.file} type={`video/${fileExtension}`} />
                  Your browser does not support the video tag.
                </video>
              );
            case 'mp3':
              return (
                <audio controls>
                  <source src={selectedTopic.file} type={`audio/${fileExtension}`} />
                  Your browser does not support the audio tag.
                </audio>
              );
            default:
              return <p>Unsupported file type: {fileExtension}</p>;
          }
        })()}
      </>
    )}
            </div>
          )}
        </Col>
      </Row>
      
    </Container>
    <div style={{float:'right',bottom:0,right:0}}>
    <button
    onClick={toggleChatVisibility}
    className="btn btn-primary"
    >
    <i className="fas fa-comment"></i> Toggle Chat
    </button>
        <Chat roomId={courseDetails.title} isChatVisible={isChatVisible} toggleChatVisibility={toggleChatVisibility} />
    </div>
    </div>
    
  );
};

export default Study;
