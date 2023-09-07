const express = require("express");
const axios = require("axios");

const app = express();
const PORT = 3000;

const pipedriveApiKey = "5371394d33d2c40586b87613c27754b053eea2e1";

/*
axios
.get("https://api.pipedrive.com/v1/persons?api_token=5371394d33d2c40586b87613c27754b053eea2e1")
.then((result) => {
  console.log(result.data);
  app.get('/contacts', (req,res) => {
    res.send(result.data)
  });
})
.catch((err) => {
  console.log(err);
});
*/

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

