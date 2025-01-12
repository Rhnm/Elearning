import React, { useState } from 'react';
import axios from 'axios';

const ContactUsForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Assuming you have an API endpoint for submitting the contact form
      await axios.post('http://3.108.151.50/contact/', formData);

      setSuccessMessage('Message sent successfully!');
      setFormData({
        name: '',
        email: '',
        message: '',
      });
    } catch (error) {
      console.error('Error sending message:', error);
      // Handle error and set an appropriate error message if needed
    }
  };

  return (
    <div className='App jumbotron'>
      <div className='pt-3'></div>
    <div className="container">
      <div className="row">
        <div className="col-md-6">
          {/* Left Column with Image and Text */}
          <div>
            <img
            src="http://3.108.151.50/media/contact.jpeg"
            alt="About Us"
            style={{ width: "75%", height: "75%", borderRadius: "25%", marginTop: "10px" }}
            className="img-fluid rounded"
          />
            <p>At our e-learning platform, we understand the challenges faced by working individuals who aspire to further their education and skill set. Our Contact Us section serves as a gateway for you to connect with us, seeking not just information but tailored advice on how our courses can seamlessly integrate into your busy professional life..</p>
            <p>Enrolling in our courses is more than a commitment to learning; it's a strategic investment in your career growth. We provide courses curated by efficient teachers who comprehend the demands of a working lifestyle. By reaching out through our Contact Us form, you open the door to personalized guidance on choosing courses that align with your career goals and schedule. Whether you are aiming for a career switch, seeking to enhance your current skills, or aspiring for a promotion, our team is here to assist.</p>
            <p>We recognize that your time is valuable, and our courses are designed with 100% transparency and flexibility, allowing you to learn at your own pace. Connect with us today to explore how our e-learning opportunities can empower your professional journey, offering a harmonious balance between work and education. Your aspirations are our priority, and our Contact Us section is the first step towards a brighter and more skill-enriched future.</p>
          </div>
        </div>
        <div className="col-md-6 jumbotron">
          {/* Right Column with Form */}
          {successMessage && <p className="text-success">{successMessage}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name:</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="form-control" required />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email:</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="form-control" required />
            </div>

            <div className="mb-3">
              <label htmlFor="message" className="form-label">Message:</label>
              <textarea id="message" name="message" value={formData.message} onChange={handleChange} className="form-control" required />
            </div>

            <button type="submit" className="btn btn-primary">Send Message</button>
          </form>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ContactUsForm;
