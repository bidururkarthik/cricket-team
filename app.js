const express = require("express");
const app = express();
app.use(express.json());
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const dbpath = path.join(__dirname, "cricketTeam.db");
let database = null;

const intiallandserver = async () => {
  try {
    database = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server running http://localhost");
    });
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

intiallandserver();

//get criket

const convertbdobjectresponse = (object) => {
  return {
    player_Id: object.player_id,
    player_name: object.player_name,
    jersey_number: object.jersey_number,
    role: object.role,
  };
};

app.get("/players/", async (request, response) => {
  const playerquery = `
    SELECT 
     * 
    FROM 
        cricket_team`;

  const dbresponse = await database.all(playerquery);
  response.send(
    dbresponse.map((eachplayer) => convertbdobjectresponse(eachplayer))
  );
});

app.get("/players/:playerId/", async (request, response) => {
  const playerquery = `
    SELECT 
     * 
    FROM 
        cricket_team
    WHERE
    player_id = ${playerId}
        `;

  const player = await database.all(playerquery);
  response.send(convertbdobjectresponse(player));
});

//post create
app.post("/players/", async (request, response) => {
  const { player_name, jersey_number, role } = request.body;
  const postquery = `INSERT INTO 
       cricket_team (player_name,jersey_number,role)
       VALUES (
        '${player_name}',
         ${jersey_number},
        '${role}'
       );
    `;
  const responseplayer = await database.run(postquery);
  response.send("Player Added to Team");
});

//put
app.put("/players/:playerId/", async (request, response) => {
  const { player_name, jersey_number, role } = request.body;
  const { playerId } = request.params;
  const updatequery = `
       UPDATE
          cricket_team
       SET 
          player_name = ${player_name},
          jersey_number = ${jersey_number},
          role = ${role}
       WHERE 
          player_id = ${playerId};       
    `;
  await database.run(updatequery);
  response.send("player Details Updates");
});

//delete
app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deletequery = `
       DELETE FROM cricket_team WHERE player_id = ${playerId}
    `;
  await database.run(deletequery);
  response.send("Player Removed");
});
