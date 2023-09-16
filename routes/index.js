const express = require('express');
const router = express.Router();

const message_controller = require('../controllers/messageController');

/* GET home page. */
router.get('/', message_controller.message_list);

/* GET add message page. */
router.get('/new', message_controller.message_create_get);

module.exports = router;
