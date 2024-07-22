const express = require('express');
const cors = require('cors');
const s3 = require('./s3');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;

const corsOptions = {
  origin: 'http://localhost:3000', // Allow requests from this origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true, // Allow cookies to be sent
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Enable preflight for all routes

// Define your routes
app.get('/presigned-url', async (req, res) => {
  const fileName = req.query.fileName;
  console.log('Received request for file:', fileName); // Add log
  try {
    const url = await s3.generatePresignedUrl(fileName);
    console.log('Generated presigned URL:', url); // Add log
    res.json({ url });
  } catch (error) {
    console.error('Error generating presigned URL:', error); // Add log
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
