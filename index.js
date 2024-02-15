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
}

lo que debe entregar en el get

{
  "entry": [
    {
      "id": "296bed86-11dc-43c3-9aaf-bfb25600ad2a", // the unique id of the video
      "extensions": {
          "resumeLastUpdate": <TIMESTAMP>
          "resumeTime": "<Number of seconds from the beginning of the video from which playback should start when playing this item>",
          "progress": 0.43 // number between 0 - 1 indecating the progress of the fed
          "resumeCompleted": true // When set to true, the app will use this info to remove the video from the list
        }
      }
    }, {...}, {...}
  ]
}

*/

const Airtable = require("airtable");
const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");

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

app.get("/", (req, res) => {
  const dataRequested = req.query;
  console.log(dataRequested.ctx);
  const retrievedRecords = [];
  airtableDataBase("Continue Watching")
    .select({
      maxRecords: 20,
      view: "Grid view",
      fields: [
        "userIdentifier",
        "id",
        "time",
        "secondsFromStart",
        "progress",
        "status",
      ],
    })
    .eachPage(
      function page(records, fetchNextPage) {
        records.forEach(function (record) {
          const dataRecordRetraieved = {
            id: record.get("id"),
            extensions: {
              resumeLastUpdate: record.get("time"),
              resumeTime: record.get("secondsFromStart"),
              progress: record.get("progress"),
              resumeCompleted: false,
            },
          };
          console.log(dataRecordRetraieved);
          retrievedRecords.push(dataRecordRetraieved);
          console.log("array", retrievedRecords);
        });
        fetchNextPage();
      },
      function done(err) {
        if (err) {
          console.error(err);
          return;
        }
      }
    );

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
  console.log(retrievedRecords);
  res.send(retrievedRecords);
});

app.post("/", (req, res) => {
  const dataReceived = req.body;

  if (
    dataReceived.data.status === "VIDEO_STOPPED" ||
    dataReceived.data.status === "COMPLETED"
  )
    dataArray.push(dataReceived);

  console.log(dataArray);
  res.send('""');
  res.status(201).end();
  // res.send(dataArray);
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
