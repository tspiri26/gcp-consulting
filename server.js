const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const request = require("request");
const app = express();
const ejs = require("ejs");
const path = require("path");
// const { createProxyMiddleware } = require('http-proxy-middleware');


// Set up the middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

// Set up the MySQL connection
const connection = mysql.createConnection({
  user     : process.env.MYSQL_USER,
  password : process.env.MYSQL_PASSWORD,
  database : process.env.MYSQL_DATABASE,
  host     : process.env.MYSQL_HOST,
  connectTimeout: 10000
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Connect to the MySQL database
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the MySQL database: " + err.stack);
    return;
  }
  console.log("Connected to the MySQL database as id " + connection.threadId);
});

// app.use('/nginx', createProxyMiddleware({ 
//   target: 'http://localhost:80', // point to your nginx server here
//   changeOrigin: true,
// }));

// Set up the routes
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/contact", (req, res) => {
  res.sendFile(__dirname + "/views/contact.html");
});

// my changes
app.get("/documentation", (req, res) => {
  res.sendFile(__dirname + "/views/documentation.html");
});

app.get("/translate", (req, res) => {
  res.sendFile(__dirname + "/views/translate.html");
});

app.post("/translate", (req, res) => {
  const options = {
    method: "POST",
    url: "https://google-translate1.p.rapidapi.com/language/translate/v2",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      "Accept-Encoding": "application/gzip",
      "X-RapidAPI-Key": "aabc4d03b4msh863a2772a966e75p1bd9f6jsna97f46f128d7",
      "X-RapidAPI-Host": "google-translate1.p.rapidapi.com",
      useQueryString: true,
    },
    form: {
      q: req.body.text,
      target: req.body.targetLang,
      source: req.body.sourceLang,
    },
  };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);

    const result = JSON.parse(body);
    const translatedText = result.data.translations[0].translatedText;
    const prettyResult = JSON.stringify(result, null, 2);
    console.log("Translation:", translatedText);
    console.log("Full response:", prettyResult);
    res.send(translatedText);
  });
});
//curl https://gcp-consulting.tech/api/messages/3
//apiproxy
//curl https://35.244.225.243.nip.io/gcpconv2
app.get("/api/messages/:id", (req, res) => {
  const id = req.params.id;

  connection.query(
    "SELECT * FROM messages WHERE id = ?",
    [id],
    (error, results) => {
      if (error) {
        return res.status(500).send(error);
      }
      if (results.length === 0) {
        return res.status(404).send("Message not found");
      }
      const message = results[0];
      const response = {
        id: message.id,
        name: message.name,
        email: message.email,
        message: message.message,
      };
      res.send(response);
    }
  );
});

// Add a new route to handle the /clients URL
app.get("/clients", (req, res) => {
  connection.query("SELECT * FROM messages", (error, results) => {
    if (error) {
      return res.status(500).send(error);
    }
    res.render("clients", { results });
  });
});

//curl -X POST -H "Content-Type: application/json" -d '{"name":"John","email":"johndoe@example.com","message":"Hello"}' https://gcp-consulting.tech/contact

app.post("/contact", (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const message = req.body.message;

  // Insert the message into the MySQL database
  const sql = "INSERT INTO messages (name, email, message) VALUES (?, ?, ?)";
  connection.query(sql, [name, email, message], (err, result) => {
    if (err) {
      console.error(
        "Error inserting the message into the MySQL database: " + err.stack
      );
      res.redirect("/contact?success=false");
    } else {
      console.log(
        "Message inserted into the MySQL database with ID " + result.insertId
      );
      res.redirect("/contact?success=true");
    }
  });
});
try {
  throw new Error("This is an error message");
} catch (err) {
  console.error(err);
}

app.post("/test-url", (req, res) => {
  const targetUrl = req.body.targetUrl;
  request(targetUrl, function (error, response, body) {
    if (error) {
      return res.status(500).send(`Error connecting to ${targetUrl}: ${error}`);
    }
    res.status(200).send(`Successfully connected to ${targetUrl}`);
  });
});


const server = app.listen(process.env.PORT || 8080, () => {
  console.error(`Server started on port ${server.address().port}`);
});

server.keepAliveTimeout = 620000; // 620 seconds
