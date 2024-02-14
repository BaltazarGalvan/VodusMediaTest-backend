const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();

dotenv.config();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const hostname = "127.0.0.1";
const port = process.env.PORT || 5000;

const dataArray = [];

app.get("/", (req, res) => {
  const dataRequested = req.query
  console.log(dataRequested.ctx);
 
 /* dataArray.forEach((x) => console.log(x));
  const dataFiltered = dataArray.filter(
    (data) => data.data.userIdentifier === req.query.ctx
  );
  const videoArray = dataFiltered.map((data) => {
    return {
      id: data.data.videoId,
      extensions: {
        resumeLastUpdate: data.time,
        resumeTime: data.data.secondsFromStart,
        progress: data.data.progress,
        resumeCompleted: false,
      },
    };
  });
  const dataToReturn = { entry: videoArray };
  res.send(dataToReturn);*/
  res.send(dataArray);
  
});

app.post("/", (req, res) => {  
  const dataReceived =req.body;
  
  if (dataReceived.data.status !== "VIDEO_STOPPED" || dataReceived.data.status !== "COMPLETED") {
   return;
  }
  
  dataArray.push(dataReceived);
  console.log(dataArray);
  res.send(dataArray);
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}/`);
});

// solo con node js

// const http = require("http");

// const server = http.createServer((req, res) => {
//   res.statusCode = 200;
//   res.setHeader("Content-Type", "text/plain");
//   res.end("Hello World\n");
// });

// server.listen(port, hostname, () => {
//   console.log(`Server running at http://${hostname}:${port}/`);
// });
