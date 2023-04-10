const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const app = express();

// Set up the middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

// Set up the MySQL connection
const connection = mysql.createConnection({
  host: '10.128.0.8',
  port: 3306,
  user: 'teo',
  password: 'wH27sK7g',
  database: 'clients'
});

// Connect to the MySQL database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the MySQL database: ' + err.stack);
    return;
  }
  console.log('Connected to the MySQL database as id ' + connection.threadId);
});

// Set up the routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/contact', (req, res) => {
  res.sendFile(__dirname + '/views/contact.html');
});

// my changes
app.get('/documentation', (req, res) => {
  res.sendFile(__dirname + '/views/documentation.html');
});

// Add a new route to handle the /clients URL
app.get('/clients', (req, res) => {
  // Query the MySQL database to fetch the list of clients
  connection.query('SELECT name, email FROM clients', (error, results) => {
    if (error) {
      console.error('Error fetching clients: ' + error.stack);
      res.status(500).send('Internal Server Error');
      return;
    }
    // Render the clients.html file and pass the list of clients as data
    res.render('clients', { clients: results });
  });
});

app.post('/contact', (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const message = req.body.message;

  // Insert the message into the MySQL database
  const sql = 'INSERT INTO messages (name, email, message) VALUES (?, ?, ?)';
  connection.query(sql, [name, email, message], (err, result) => {
    if (err) {
      console.error('Error inserting the message into the MySQL database: ' + err.stack);
      res.redirect('/contact?success=false');
    } else {
      console.log('Message inserted into the MySQL database with ID ' + result.insertId);
      res.redirect('/contact?success=true');
    }
  });
});

// Start the server
// const PORT = process.env.PORT || 8080;
// app.listen(PORT, () => {
//   console.log(`Server started on port ${PORT}`);
// });
const server = app.listen(process.env.PORT || 8080, () => {
  console.log(`Server started on port ${server.address().port}`);
});

server.keepAliveTimeout = 620000; // 620 seconds


