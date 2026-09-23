const express = require("express");

const userRoutes = require("./routes/use.routes");
const postRoutes = require("./routes/post.routes");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { checkUser, requireAuth } = require("./middleware/auth.middleware");

require("dotenv").config({ path: "./config/.env" });
require("./config/db");

const app = express();

// Middleware pour lire le JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());

// JWT
app.use(checkUser);

app.get("/jwtid", requireAuth, (req, res) => {
  res.status(200).json({
    id: req.user._id,
  });
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/post", postRoutes);

// Démarrage du serveur)

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});