const express = require("express");
const app = express();
const { connectDB,sequelize} = require("./config/database")

  connectDB();

app.listen(3000, ()=> {
    console.log("Server running on port 3000");
  
    sequelize.sync().then(() => console.log("Database synced!!"));
});
