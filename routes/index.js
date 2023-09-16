const express = require('express');
const router = express.Router();

const message_controller = require('../controllers/messageController');

/* GET home page. */
router.get('/', message_controller.message_list);

module.exports = router;
