const express = require("express");
const axios = require("axios");

const app = express();
const PORT = 3000;

const pipedriveApiKey = "REPLACE_WITH_YOUR_OWN_KEY";



app.get("/", (req, res) => {
  axios
    .get(`https://api.pipedrive.com/v1/persons?api_token=${pipedriveApiKey}`)
    .then((response) => {
      const persons = response.data.data;
      const allEmails = [];

      // Extract emails from each person
      for (let i = 0; i < persons.length; i++) {
        const emailObject = persons[i].email[0];
        if (emailObject) {
          const emailValue = emailObject.value;
          allEmails.push(emailValue);
        }
      }

      // Extract names from each person
      const names = persons.map((person) => ({
        name: person.name
      }));

      res.json({ names, emails: allEmails });
    })
    .catch((error) => {
      res.status(500).send("Error fetching data");
    });
});

app.listen(PORT, () =>
  console.log(`Server running on port: http://localhost:${PORT}`)
);

