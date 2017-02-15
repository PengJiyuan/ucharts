
var utils = require('../../utils');

function Bar(world, stage) {
	this.world = world;
	this.stage = stage;
}

Bar.prototype = {

	init: function(option, index, coord, tooltip) {
		var stage = this.stage;
		var world = this.world;
		var element = stage.element;
		var _series = option.series[index];
		var xAxis = option.xAxis;
		var dom = tooltip.getDom();
		// data's group count
		var barCount = this.getBarCount(option.series);
		// coordinate system -- length of xAxis
		var xLength = this.xLength = coord.xLength;
		// coordinate system -- length of yAxis
		var yLength = this.yLength = coord.yLength;
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
		var barInfos = this.getBarInfo(_series);

		barInfos.forEach(function(item, i) {
			var hover_color = world.color.lighten(_series.color, '10%');
			var bar = world.rectangle({
				startX: margin + xGapLength * i + BAR_TO_LEFT + index*(BAR_GAP + barWidth),
				startY: item.height >= 0 ? margin + upLength - item.height + TO_TOP - 1 : margin + upLength + TO_TOP,
				width: barWidth,
				height: Math.abs(item.height),
				fillColor: _series.color
			}).config({
				drag: false,
				fixed: true,
				changeIndex: false,
				zindex: 1
			}).on('mouseenter mousemove', function() {
				//set tooltip value
				tooltip.setValue({
					title: item.title,
					color: _series.color,
					name: xAxis.data[i],
					value: item.value
				});

				dom.style.display = 'block';
				bar.fillColor = hover_color;
				element.style.cursor = 'pointer';
				var x = utils.getPos().x + 20;
				var y = utils.getPos().y + 20;
				dom.style.left = x + 'px';
				dom.style.top = y + 'px';
				stage.redraw();
			}).on('mouseleave', function() {
				dom.style.display = 'none';
				bar.fillColor = _series.color;
				element.style.cursor = 'default';
				stage.redraw();
			});
			stage.addChild(bar);
		});
	},

	getBarCount: function(series) {
		return series.filter(function(item) {
			return item.type === 'bar';
		}).length;
	},

	getBarInfo: function(series) {
		var data = series.data;
		var name = series.name;
		var format = this.formatFloat;
		var _this = this;
		var up = format(this.upCount*this.gap);
		var down = format(this.downCount*this.gap);
		var ret = [], info, height;
		data.forEach(function(item) {
			info = {};
			height = item >= 0 ? (item / up) * _this.upLength : (item / down) * _this.downLength;
			info.title = name;
			info.value = item;
			info.height = height;
			ret.push(info);
		});
		return ret;
	}
};

module.exports = Bar;