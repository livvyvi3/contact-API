const axios = require("axios");
const fs = require("fs").promises;
require("dotenv").config();

const pipedriveApiKey = process.env.PIPE_DRIVE_KEY;
const personId = 1963;

fs.readFile("data.json", "utf8")
  .then((data) => {
    const updatedData = JSON.parse(data);

    const updatePersonURL = `https://api.pipedrive.com/v1/persons/${personId}?api_token=${pipedriveApiKey}`;

    axios
      .put(updatePersonURL, updatedData)
      .then((response) => {
        console.log("Person updated in Pipedrive:", response.data);
      })
      .catch((error) => {
        console.error("Error updating person in Pipedrive:", error);
      });
  })
  .catch((error) => {
    console.error("Error reading data from JSON file:", error);
  });
