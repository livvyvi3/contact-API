const axios = require("axios");
require("dotenv").config();

const hubSpotApiKey = process.env.HUBSPOT_KEY;
const pipedriveApiKey = process.env.PIPE_DRIVE_KEY;
var http = require("https");

var options = {
  "method": "GET",
  "hostname": "api.hubapi.com",
  "port": null,
  "path": "/crm/v3/objects/contacts?limit=10&archived=false",
  "headers": {
    "accept": "application/json",
    authorization: `Bearer ${hubSpotApiKey}`,
  }
};

var req = http.request(options, function (res) {
  var chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function () {
    var body = Buffer.concat(chunks);
    console.log(body.toString());
  });
});

req.end();