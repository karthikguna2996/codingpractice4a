let express = require("express");
let app = express();
let { open } = require("sqlite");
let sqlite3 = require("sqlite3");
let path = require("path");
let dbPath = path.join(__dirname, "cricketTeam.db");
let db = null;
let connectDatabase = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3003, () => {
      console.log("server started");
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
         FROM cricket_team;`;
  const playersList = await db.all(query);
  console.log(playersList);
  let ans = {
    playerId: playersList.player_id,
    playerName: playersList.player_name,
    jerseyNumber: playersList.jersey_number,
    role: playersList.role,
  };
  let playerNameList = playersList.map((val) => {
    let ans = {
      playerId: val.player_id,
      playerName: val.player_name,
      jerseyNumber: val.jersey_number,
      role: val.role,
    };
    return ans;
  });
  response.send(playerNameList);
  console.log(playerNameList);
});
modules.exports = app;
