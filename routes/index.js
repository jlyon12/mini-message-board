const express = require('express');
const router = express.Router();

const messageController = require('../controllers/messageController');

/* GET home page. */
router.get('/', messageController.message_list);

/* GET add message page. */
router.get('/new', messageController.message_create_get);

/* POST add message page. */
router.post('/new', messageController.message_create_post);

/* GET user messages page. */
router.get('/user/:id', messageController.message_user_get);

module.exports = router;
