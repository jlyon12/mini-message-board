const { DateTime } = require('luxon');

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
	text: { type: String, required: true },
	sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	timestamp: { type: Date, default: new Date() },
});

MessageSchema.virtual('timestamp_formatted').get(function () {
	return DateTime.fromJSDate(this.timestamp).toLocaleString(
		DateTime.DATETIME_FULL
	);
});

module.exports = mongoose.model('Message', MessageSchema);
