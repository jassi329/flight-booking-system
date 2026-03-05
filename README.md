this is the base node js project tempelate, it can be used in any project

"src" -> all the actual source code, not include any kind of test

"config" -> in this folder anything and everything reagarding and config or setup of lib or mod will be done. for ex: setting up 'dotenv' so that we can use the enviorn var anywhere in a cleaner fashion. done in server config.js

routes -> we register a route and the corresponding middleware and controllers to it. 

middlewares-> they are just going to intercept the incoming req where we can write our validators, authenticators etc.

controllers -> they are kind of last middlewares as post them you call your buisness layer to execute the buisness logic.

repositories -> this contains all the logic using which we can interact the on by writing queries, all the raw queries or ORM queries will go here.

services -> contains the buiss logic and interact with ripositories for data from the database.

utils -> contains helper methods, error, classes etc.''

inside the 'src/config' folder create a file name 'config.json' and write the following codes
{
  "development": {
    "username": "root",
    "password": "mypassword",
    "database": "database_development",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}

if youre setting up your devel envior, then write the name of your db and pass of db and in direct mention of whatever db you are using ex: mysql, mariadb 
if youre setting up test or prd env, make sure you replace the 