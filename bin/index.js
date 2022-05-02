#!/usr/bin/env node

const mysql = require("mysql");
const mySqlEvents = require("@rodrigogs/mysql-events");
const dotenv = require('dotenv');
const sqlite3 = require('sqlite3').verbose();

const exec = async () => {
   dotenv.config();

   const connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PW
   });
   
   const instance = new mySqlEvents(connection, {
      startAtEnd: true
   });

   await instance.start();

   instance.addTrigger({
      name: "monitoring all statements",
      expression: "da-adkr.empl",
      statement: mySqlEvents.STATEMENTS.ALL,
      onEvent: (event) => {
         insertHistoryEntry(event);
      }
   })
};

const insertHistoryEntry = (event) => {
   console.dir(event)

   event.affectedRows.forEach(e => {
      const before = e.before;
      const after = e.after;

      const db = new sqlite3.Database("tableWatchDb.db");
      const currentTimeStamp = Date.now().toString();

      if (before) {
         db.run("UPDATE empl_history SET ValidTo = $validTo WHERE HistoryId = (SELECT HistoryId from empl_history WHERE ID = $id AND Name = $name AND Position = $position and validTo IS NULL)", {
            $validTo: currentTimeStamp,
            $id: before.Id,
            $name: before.Name,
            $position: before.Position
         });
      }

      if (after) {
         db.run("INSERT INTO empl_history (Id, Name, Position, ValidFrom) VALUES ($id, $name, $position, $validFrom)", {
            $id: after.Id,
            $name: after.Name,
            $position: after.Position,
            $validFrom: currentTimeStamp
         });
      }

      db.close();
   });

};

exec();