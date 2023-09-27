const axios = require("axios");
require("dotenv").config();

const hubSpotApiKey = process.env.HUBSPOT_KEY;
const pipedriveApiKey = process.env.PIPE_DRIVE_KEY;


axios
  .get(`https://api.pipedrive.com/v1/persons?api_token=${pipedriveApiKey}`)
  .then((response) => {
    const contactData = response.data.data;
    const customFieldKeyAccMng = '44290adcd518424a6c0be10c17b8f33eb1772264';
    const cstmFieldAddress = '68cb673c52c6f5143479e1f9d5cf68dcecf0b29e_formatted_address';
    const cstmFieldAge = 'a44cf8ef829eca008a1ff13ed6d06b324552e7a3';
    const cusFieldCntry = '68cb673c52c6f5143479e1f9d5cf68dcecf0b29e_country';
    const cusFieldCity = '68cb673c52c6f5143479e1f9d5cf68dcecf0b29e_locality';
    const cusFieldDOB = 'ed2e83f6cf49cf7f2069d83759b26919a8725776';

  
    contactData.forEach((contact) => {
      const email = contact.email[0] ? contact.email[0].value : "";
      const phone = contact.phone[0] ? contact.phone[0].value : "";
      const firstname = contact.first_name || '';
      const lastname = contact.last_name || '';
      const country = contact[cusFieldCntry] || '';
      const account_manager = contact[customFieldKeyAccMng] || '';
      const address = contact[cstmFieldAddress] || '';
      const age = contact[cstmFieldAge] || '';
      const city = contact[cusFieldCity] || '';
      const birthday = contact[cusFieldDOB] || '';

      
      
      const fullname = `${firstname} ${lastname}`;

      const hubSpotContactData = {
        properties: {
          firstname: fullname, 
          email,
          phone,
          country: country,
          account_manager,
          address,
          age,
          city,
          birthday,
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
