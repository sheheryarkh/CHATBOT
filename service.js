const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');


// Connect to MongoDB
const uri = "mongodb+srv://dbuser:Imcassano3@sheheryar3.jswzj.mongodb.net/";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const app = express();
const port = 8000; // Change the port to 8000

// Middleware to parse JSON
app.use(bodyParser.json());

// Define a Mongoose schema and model
const webhookSchema = new mongoose.Schema({
  name: String,
  email: String,
  number: String,
  city: String
}, { timestamps: true });

const Webhook = mongoose.model('Webhook', webhookSchema);

// Middleware to log requests
app.use((req, res, next) => {
  console.log(`${req.method} request for '${req.url}' with body:`, req.body);
  next();
});

// Define a route to handle webhook POST requests
app.post('/webhook', async (req, res) => {
  try {
    const { name, email, number, city } = req.body; // Destructure data from req.body
    
    if (!name || !email || !number || !city) {
      res.status(400).send('Missing required fields');
      return;
    }

    const webhookData = new Webhook({ name, email, number, city });
    
    await webhookData.save();

    console.log('Webhook data saved:', webhookData);
    res.status(200).send('Webhook data saved successfully');
  } catch (error) {
    console.error('Error saving webhook data:', error);
    res.status(500).send('Error saving webhook data');
  }
});


// Define a home page route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});