const axios = require("axios");
const express = require("express");
const app = express();
const db = require("./db");

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/check/:username", async (req, res) => {
  const username = req.params.username?.replace(/ /g, "") || null;
  if (!username) return res.sendStatus(404);
  const api = "https://passport.twitch.tv/usernames/" + username;
  const check = await axios(api);
  let response = {
    username,
    message: null,
    error: null
  };
  switch (check.status) {
    case 200:
      db.add(username)
        .then(console.log)
        .catch(console.log);
      response.message = "Username is not currently available";
      break;
    case 204:
      response.message = "Username is available";
      break;
    default:
      response.error = "An error has occurred please try again";
      break;
  }
  return res.json(response);
});

app.get("/all", async (req, res) => {
  res.send(await db.all());
});

app.get("/:username", async (req, res) => {
  res.send(await db.findOne(req.params.username));
});

app.post("/:username", async (req, res) => {
  res.send(await db.add(req.params.username));
});

app.delete("/:username", async (req, res) => {
  res.send(await db.del(req.params.username));
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
