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
		user: undefined,
		message: undefined,
		errors: undefined,
	});
});

// Handle create message POST request
exports.message_create_post = [
	// Validate and sanitize form data

	body('name')
		.trim()
		.isLength({ min: 1 })
		.escape()
		.withMessage('Username can not be empty'),
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
				user: user,
				errors: errors.array(),
			});
		} else {
			// Data is valid

			// Does username already exist?
			const userExists = await User.findOne({ name: req.body.name })
				.collation({ locale: 'en', strength: 2 })
				.exec();
			// Associate new message with existing user
			if (userExists) {
				await message.save();
				await Message.findByIdAndUpdate(message.id, { sender: userExists._id });
				const sender = await User.findById(userExists._id);
				await sender.messages.push(message);
				await sender.save();
			} else {
				// Associate new message with NEW user
				await user.save();
				await message.save();
				const sender = await User.findById(user._id);
				await sender.messages.push(message);
				await sender.save();
			}
			res.redirect('/');
		}
	}),
];

// Display user message GET request
exports.message_user_get = asyncHandler(async (req, res, next) => {
	const userMessages = await Message.find({ sender: req.params.id })
		.populate('sender')
		.exec();

	console.log(userMessages);
	res.render('message_list_user', {
		title: `Messages by ${userMessages[0].sender.name}`,
		messages: userMessages,
	});
});
