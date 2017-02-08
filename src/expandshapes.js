
var textColor = require('./shapes/text_color.js');
var LCL = require('lcl');

function expand(world) {
	LCL.prototype.textColor = textColor.bind(world);
}

module.exports = expand;