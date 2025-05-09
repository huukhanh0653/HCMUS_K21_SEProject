const express = require("express");
const UserService = require("../services/UserService");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 */

/**
 * @swagger
 * /api/users/sync-firebase:
 *   post:
 *     summary: Sync Firebase users with Postgres
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Firebase users synced successfully
 */
router.post("/sync-firebase", async (req, res) => {
  try {
    const result = await UserService.syncFirebaseUsers();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/users/firebase:
 *   get:
 *     summary: Get all users from Firebase Authentication
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of users from Firebase Authentication
 */
router.get("/firebase", async (req, res) => {
  try {
    const users = await UserService.getAllFirebaseUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users from database
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of users from database
 */
router.get("/", async (req, res) => {
  try {
    const users = await UserService.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               avatar:
 *                 type: string
 *               background:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 */
router.post("/", async (req, res) => {
  try {
    const { username, email, avatar, background } = req.body;
    const user = await UserService.createUser(
      username,
      email,

      avatar,
      background
    );
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/users/email/{email}:
 *   get:
 *     summary: Get a user by email
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: The user's email
 *     responses:
 *       200:
 *         description: The user object
 *       404:
 *         description: User not found
 */
router.get("/email/:email", async (req, res) => {
  try {
    const user = await UserService.getUserByEmail(req.params.email);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/users/username/{username}:
 *   get:
 *     summary: Get a user by username
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: The user's username
 *     responses:
 *       200:
 *         description: The user object
 *       404:
 *         description: User not found
 */
router.get("/username/:username", async (req, res) => {
  try {
    const user = await UserService.getUserByEmail(req.params.username);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: The user object
 *       404:
 *         description: User not found
 */
router.get("/:id", async (req, res) => {
  try {
    const user = await UserService.getUserBy_id(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               avatar:
 *                 type: string
 *               background:
 *                 type: string
 *               is_admin:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 */
router.put("/:id", async (req, res) => {
  try {
    const user = await UserService.updateUser(req.params.id, req.body);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
