const Message = require('../models/message');
const User = require('../models/user');
const asyncHandler = require('express-async-handler');

// Display all messages
exports.message_list = asyncHandler(async (req, res, next) => {
	const allMessages = await Message.find().populate('sender').exec();
	res.render('index', {
		title: `Breadcrumbs`,
		messages: allMessages,
	});
});
