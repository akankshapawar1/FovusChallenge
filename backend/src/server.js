// src/server.js
const express = require('express');
const s3 = require('./s3');

const app = express();
const port = process.env.PORT || 8080;

app.get('/presigned-url', async (req, res) => {
  const fileName = req.query.fileName;
  try {
    const url = await s3.generatePresignedUrl(fileName);
    res.json({ url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});