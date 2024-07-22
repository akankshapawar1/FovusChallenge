import 'flowbite/dist/flowbite.min.css';
import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async (event) => {
    event.preventDefault(); // Prevent the default form submission
    if (!selectedFile) {
      alert('Please select a file to upload');
      return;
    }

    try {
      // Get the pre-signed URL from the backend
      const response = await axios.get('http://localhost:8080/presigned-url', {
        params: {
          fileName: selectedFile.name,
        },
      });
      const presignedUrl = response.data.url;

      // Upload the file to S3 using the pre-signed URL
      const config = {
        headers: {
          'Content-Type': selectedFile.type,
        },
      };
      await axios.put(presignedUrl, selectedFile, config);
      setUploadStatus('File uploaded successfully');
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadStatus('Error uploading file');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form className="max-w-sm mx-auto" onSubmit={handleUpload}>
        <div className="mb-5">
          <label htmlFor="textInput" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Text Input:</label>
          <input type="text" id="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
        </div>
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="file_input">File Input:</label>
          <input className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="file_input" type="file" onChange={handleFileChange} required />
        </div>
        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
        {uploadStatus && <p className="mt-3 text-sm">{uploadStatus}</p>}
      </form>
    </div>
  );
}

export default App;
