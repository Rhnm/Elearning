import React, { useState } from 'react';

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState(null);

    const allowedFileTypes = ['application/pdf', 'image/jpeg', 'video/mp4', 'audio/mp3'];

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];

        if (selectedFile && allowedFileTypes.includes(selectedFile.type)) {
            setFile(selectedFile);
            setErrorMessage(null);
        } else {
            setFile(null);
            setErrorMessage('Invalid file type. Please upload a PDF, JPEG, MP4, or MP3 file.');
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setErrorMessage('Please select a valid file before uploading.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://3.108.151.50/api/files/', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                setSuccessMessage("File uploaded successfully!");
                console.log('File uploaded successfully');
                setFile(null);  // Clear the file input field
            } else {
                setErrorMessage("File could not be uploaded!");
                console.error('File upload failed');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            const response = error.response;
            setErrorMessage(response);
        }
    };

    return (
        <div className="App">
            <div className="jumbotron">
            <div id="form-message-success" className="mb-4 text-success">
                {successMessage}{errorMessage}
            </div>
            <div id="form-message-success" className="mb-4 text-danger">
                {errorMessage}
            </div>
                <input type="file" accept=".pdf, .jpeg, .jpg, .mp4, .mp3" onChange={handleFileChange} />
                <button onClick={handleUpload}>Upload File</button>
            </div>
        </div>
    );
};

export default FileUpload;
