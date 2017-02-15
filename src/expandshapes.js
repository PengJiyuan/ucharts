
var LCL = require('lcl');

function expand(world, expand) {
	LCL.prototype[expand.name] = expand.shape.bind(world);
	var isPointInner = expand.isPointInner.bind(world);
	world.pointerInnerArray.push({
		type: expand.name,
		isPointInner: isPointInner
	})
}

module.exports = expand;