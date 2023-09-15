#! /usr/bin/env node
// This script has been modified from the original script provided by the MDN project
// source article: https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose
// source code: https://raw.githubusercontent.com/mdn/express-locallibrary-tutorial/main/populatedb.js

console.log(
	'This script populates some test messages and users to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://username:password@cluster0.lz91hw2.mongodb.net/database_name?retryWrites=true&w=majority"'
);

const userArgs = process.argv.slice(2);

const User = require('./models/user');
const Message = require('./models/message');

const users = [];
const messages = [];

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
	console.log('Debug: About to connect');
	await mongoose.connect(mongoDB);
	console.log('Debug: Should be connected?');
	await createUsers();
	await createMessages();
	console.log('Debug: Closing mongoose');
	mongoose.connection.close();
}

async function userCreate(index, name) {
	const userDetail = {
		name: name,
	};

	const user = new User(userDetail);

	await user.save();
	users[index] = user;
	console.log(`Added user: ${name}`);
}

async function messageCreate(index, text, user) {
	const messageDetail = {
		text: text,
		sender: user,
	};

	const message = new Message(messageDetail);

	await message.save();
	const sender = await User.findById(user._id);
	await sender.messages.push(message);
	await sender.save();

	messages[index] = message;
	console.log(`Added message: ${text}`);
}

async function createUsers() {
	console.log('Adding users');
	await Promise.all([
		userCreate(0, 'Abe'),
		userCreate(1, 'Bob'),
		userCreate(2, 'Carl'),
		userCreate(3, 'Dean'),
		userCreate(4, 'Eric'),
		userCreate(5, 'Frank'),
	]);
}

async function createMessages() {
	console.log('Adding messages');
	await Promise.all([
		messageCreate(
			0,
			'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum, minus.',
			users[0]
		),
		messageCreate(
			1,
			'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum, minus.',
			users[1]
		),
		messageCreate(
			2,
			'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum, minus.',
			users[2]
		),
		messageCreate(
			3,
			'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum, minus.',
			users[3]
		),
		messageCreate(
			4,
			'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum, minus.',
			users[4]
		),
		messageCreate(
			5,
			'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum, minus.',
			users[5]
		),
		messageCreate(
			6,
			'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum, minus.',
			users[0]
		),
		messageCreate(
			7,
			'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum, minus.',
			users[0]
		),
		messageCreate(
			8,
			'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum, minus.',
			users[1]
		),
		messageCreate(
			9,
			'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum, minus.',
			users[1]
		),
		messageCreate(
			10,
			'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum, minus.',
			users[2]
		),
		messageCreate(
			11,
			'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum, minus.',
			users[3]
		),
	]);
}
