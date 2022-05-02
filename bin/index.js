#!/usr/bin/env node

const mysql = require("mysql");
const mySqlEvents = require("@rodrigogs/mysql-events");
const dotenv = require('dotenv');

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
      expression: "da-adkr.*",
      statement: mySqlEvents.STATEMENTS.ALL,
      onEvent: (event) => {
         console.dir(event);
      }
   })
};

exec();