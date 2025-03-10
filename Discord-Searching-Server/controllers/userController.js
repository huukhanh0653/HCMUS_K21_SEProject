const User = require("../models/User");
const esClient = require("../utils/elastic_search");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

const createUser = async (req, res) => {
  const { username, password, email, status } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      id: uuidv4(),
      username,
      password: hashPassword,
      email,
      status,
    });

    await newUser.save();

    await esClient.index({
      index: "users",
      id: newUser.id,
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

  if (!query || query.trim() === "") {
    return res.status(400).send("Query parameter is required");
  }

  try {
    const result = await esClient.search({
      index: "users",
      body: {
        query: {
          bool: {
            should: [
              { query_string: { query: `*${query}*`, fields: ["username"] } },
              { query_string: { query: `*${query}*`, fields: ["email"] } },
            ],
            minimum_should_match: 1,
          },
        },
      },
    });

    const totalHits = result.hits.total.value;
    if (totalHits === 0) {
      return res.status(404).send("No users found");
    }

    res.status(200).json(result.hits.hits);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

module.exports = { createUser, searchUser };
