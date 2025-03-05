const User = require("../models/User");
const esClient = require("../utils/elastic_search");
const bcrypt = require("bcryptjs");

const createUser = async (req, res) => {
  const { username, password, email, status } = req.body;
  try {
    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashPassword,
      email,
      status,
    });

    await newUser.save();

    await esClient.index({
      index: "users",
      id: newUser._id.toString(),
      body: {
        username: newUser.username,
        email: newUser.email,
        status: newUser.status,
      },
    });

    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

const searchUser = async (req, res) => {
  const { query } = req.query;
  try {
    const result = await esClient.search({
      index: "users",
      body: {
        query: {
          multi_match: {
            query: query,
            fields: ["username", "email"],
          },
        },
      },
    });

    if (result.body.hits.total.value === 0) {
      return res.status(404).send("No users found");
    }

    res.status(200).json(result.body.hits.hits);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

module.exports = { createUser, searchUser };
