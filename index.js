const axios = require("axios");
require("dotenv").config();

const hubSpotApiKey = process.env.HUBSPOT_KEY;
const pipedriveApiKey = process.env.PIPE_DRIVE_KEY;


axios
  .get(`https://api.pipedrive.com/v1/persons?api_token=${pipedriveApiKey}`)
  .then((response) => {
    const contactData = response.data.data;
    const customFieldKeyAccMng = '44290adcd518424a6c0be10c17b8f33eb1772264';
    const cstmFieldAddress = '68cb673c52c6f5143479e1f9d5cf68dcecf0b29e_route';

  
    contactData.forEach((contact) => {
      const email = contact.email[0] ? contact.email[0].value : "";
      const phone = contact.phone[0] ? contact.phone[0].value : "";
      const firstname = contact.first_name || '';
      const lastname = contact.last_name || '';

      const country = contact['68cb673c52c6f5143479e1f9d5cf68dcecf0b29e_country'] || '';
      const account_manager = contact['44290adcd518424a6c0be10c17b8f33eb1772264'] || '';
      const address = contact['68cb673c52c6f5143479e1f9d5cf68dcecf0b29e'] || '';
      
      const fullname = `${firstname} ${lastname}`;

      const hubSpotContactData = {
        properties: {
          firstname: fullname, 
          email,
          phone,
          country: country,
          account_manager,
          address,
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
