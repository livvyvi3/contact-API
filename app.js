const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = 8080;

const pipedriveApiKey = process.env.PIPE_DRIVE_KEY; // REPLACE_WITH_YOUR_OWN_KEY
const hubSpotApiKey = process.env.HUBSPOT_KEY; // REPLACE_WITH_YOUR_HUBSPOT_API_KEY
const hubSpotContactEndpoint = "https://api.hubapi.com/crm/v3/objects/contacts?limit=10&archived=false";

app.get("/", async (req, res) => {
  try {
    const pipedriveResponse = await axios.get(
      `https://api.pipedrive.com/v1/persons?api_token=${pipedriveApiKey}`
    );

    if (pipedriveResponse.status === 200) {
      const persons = pipedriveResponse.data.data;

      const hubSpotContacts = persons.map((person) => {
        return {
          properties: {
            firstname: person.first_name,
            lastname: person.last_name,
            email: person.email[0] ? person.email[0].value : "",
          },
        };
      });

      // Import contacts into HubSpot
      const hubSpotImportResponse = await axios.post(
        hubSpotContactEndpoint,
        hubSpotContacts,
        {
          headers: {
            accept: "application/json",
            "content-type": "application/json",
            authorization: `Bearer ${hubSpotApiKey}`,
          },
        }
      );

      if (hubSpotImportResponse.status === 200) {
        res.status(200).json({ message: "Contacts imported successfully" });
      } else {
        res
          .status(500)
          .json({ message: "Error importing contacts into HubSpot" });
      }
    } else {
      res.status(500).json({ message: "Error fetching data from Pipedrive" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(PORT, () =>
  console.log(`Server running on port: http://localhost:${PORT}`)
);
