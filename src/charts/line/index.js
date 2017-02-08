
var utils = require('../../utils');

function Line(world, stage) {
	this.world = world;
	this.stage = stage;
}

Line.prototype = {

	init: function(option, index, coord, tooltip) {
		var stage = this.stage;
		var world = this.world;
		var dom = tooltip.getDom();
		var element = stage.element;
		var _series = option.series[index];

		var xAxis = option.xAxis;
		// coordinate system -- length of each xAxis interval
		var xGapLength = this.xGapLength =  coord.xGapLength;
		// coordinate system -- length of each yAxis interval
		var yGapLength = this.yGapLength = coord.yGapLength;
		var upCount = this.upCount = coord.upCount;
		var downCount = this.downCount = coord.downCount;
		var gap = this.gap = coord.gap;
		var margin = this.margin = coord.margin;
		var upLength = this.upLength = yGapLength * upCount;
		var downLength = this.downLength = yGapLength * downCount;
		var TO_TOP = this.TO_TOP = coord.TO_TOP;
		var format = this.formatFloat = this.world.utils.formatFloat;
		var boundaryGap = this.boundaryGap = coord.boundaryGap;
		var matrix = this.getmMatrix(_series.data);

		/*********/
		var lineColor = _series.color,
			dash = _series.dash ? _series.dash : [0, 0],
			lineJoin = _series.lineJoin,
			smooth = _series.smooth;

		stage.addChild(
			world.line({
				matrix: matrix,
				lineWidth: 2,
				strokeColor: lineColor,
				dash: dash,
				lineJoin: lineJoin,
				smooth: smooth
			}).config({
				fixed: true,
				changeIndex: false,
				zindex: 2
			})
		);

		// draw arc
		matrix.forEach(function(m, i) {
			var arc = world.arc({
				x: m.x,
				y: m.y,
				radius: 3,
				color: lineColor,
				style: 'fill'
			}).config({
				drag: false,
				changeIndex: false,
				zindex: 3
			}).on('mouseenter mousemove', function() {
				//set tooltip value
				tooltip.setValue({
					title: _series.name,
					color: lineColor,
					name: xAxis.data[i],
					value: _series.data[i]
				});

				dom.style.display = 'block';
				var x = utils.getPos().x + 20;
				var y = utils.getPos().y + 20;
				dom.style.left = x + 'px';
				dom.style.top = y + 'px';

				arc.radius = 8;
				element.style.cursor = 'pointer';
				stage.redraw();
			}).on('mouseleave', function() {
				dom.style.display = 'none';
				arc.radius = 3;
				element.style.cursor = 'default';
				stage.redraw();
			});
			stage.addChild(arc);
		});
		
	},

	getmMatrix: function(data) {
		var format = this.formatFloat;
		var _this = this;
		var up = format(this.upCount*this.gap);
		var down = format(this.downCount*this.gap);
		var coordinates = [], heights = [], coordinate, height, x, y;
		data.forEach(function(item) {
			height = item >= 0 ? (item / up) * _this.upLength : (item / down) * _this.downLength;
			heights.push(height);
		});
		if(this.boundaryGap) {
			heights.forEach(function(item, index) {
				coordinate = {};
				x = _this.margin + _this.xGapLength / 2 + _this.xGapLength*index;
				y = _this.upLength - item + _this.margin + _this.TO_TOP;
				coordinate = {
					x: x,
					y: y
				};
				coordinates.push(coordinate);
			});
		} else {

		}
		return coordinates;
	}
};

module.exports = Line;