const express = require("express");
const FriendService = require("../services/FriendService");
const router = express.Router();

/**
 * @swagger
 * /api/friends/add:
 *   post:
 *     summary: Add a friend
 *     tags: [Friends]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userID:
 *                 type: string
 *               friendID:
 *                 type: string
 *     responses:
 *       201:
 *         description: Friend added successfully
 */
router.post("/add", async (req, res) => {
  try {
    const { userID, friendID } = req.body;
    const friend = await FriendService.addFriend(userID, friendID);
    res.status(201).json(friend);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/friends/{userID}:
 *   get:
 *     summary: Get a user's friends
 *     tags: [Friends]
 *     parameters:
 *       - in: path
 *         name: userID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of user's friends
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Friend'
 */
router.get("/:userID", async (req, res) => {
  try {
    const friends = await FriendService.getFriends(req.params.userID);
    res.json(friends.map((friend) => friend.get({ plain: true })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/friends/remove:
 *   delete:
 *     summary: Remove a friend
 *     tags: [Friends]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userID:
 *                 type: string
 *               friendID:
 *                 type: string
 *     responses:
 *       200:
 *         description: Friend removed successfully
 */
router.delete("/remove", async (req, res) => {
  try {
    const { userID, friendID } = req.body;
    await FriendService.removeFriend(userID, friendID);
    res.json({ message: "Friend removed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/friends/request:
 *   post:
 *     summary: Send a friend request
 *     tags: [Friends]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userID:
 *                 type: string
 *               friendID:
 *                 type: string
 *     responses:
 *       201:
 *         description: Friend request sent successfully
 */
router.post("/request", async (req, res) => {
  try {
    const { userID, friendID } = req.body;
    const request = await FriendService.sendFriendRequest(userID, friendID);
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/friends/requests/{userID}:
 *   get:
 *     summary: Get friend requests for a user
 *     tags: [Friends]
 *     parameters:
 *       - in: path
 *         name: userID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of friend requests
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FriendRequest'
 */
router.get("/requests/:userID", async (req, res) => {
  try {
    const requests = await FriendService.getFriendRequests(req.params.userID);
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/friends/request/accept:
 *   post:
 *     summary: Accept a friend request
 *     tags: [Friends]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               requestID:
 *                 type: string
 *     responses:
 *       200:
 *         description: Friend request accepted successfully
 */
router.post("/request/accept", async (req, res) => {
  try {
    const { requestID } = req.body;
    await FriendService.acceptFriendRequest(requestID);
    res.json({ message: "Friend request accepted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/friends/request/decline:
 *   post:
 *     summary: Decline a friend request
 *     tags: [Friends]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               requestID:
 *                 type: string
 *     responses:
 *       200:
 *         description: Friend request declined successfully
 */
router.post("/request/decline", async (req, res) => {
  try {
    const { requestID } = req.body;
    await FriendService.declineFriendRequest(requestID);
    res.json({ message: "Friend request declined successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
