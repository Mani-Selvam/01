const mongoose = require('mongoose');
const dbUrl = require('./config').dbUrl;

const connectDb = () => {
	mongoose
		.connect(
			dbUrl,
		)
        .then(() => {
			console.log('database connected');
		})
		.catch((e) => {
			console.trace('error connecting to mongo db ');
			console.log(e);
			process.exit(1);
		});
};

module.exports = connectDb;
