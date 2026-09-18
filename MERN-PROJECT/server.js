require("dotenv").config({ path: "./config/.env" });

const express = require("express");
const userRoutes = require("./routes/use.routes");

require("./config/db");

const app = express();

// Middleware pour lire le JSON
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});