
function Bar(world, stage) {
	this.world = world;
	this.stage = stage;
}

Bar.prototype = {

	init: function(option, index, coord) {
		var stage = this.stage;
		var world = this.world;
		var _series = option.series[index];
		// data's group count
		var barCount = this.getBarCount(option.series);
		// coordinate system -- length of xAxis
		var xLength = this.xLength = coord.xLength;
		// coordinate system -- length of yAxis
		var yLength = this.yLength = coord.yLength;
		// coordinate system -- count of xAxis interval
		var xSpace = coord.xSpace;
		// coordinate system -- count of yAxis interval
		var ySpace = coord.ySpace;
		// coordinate system -- length of each xAxis interval
		var xGapLength = coord.xGapLength;
		// coordinate system -- length of each yAxis interval
		var yGapLength = coord.yGapLength;
		var upCount = this.upCount = coord.upCount;
		var downCount = this.downCount = coord.downCount;
		var gap = this.gap = coord.gap;
		var margin = coord.margin;
		var upLength = this.upLength = yGapLength * upCount;
		var downLength = this.downLength = yGapLength * downCount;
		var TO_TOP = coord.TO_TOP;

		/*********************/
		var format = this.formatFloat = this.world.utils.formatFloat;
		var BAR_TO_LEFT = BAR_TO_RIGHT = 0.1 * xGapLength;
		var BAR_GAP = 0.02 * xGapLength > 1 ? 0.02 * xGapLength : 1;
		var barWidth = (xGapLength - BAR_TO_LEFT - BAR_TO_RIGHT - BAR_GAP * (barCount - 1) ) / barCount;
		var barHeights = this.getBarHeight(_series.data);

		barHeights.forEach(function(item, i) {
			stage.addChild(
				world.rectangle({
					startX: margin + xGapLength * i + BAR_TO_LEFT + index*(BAR_GAP + barWidth),
					startY: item >= 0 ? margin + upLength - item + TO_TOP : margin + upLength + TO_TOP,
					width: barWidth,
					height: Math.abs(item),
					fillColor: _series.barColor
				}).config({
					drag: false,
					fixed: true,
					changeIndex: false,
					zindex: 1
				}).on('mousedown', function() {
					console.log(i)
				})
			);
		});
	},

	getBarCount: function(series) {
		return series.filter(function(item) {
			return item.type === 'bar';
		}).length;
	},

	getBarHeight: function(data) {
		var format = this.formatFloat;
		var _this = this;
		var up = format(this.upCount*this.gap);
		var down = format(this.downCount*this.gap);
		var ret = [], height;
		data.forEach(function(item) {
			height = item >= 0 ? (item / up) * _this.upLength : (item / down) * _this.downLength;
			ret.push(height);
		});
		return ret;
	}
};

module.exports = Bar;