const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
	name: { type: String, required: true, maxLength: 50 },
	messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
});

UserSchema.virtual('url').get(function () {
	return `/user/${this._id}`;
});

module.exports = mongoose.model('User', UserSchema);
