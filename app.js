const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const usersRoutes = require('./routes/users');

// Use routes
app.use('/api/users', usersRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send("Hello World! let's innovate together!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});