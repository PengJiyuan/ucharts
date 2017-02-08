
function Legend(world, stage) {
	this.world = world;
	this.stage = stage;
}

Legend.prototype = {

	init: function(series) {

		var _this = this;
		var width = this.world.width;
		var sx, sy, startX, startY, count;
		var turn = -1;
		if(width <= 300) {
			sx = 100;
			sy = 40;
		} else if(width <= 500) {
			sx = 300;
			sy = 16;
		} else if(width <= 800) {
			sx = 400;
			sy = 16;
		} else {
			sx = 500;
			sy = 16;
		}
		count = Math.floor((width - sx) / 80);

		series.forEach(function(item, index) {
			if( (index) % count === 0 ) {
				turn++;
			}
			startX = sx + 80*(index - count*turn);
			startY = sy + 20*turn;

			_this.stage.addChild(
				_this.world.textColor({
					startX: startX,
					startY: startY,
					label: '代码表',
					color: item.color,
					type: item.type
				}).config({
					fixed: false,
					drag: false,
					zindex: 10
				})
			);

		});

	}

}

module.exports = Legend;