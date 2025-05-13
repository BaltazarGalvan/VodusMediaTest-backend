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

app.post("/event", (req, res) => {
  console.log("New event");
  console.log(
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
  
  const dataToReturn = {};
  dataToReturn.entry = [];
  res.send(dataToReturn);
  res.status(200).end();
});




app.get("/products", (req, res) => {
  const idToken = req.query;
  // returns all records send by the apps depending on the filterByUser value: true = by user, false = all records
  console.log("New query");
  console.log(
    "GetRoot ",
    JSON.stringify(req.query),
    "body ",
    JSON.stringify(req.body),
    "params ",
    JSON.stringify(req.params),
    "Authorization ",
    JSON.stringify(req.authorization),
    "Headers ",
    JSON.stringify(req.headers),
    "Token: ", idToken

    
  //return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());

    
  );

    const dataToReturn = {};
  dataToReturn.entry = [];
  res.send(dataToReturn);
  res.status(200).end();
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
