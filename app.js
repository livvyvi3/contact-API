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

    // Extract  name and email from each person
    const names = persons.map((person) => ({
      name: person.name,
      email: person.email,
    }));

    res.json(names);
    })
    .catch((error) => {
      res.status(500).send("Error fetching data");
    });
});

app.listen(PORT, () =>
  console.log(`Server running on port: http://localhost:${PORT}`)
);
