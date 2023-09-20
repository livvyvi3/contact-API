const axios = require("axios");
require("dotenv").config();

const hubSpotApiKey = process.env.HUBSPOT_KEY;
const pipedriveApiKey = process.env.PIPE_DRIVE_KEY;


axios
  .get(`https://api.pipedrive.com/v1/persons?api_token=${pipedriveApiKey}`)
  .then((response) => {
    const contactData = response.data.data;

  
    contactData.forEach((contact) => {
      const email = contact.email[0] ? contact.email[0].value : "";
      const phone = contact.phone[0] ? contact.phone[0].value : "";
      const firstname = contact.first_name || '';

      const hubSpotContactData = {
        properties: {
          firstname,
          email,
          phone,

        },
      };
      
      axios
        .post("https://api.hubapi.com/crm/v3/objects/contacts", hubSpotContactData, {
          headers: {
            accept: "application/json",
            "content-type": "application/json",
            authorization: `Bearer ${hubSpotApiKey}`,
          },
        })
        .then((hubSpotResponse) => {
          console.log("Contact created in HubSpot:", hubSpotResponse.data);
        })
        .catch((hubSpotError) => {
          console.error("Error creating contact in HubSpot:", hubSpotError);
        });
    });
  })
  .catch((error) => {
    console.error("Error fetching data from Pipedrive:", error);
  });
