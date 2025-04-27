import express from "express";
import cors from "cors";
const app = express();
import {connectDB,sequelize} from "./config/database.js"
import tenantRoutes from "./routes/tenantRoutes.js";


  connectDB();
  app.use(cors());
  
  app.use(express.json());

app.use('/api/tenants',tenantRoutes)

app.listen(3000, ()=> {
    console.log("Server running on port 3000");
    sequelize.sync().then(() => console.log("Database synced!!"));
});