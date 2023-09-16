const Message = require('../models/message');
const User = require('../models/user');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

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

// Handle create message POST request
exports.message_create_post = [
	// Validate and sanitize form data

	body('name')
		.trim()
		.isLength({ min: 1 })
		.escape()
		.withMessage('Username must be specified')
		.isAlphanumeric()
		.withMessage('First name has non-alphanumeric characters.'),
	body('text')
		.trim()
		.isLength({ min: 1 })
		.escape()
		.withMessage('Message can not be empty'),

	// Process request
	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);

		// Create User

		const user = new User({
			name: req.body.name,
		});
		// Create message
		const message = new Message({
			text: req.body.text,
			sender: user._id,
		});
		// Errors are present
		if (!errors.isEmpty()) {
			res.render('message_form', {
				title: `Add New Message`,
				message: message,
				errors: errors.array(),
			});
		} else {
			// Data is valid
			await user.save();
			await message.save();
			const sender = await User.findById(user._id);
			await sender.messages.push(message);
			await sender.save();
			res.redirect('/');
		}
	}),
];
