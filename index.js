/* airtable patlgy4Vt9pGjbfQJ.d37527a72d91386f21f786570631e3c5f0981de7d5109ca2c6d50cb914f5385d */

/* lo que llega desde las apps
{
    "data": {
      "progress": 0,
      "secondsFromStart": " 0",
      "sessionStartAt": 0,
      "status": "VIDEO_STARTED",
      "userIdentifier": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImp0aSI6ImQxOGZkZDc3LTIzMzgtNGEwNi1iMjZhLTk4ZGVjNTNiOTI2NCJ9.eyJhdWQiOiIxNWI2ODE4YS0wYTA2LTRjM2EtOThiYi0xYjNmMzY2ZjllZGIiLCJqdGkiOiJkMThmZGQ3Ny0yMzM4LTRhMDYtYjI2YS05OGRlYzUzYjkyNjQiLCJpYXQiOjE3MDc5Mjg5MjMsIm5iZiI6MTcwNzkyODkyMywiZXhwIjoxNzEwNTI0NTIzLCJzdWIiOiJiX2dhbHZhbkB5YWhvby5jb20iLCJzY29wZXMiOltdLCJtaWQiOjQzOTg2NTIsImFpZCI6MTEzMTM4ODEsIm11aSI6IjE1YjY4MThhLTBhMDYtNGMzYS05OGJiLTFiM2YzNjZmOWVkYiIsImN0eCI6WyJjb25zdW1lciJdLCJ0aWQiOjExMzEzODgxLCJ0dXVpZCI6ImQxOGZkZDc3LTIzMzgtNGEwNi1iMjZhLTk4ZGVjNTNiOTI2NCIsIm9pZCI6MH0.hiZ0HmwgV6NGa-uMIq4RSHX1Ox3QvuYH0NqM3YdXj0c",
      "videoId": "vbZk3Cv3"
    },
    "datacontenttype": "application/json",
    "id": "01d4540f-895c-4ed5-922c-eb9a174fbcf0",
    "source": "kanalddrama://com.appkanalddrama/versions/3.0.6",
    "specversion": "1.0",
    "subject": "Watched video segment 0 progress: 0 vbZk3Cv3",
    "time": "2024-02-14T17:42:20Z",
    "type": "com.applicaster.video.started.v1"
}*/

const Airtable = require("airtable");
const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");
const { SlowBuffer } = require("buffer");

const app = express();

dotenv.config();

Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey:
    "patlgy4Vt9pGjbfQJ.d37527a72d91386f21f786570631e3c5f0981de7d5109ca2c6d50cb914f5385d",
});

const airtableDataBase = Airtable.base("app0UxcUWwRrDRDva");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const hostname = "127.0.0.1";
const port = process.env.PORT || 5000;

const dataArray = [];

// app.get("/", (req, res) => {
//   const dataRequested = "{userIdentifier} = '" + req.query.ctx + "'";
//   const retrievedRecords = [];
//   const filterParameters = {
//     maxRecords: 20,
//     view: "Grid view",
//     fields: ["eventId", "time", "secondsFromStart", "progress"],
//     filterByFormula: dataRequested,
//   };
//   airtableDataBase("Continue Watching")
//     .select(filterParameters)
//     .eachPage(
//       function page(records, fetchNextPage) {
//         records.forEach(function (record) {
//           retrievedRecords.push(getDataFromRecord(record));
//           console.log(record.id);
//         });
//         fetchNextPage();
//       },
//       function done(err) {
//         if (err) {
//           console.error(err);
//           return;
//         }
//         res.send({ entry: retrievedRecords });
//       }
//     );
// });

app.get("/", (req, res) => {
  console.log("get "+ req.query);
  // console.log(atob(req.query));
  res.send({});
});

app.post("/", (req, res) => {
  // const dataReceived = req.body;

  // if (
  //   dataReceived.data.status === "VIDEO_STOPPED" ||
  //   dataReceived.data.status === "COMPLETED"
  // )
  //   dataArray.push(dataReceived);
/* lo que llega desde las apps
{
    "data": {
      "progress": 0,
      "secondsFromStart": " 0",
      "sessionStartAt": 0,
      "status": "VIDEO_STARTED",
      "userIdentifier": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImp0aSI6ImQxOGZkZDc3LTIzMzgtNGEwNi1iMjZhLTk4ZGVjNTNiOTI2NCJ9.eyJhdWQiOiIxNWI2ODE4YS0wYTA2LTRjM2EtOThiYi0xYjNmMzY2ZjllZGIiLCJqdGkiOiJkMThmZGQ3Ny0yMzM4LTRhMDYtYjI2YS05OGRlYzUzYjkyNjQiLCJpYXQiOjE3MDc5Mjg5MjMsIm5iZiI6MTcwNzkyODkyMywiZXhwIjoxNzEwNTI0NTIzLCJzdWIiOiJiX2dhbHZhbkB5YWhvby5jb20iLCJzY29wZXMiOltdLCJtaWQiOjQzOTg2NTIsImFpZCI6MTEzMTM4ODEsIm11aSI6IjE1YjY4MThhLTBhMDYtNGMzYS05OGJiLTFiM2YzNjZmOWVkYiIsImN0eCI6WyJjb25zdW1lciJdLCJ0aWQiOjExMzEzODgxLCJ0dXVpZCI6ImQxOGZkZDc3LTIzMzgtNGEwNi1iMjZhLTk4ZGVjNTNiOTI2NCIsIm9pZCI6MH0.hiZ0HmwgV6NGa-uMIq4RSHX1Ox3QvuYH0NqM3YdXj0c",
      "videoId": "vbZk3Cv3"
    },
    "datacontenttype": "application/json",
    "id": "01d4540f-895c-4ed5-922c-eb9a174fbcf0",
    "source": "kanalddrama://com.appkanalddrama/versions/3.0.6",
    "specversion": "1.0",
    "subject": "Watched video segment 0 progress: 0 vbZk3Cv3",
    "time": "2024-02-14T17:42:20Z",
    "type": "com.applicaster.video.started.v1"
}*/

  console.log(req.query.ctx+" "+req.body.datacontenttype+" "+req.body.subject+" "+req.body.data.userIdentifier);
  res.send({"specversion": "1.0","type": "com.applicaster.event.received.v1","source": "Vodus Server","subject": "Event  Stopped was successfully received","id": "ID_EVENT","time": "Ahora"});
  //res.send(req.params);
  res.status(201).end();
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}/`);
});

const getDataFromRecord = function (record) {
  return {
    id: record.get("eventId"),
    extensions: {
      resumeLastUpdate: record.get("time"),
      resumeTime: record.get("secondsFromStart"),
      progress: record.get("progress"),
      resumeCompleted: false,
    },
  };
};
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
