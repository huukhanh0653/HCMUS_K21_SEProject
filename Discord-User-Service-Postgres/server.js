require("dotenv").config();
const PORT = 8087;
const express = require("express");
const cors = require("cors");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const userRoutes = require("./src/routes/userRoutes");
const friendRoutes = require("./src/routes/friendRoutes");
const sequelize = require("./src/config/postgres");

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: "GET, POST, PUT, DELETE",
    allowedHeaders: "Content-Type, Authorization",
  })
);

// Kiểm tra kết nối PostgreSQL
sequelize
  .authenticate()
  .then(() => console.log("PostgreSQL connected"))
  .catch((err) => console.error("PostgreSQL connection error:", err));

// Đồng bộ models với database
sequelize
  .sync({ force: false })
  .then(() => console.log("Database synced"))
  .catch((err) => console.error("Database sync error:", err));

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "User and Friend API",
      version: "1.0.0",
      description: "API for managing users and friends",
    },
    servers: [{ url: `http://localhost:${PORT}` }],
  },
  apis: ["./src/routes/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use("/api/users", userRoutes);
app.use("/api/friends", friendRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
