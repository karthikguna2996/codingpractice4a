let express = require("express");
let app = express();
app.use(express.json());
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
app.post("/players/", async (request, response) => {
  let addPlayerDetails = request.body;
  console.log(addPlayerDetails);
  let { playerName, jerseyNumber, role } = addPlayerDetails;
  console.log();
  let addQuery = `
              INSERT INTO
                 cricket_team (player_name,jersey_number,role)
              VALUES
              (  
                  '${playerName}',
                  ${jerseyNumber},
                  '${role}'
              );
    `;
  await db.run(addQuery);
  response.send("Player Added to Team");
});

app.get("/players/:playerId/", async (request, response) => {
  let { playerId } = request.params;
  console.log(playerId);
  let idQuery = `
                SELECT *
                FROM cricket_team
                WHERE player_id = ${playerId};`;
  let playerDetails = await db.get(idQuery);
  let singlePlayerDetail = {
    playerId: playerDetails.player_id,
    playerName: playerDetails.player_name,
    jerseyNumber: playerDetails.jersey_number,
    role: playerDetails.role,
  };
  response.send(singlePlayerDetail);
});

app.put("/players/:playerId/", async (request, response) => {
  let { playerId } = request.params;
  let putPlayerDetails = request.body;
  let { playerName, jerseyNumber, role } = putPlayerDetails;
  let putQuery = `UPDATE 
                          cricket_team
                        SET 
                           player_name = '${playerName}',
                           jersey_number = ${jerseyNumber},
                           role = '${role}'
                        WHERE
                           player_id = ${playerId};`;
  await db.run(putQuery);
  response.send("Player Details Updated");
});

app.delete("/players/:playerId/", async (request, response) => {
  let { playerId } = request.params;
  let deleteQuery = `
     DELETE FROM cricket_team
      WHERE player_id = ${playerId};`;
  await db.run(deleteQuery);
  response.send("Player Removed");
});

module.exports = app;


