const express = require("express");
const BlockService = require("../services/BlockService");
const router = express.Router();

/**
 * @swagger
 * /api/blocks:
 *   post:
 *     summary: Add a block
 *     tags: [Blocks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *               friend_id:
 *                 type: string
 *     responses:
 *       201:
 *         description: Block added successfully
 *       500:
 *         description: Error adding block
 */
router.post("/", async (req, res) => {
  try {
    const { user_id, friend_id } = req.body;
    const block = await BlockService.addBlock(user_id, friend_id);
    res.status(201).json(block);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/blocks:
 *   delete:
 *     summary: Remove a block
 *     tags: [Blocks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *               friend_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Block removed successfully
 *       500:
 *         description: Error removing block
 */
router.delete("/", async (req, res) => {
  try {
    const { user_id, friend_id } = req.body;
    const result = await BlockService.removeBlock(user_id, friend_id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/blocks/{user_id}:
 *   get:
 *     summary: Get a user's blocked friends
 *     tags: [Blocks]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of blocked friends
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get("/:user_id", async (req, res) => {
  try {
    const blockedFriends = await BlockService.getBlockedFriends(
      req.params.user_id
    );
    res.status(200).json(blockedFriends);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
