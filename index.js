const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/loginData',{
  connectTimeoutMS: 30000,  // Increase connection timeout to 30 seconds
  socketTimeoutMS: 45000,   // Increase socket timeout to 45 seconds
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));


// Create a Schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model('User', userSchema);

// Route to handle form submission
app.post('/submit', (req, res) => {
  console.log('Received data:', req.body); // Log the received data

  const { username, password } = req.body;

  // Basic validation: Check if the fields are empty
  if (!username || !password) {
    return res.status(400).json({ error: 'Missing username or password' });
  }

  const newUser = new User({
    username,
    password,
  });

  newUser.save()
    .then(() => res.json({ message: 'Data saved successfully!' }))
    .catch(err => {
      console.error('Error saving data:', err); // Log the error for debugging
      res.status(400).json({ error: err.message || 'An error occurred' });
    });
});



// Route to serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
