// https://expressjs.com/en/guide/routing.html


// REQUIRES
const express = require("express");
const app = express();

app.use(express.json());
const fs = require("fs");

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// just like a simple web server like Apache web server
// we are mapping file system paths to the app's virtual paths
app.use(express.static('app'));
app.use("/js", express.static("./public/js"));
app.use("/css", express.static("./public/css"));
app.use("/img", express.static("./public/img"));

//Call back function
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/app/html/index.html');
  });
  
app.get('/task.html', (req, res) => {
    res.sendFile(__dirname + '/app/html/task.html');
  });

  app.get('/signIn.html', (req, res) => {
    res.sendFile(__dirname + '/app/html/signIn.html');
  });

  app.get('/signOut.html', (req, res) => {
    res.sendFile(__dirname + '/app/html/signOut.html');
  });

app.get('/main.html', (req, res) => {
  res.sendFile(__dirname + '/app/html/main.html');
});

// // for resource not found (i.e., 404)
// app.use(function (req, res, next) {
//     // this could be a separate file too - but you'd have to make sure that you have the path
//     // correct, otherewise, you'd get a 404 on the 404 (actually a 500 on the 404)
//     res.status(404).send("<html><head><title>Page not found!</title></head><body><p>Nothing here.</p></body></html>");
// });

// RUN SERVER
app.listen(8000, () => {
    console.log('Server started on port 8000');
  });
