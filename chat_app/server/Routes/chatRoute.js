const express = require('express');
const router = express.Router();
const { createChat, findUserChat, findChat } = require('../Controllers/chatController');

router.post("/", createChat);
router.get("/:userId", findUserChat);
router.get("/find/:firstId/:secondId", findChat);

module.exports = router;

 

