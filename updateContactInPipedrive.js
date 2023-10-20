/*
    Script updates contact in Pipedrive, 
    it hardcodes name values, email and the contact ID to be updated
*/


const axios = require("axios");
require("dotenv").config();

const pipedriveApiKey = "b663bd1c30aba238811111baff2fff7347aad810";

const updateContactInPipedrive = async (pipedriveContactId, updatedData) => {
  try {
    const response = await axios.put(
      `https://api.pipedrive.com/v1/persons/2726?api_token=${pipedriveApiKey}`,
      updatedData,
      {
        headers: {
          accept: "application/json",
         
        },
      }
    );
    console.log("Contact updated in Pipedrive:", response.data);
  } catch (error) {
    console.error("Error updating contact in Pipedrive:", error);
    throw error;
  }
};

(async () => {
  try {
    const pipedriveContactId = 2726; 

    const updatedPipedriveContact = {
      name: "Nandi Tshabalala", 
    };

    await updateContactInPipedrive(pipedriveContactId, updatedPipedriveContact);
  } catch (error) {
    console.error("Error updating contact:", error);
  }
})();
