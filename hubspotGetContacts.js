const axios = require("axios");
require("dotenv").config();

const hubspotApiKey = process.env.HUBSPOT_API_KEY;

const getHubspotContacts = async () => {
  try {
    let allContacts = [];
    let offset = 70;
    let hasMore = true;

    while (hasMore) {
      const response = await axios.get(
        `https://api.hubapi.com/crm/v3/objects/contacts?count=100&limit=100&offset=${offset}`,
        {
          headers: {
            accept: "application/json",
            authorization: `Bearer ${hubspotApiKey}`,
          },
        }
      );

      const contacts = response.data.results;

      allContacts = allContacts.concat(contacts);

      if (contacts.length < 100) {
        console.log(contacts.length)
        hasMore = false;
      } else {
        offset += 100;
      }
    }

    console.log(allContacts);
    
  } catch (error) {
    console.error("Error getting contacts:", error);
  }
};

getHubspotContacts();


