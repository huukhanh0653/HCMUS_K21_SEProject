const express = require('express');
const FriendshipService = require('../services/FriendshipService');
const router = express.Router();

router.post('/add', async (req, res) => {
  try {
    const { userID, friendID } = req.body;
    const friendship = await FriendshipService.addFriend(userID, friendID);
    res.status(201).json(friendship);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:userID', async (req, res) => {
  try {
    const friends = await FriendshipService.getFriends(req.params.userID);
    res.json(friends);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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