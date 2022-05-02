# TableWatch

## Installation
To install all dependencies type the following command into the console:
```
npm i
```
As a second action you have to copy a *.env* file into the root folder of the project with the following arguments:
```
DB_HOST=******
DB_USER=******
DB_PW=******
```
# Running the program
To start the project you have to type the following command into the console:
```
node .
```
The parameter n is for the input you want to pass into the excel sheet.
Now you are able to see all INSERT, UPDATE and DELETE actions made on the permitted mySQL DB in the empl table. Every action will be printed out in the console and is stored as a history entry in the SQLite DB *tableWatchDb.db* of the project.