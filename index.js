const axios = require("axios");
require("dotenv").config();

const hubSpotApiKey = process.env.HUBSPOT_API_KEY;
const pipedriveApiKey = process.env.PIPE_DRIVE_KEY;

const doesEmailExistInPipedrive = async (email) => {
  try {
    const response = await axios.get(
      `https://api.pipedrive.com/v1/persons/find?term=${email}&api_token=${pipedriveApiKey}`
    );

    const existingContact = response.data.data;

    return existingContact.length > 0;
  } catch (error) {
    console.error("Error checking email in Pipedrive:", error);
    return false;
  }
};

const createContactInPipedrive = async (contactData) => {
  try {
    const emailExists = await doesEmailExistInPipedrive(contactData.email);

    if (emailExists) {
      console.log(
        "Email address already exists in Pipedrive for:",
        contactData.email
      );
    } else {
      const response = await axios.post(
        `https://api.pipedrive.com/v1/persons?api_token=${pipedriveApiKey}`,
        contactData
      );

      console.log("Contact created in Pipedrive:", response.data);
    }
  } catch (error) {
    console.error("Error creating contact in Pipedrive:", error);
  }
};

const transferContacts = async () => {
  try {
    let offset = 0;
    let totalContacts = 0;

    while (true) {
      const hubSpotResponse = await axios.get(
        `https://api.hubapi.com/crm/v3/objects/contacts?limit=100&offset=${offset}`,
        {
          headers: {
            accept: "application/json",
            authorization: `Bearer ${hubSpotApiKey}`,
          },
        }
      );
      const hubSpotContacts = hubSpotResponse.data.results;

      if (hubSpotContacts.length === 0) {
        break;
      }

      for (const contact of hubSpotContacts) {
        const email = contact.properties.email;
        const phone = contact.properties.phone;
        const id = contact.properties.id;
        const firstname = contact.properties.firstname || "";
        const lastname = contact.properties.lastname || "";

        const pipedriveContactData = {
          name: `${firstname} ${lastname}`,
          first_name: firstname,
          last_name: lastname,
          email: email,
          phone: phone,
          'a45403d925ddb8b89b6c347b1898891d5d7f921c': id,
        };

        await createContactInPipedrive(pipedriveContactData);
        totalContacts++;

        if (hubSpotContacts.length < 100) {
          
          console.log("Reached the end of contacts in HubSpot.");
          return;
        }
      }

      offset += 100;
    }
  } catch (error) {
    console.error("Error fetching data from HubSpot:", error);
  }
};

transferContacts();
