/* lo que llega desde las apps
{
    "data": {
      "progress": 0,
      "secondsFromStart": " 0",
      "sessionStartAt": 0,
      "status": "xxxxxxx",
      "userIdentifier": "xxxxxxxxxxxxxxxxxxx",
      "videoId": "xxxxxx"
    },
    "datacontenttype": "xxxxxxx",
    "id": "xxxxxx",
    "source": "xxxxxxxx",
    "specversion": "xxx",
    "subject": "xxxxxxxx",
    "time": "2024-02-14T17:42:20Z",
    "type": "xxxxxx"
}*/

/* lo que debe entregar el Get
{
  "entry": [
    {
      "id": "xxxxxxx", // the unique id of the video
      "extensions": {
          "resumeLastUpdate": <TIMESTAMP>
          "resumeTime": "<Number of seconds from the beginning of the video from which playback should start when playing this item>",
          "progress": 0.43 // number between 0 - 1 indecating the progress of the fed
          "resumeCompleted": true // When set to true, the app will use this info to remove the video from the list
        }
      }
  ]
}
*/

//const Airtable = require("airtable");
//const dotenv = require("dotenv");
//const express = require("express");
//const bodyParser = require("body-parser");
//const { SlowBuffer } = require("buffer");

import Airtable from "airtable";
import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import { SlowBuffer } from "buffer";

const app = express();

dotenv.config();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const hostname = "127.0.0.1";
const port = process.env.PORT || 5000;

const zappURL = "https://zapp-2112-kanal-d-drama.web.app/jw/media/"; // https://zapp-2112-kanal-drama.web zapp middleware for getting media information

let filterByUser = true; // this is used to return records by user or all registered records
const usersArray = []; // this stores the information received from the apps grouped by user

const dataArray = []; // this stores the information received from the apps not grouped by user

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

app.get("/all_records", (req, res) => {
  // returns all records send by the apps
  //const testBody = JSON.stringify(req.body);
  //console.log(testBody);
  console.log("GetAll_records");
  const dataToReturn = {
    entry: usersArray,
  };
  //console.log("ctx: "+ req.query.ctx);
  res.send(dataToReturn);
  res.status(200).end();
});

app.get("/products", (req, res) => {
  // returns all records send by the apps depending on the filterByUser value: true = by user, false = all records
  console.log("New ",
    "GetRoot ",
    JSON.stringify(req.query),
    "body ",
    JSON.stringify(req.body),
    "params ",
    JSON.stringify(req.params),
    "Authorization ",
    JSON.stringify(req.authorization),
    "Headers ",
    JSON.stringify(req.headers)
  );
  //console.log('GetRoot ', req.query.ctx, "body ", JSON.stringify(req));
  /*const userId = req.query.ctx;
  /*const dataToReturn = {};
  // const userRecord = usersArray.find((userRecord)=> userRecord.id ===userId)
  /*if (filterByUser) {
    const userRecord = findUser(userId, true);
    if (!userRecord) {
      dataToReturn.entry = [];
    } else {
      dataToReturn.entry = userRecord.records;
    }
  } else {
    dataToReturn.entry = dataArray;
  }
  console.log(dataToReturn);*/
    const dataToReturn = {};
  dataToReturn.entry = [];
  res.send(dataToReturn);
  res.status(200).end();
});

app.post("/filter_by_user", (req, res) => {
  // when called, filterByUser is changed
  filterByUser = !filterByUser;
  res.send(filterByUser);
  res.status(200).end();
});

app.post("/", async (req, res) => {
  // registers the records to the array
  const dataToReturn = {
    specversion: req.body.specversion,
    type: req.body.type,
    source: "VM Backend Server",
    subject: "Event " + req.body.data.status + " was successfully received.",
    id: req.body.id,
    time: req.body.time,
  };
  if (req.body.data.status !== "VIDEO_STOPPED") {
    res.send(dataToReturn);
    res.status(201).end();
    return;
  }
  const url = zappURL + req.body.data.videoId;
  fetch(url)
    .then((response) => response.text())
    .then((data) => {
      const newData = JSON.parse(data);
      if (newData.hasOwnProperty("statusCode")) {
        if (newData.statusCode === 500) throw new Error(newData.message);
      }
      console.log("Stopped Event received");
      const userId = req.body.data.userIdentifier;
      const dataReceived = newData.entry[0];
      dataReceived.extensions.resumeLastUpdate = req.body.time;
      dataReceived.extensions.resumeTime = req.body.data.secondsFromStart;
      dataReceived.extensions.progress = req.body.data.progress;
      dataReceived.extensions.resumeCompleted =
        req.body.data.progress === 1 ? true : false;
      dataArray.push(dataReceived);
      const userRecord = findUser(userId, false);
      //const userRecord = usersArray.findIndex((userRecord)=> userRecord.id === userId);

      if (userRecord < 0) {
        //si el userId no existe
        const userInfo = {
          id: userId,
          records: [],
        };
        userInfo.records.push(dataReceived);
        usersArray.push(userInfo);
      } else {
        // si el userId existe
        usersArray[userRecord].records.push(dataReceived);
      }

      res.send(dataToReturn);
      res.status(201).end();
    })
    .catch((error) => {
      //console.log('Error:', error);
      res.send(error.message);
      res.status(500).end();
    });
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}/`);
});

const findUser = function (idUser, findRecords) {
  // if findRecords is true, returns records related to the user, if not, returns the index of the user.
  if (findRecords)
    return usersArray.find((userRecord) => userRecord.id === idUser);
  return usersArray.findIndex((userRecord) => userRecord.id === idUser);
};

/*const getDataFromRecord = function (record) {
  return {
    id: record.get("eventId"),
    extensions: {
      resumeLastUpdate: record.get("time"),
      resumeTime: record.get("secondsFromStart"),
      progress: record.get("progress"),
      resumeCompleted: false,
    },
  };
};*/
