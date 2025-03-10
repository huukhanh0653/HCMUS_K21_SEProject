const express = require("express");
const { createUser, searchUser } = require("../controllers/userController");

const router = express.Router();

router.post("/users", createUser);

router.get("/users", searchUser);

module.exports = router;
