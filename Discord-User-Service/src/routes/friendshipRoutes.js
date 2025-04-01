const express = require('express');
const FriendshipService = require('../services/FriendshipService');
const router = express.Router();

/**
 * @swagger
 * /friendships/add:
 *   post:
 *     summary: Add a friend
 *     tags: [Friendships]
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
router.post('/add', async (req, res) => {
  try {
    const { userID, friendID } = req.body;
    const friendship = await FriendshipService.addFriend(userID, friendID);
    res.status(201).json(friendship);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /friendships/{userID}:
 *   get:
 *     summary: Get a user's friends
 *     tags: [Friendships]
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
 *                 $ref: '#/components/schemas/Friendship'
 */
router.get('/:userID', async (req, res) => {
  try {
    const friends = await FriendshipService.getFriends(req.params.userID);
    res.json(friends);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /friendships/remove:
 *   delete:
 *     summary: Remove a friend
 *     tags: [Friendships]
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
router.delete('/remove', async (req, res) => {
  try {
    const { userID, friendID } = req.body;
    await FriendshipService.removeFriend(userID, friendID);
    res.json({ message: 'Friend removed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /friendships/request:
 *   post:
 *     summary: Send a friend request
 *     tags: [Friendships]
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
router.post('/request', async (req, res) => {
  try {
    const { userID, friendID } = req.body;
    const request = await FriendshipService.sendFriendRequest(userID, friendID);
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /friendships/requests/{userID}:
 *   get:
 *     summary: Get friend requests for a user
 *     tags: [Friendships]
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
router.get('/requests/:userID', async (req, res) => {
  try {
    const requests = await FriendshipService.getFriendRequests(req.params.userID);
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /friendships/request/accept:
 *   post:
 *     summary: Accept a friend request
 *     tags: [Friendships]
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
router.post('/request/accept', async (req, res) => {
  try {
    const { requestID } = req.body;
    await FriendshipService.acceptFriendRequest(requestID);
    res.json({ message: 'Friend request accepted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /friendships/request/decline:
 *   post:
 *     summary: Decline a friend request
 *     tags: [Friendships]
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
router.post('/request/decline', async (req, res) => {
  try {
    const { requestID } = req.body;
    await FriendshipService.declineFriendRequest(requestID);
    res.json({ message: 'Friend request declined successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;