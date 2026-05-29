module.exports = {
  "development": {
    "username": "root",
    "password": "Jaskaran@123", // Or whatever your local MySQL password is
    "database": "Flights", // Make sure this is the correct local DB name for this service!
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": process.env.DB_USER,
    "password": process.env.DB_PASS,
    "database": process.env.DB_NAME,
    "host": process.env.DB_HOST,
    "port": process.env.DB_PORT,
    "dialect": "mysql"
  }
}
