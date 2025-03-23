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

module.exports = router;