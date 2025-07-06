const express = require('express');
const cors = require('cors');
const scheduleHandler = require('./schedule');

const app = express();
const PORT = 5000;

// Enable CORS for frontend
app.use(cors());
app.use(express.json());

// API route
app.post('/api/schedule', scheduleHandler);

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log(`API endpoint: http://localhost:${PORT}/api/schedule`);
}); 