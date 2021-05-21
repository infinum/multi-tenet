const path = require('path');

module.exports = {
	target: 'node',
	entry: path.join(__dirname, 'src', 'index.js'),
	output: {
		path: path.join(__dirname, 'dist'),
	},
};
