let express = require("express");
let app = express();
let { open } = require("sqlite");
app.listen(3000, () => {
  console.log("server ON");
});
let sqlite3 = require("sqlite3");
let path = require("path");
let dbPath = path.join(__dirname, cricketTeam.db);
let db = null;
let connectDatabase = async () => {
  try {
    db = await open({
      filename: dbPath,
      drive: sqlite3.Database,
    });
  } catch (err) {
    console.log(`there is an ${err.message}`);
    process.exit(1);
  }
};
connectDatabase();
app.get("/players/", async (request, response) => {
  const query = `
         SELECT *
         FROM cricket_team`;
  const playersList = await db.all(query);
  response.send(playersList);
  console.log(playersList);
});
modules.exports = app;
