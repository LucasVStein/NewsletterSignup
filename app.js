const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const mailchimp = require('@mailchimp/mailchimp_marketing');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res) {
  res.sendFile(__dirname+"/signup.html");
})

mailchimp.setConfig({
  apiKey: "17b836998b07b4f1dfe9d526cc027b26-us20",
  server: "us20",
});

app.post("/", function(req, res) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const userEmail = req.body.userEmail;

  const listId = "dd4c501fb9";

  const run = async function() {
    try {
      const response = await mailchimp.lists.addListMember(listId,
      {
        email_address: userEmail,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      })
      res.sendFile(__dirname+"/success.html");
    } catch (e) {
      if (e.status !== 200) {
        console.log(e);
        res.sendFile(__dirname+"/failure.html");
      }
    }
  }
  run();
})

app.post("/failure", function(req, res) {
  res.redirect("/");
})

app.listen(process.env.PORT || 3000, function() {
  console.log("server is running on port 3000.");
})
