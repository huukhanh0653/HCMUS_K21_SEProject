const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./utils/db");
const userRoutes = require("./routes/userRoutes");

dotenv.config();

const app = express();
connectDB();

app.use(express.json());

app.use("/", userRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
