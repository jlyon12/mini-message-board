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
// Display create message GET request
exports.message_create_get = asyncHandler(async (req, res, next) => {
	res.render('message_form', {
		title: `Add New Message`,
		message: undefined,
	});
});
