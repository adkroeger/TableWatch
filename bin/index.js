#!/usr/bin/env node

const mysql = require("mysql");
const mySqlEvents = require("@rodrigogs/mysql-events");

const exec = async () => {
   const connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root'
   });
   
   const instance = new mySqlEvents(connection, {
      startAtEnd: true
   });

   await instance.start();

   instance.addTrigger({
      name: "monitoring all statements",
      expression: "TestDb.*",
      statement: mySqlEvents.STATEMENTS.ALL,
      onEvent: (event) => {
         console.log(event);
      }
   })
};

exec();