
var LCL = require('lcl');

var Line = require('./charts/line/index');

var Bar = require('./charts/bar/index');

function UCharts(settings) {

	this.element = settings.element;

	this.width = settings.width;

	this.height = settings.height;

	this.enableGlobalTranslate = settings.enableGlobalTranslate;

	this.initStructure();

};

var uchartsPrototype = UCharts.prototype;

uchartsPrototype.initStructure = function() {
  this.world = new LCL();
  this.stage = this.world.init({
  	element: this.element,
  	width: this.width,
  	height: this.height,
  	enableGlobalTranslate: this.enableGlobalTranslate
  });
};

uchartsPrototype.setOption = function(option) {
	var series = option.series,
		xAxis = option.xAxis,
		yAxis = option.yAxis,
		title = option.title,
		backgroundColor = option.backgroundColor,
		subTitle = option.subTitle;

	var coord = this.world.coord({
		startX: 0,
		startY: 0,
		width: this.world.width,
		height: this.world.height,
		xAxis: xAxis,
		yAxis: {

		},
		series: series,
		boundaryGap: true,
		backgroundColor: backgroundColor,
		title: title,
		subTitle: subTitle
	}).config({
		fixed: true,
		drag: false,
		changeIndex: false,
		zindex: 0
	});
	var bar = new Bar(this.world, this.stage);
	// calculate coordinates
	if(xAxis && yAxis) {
		this.stage.addChild(coord);
		series.forEach(function(item, index) {
			switch(item.type) {
				case 'bar':
					bar.init(option, index, coord);
					return;
				case 'line':
					line.init(option, index, coord);
					return;
				default:
					return;
			}
		});
		this.stage.show();
	}
};

var ucharts = {
	version: VERSION
};

ucharts.init = function(settings) {
	if(!settings || !this.isObj(settings)) {
		throw new Error('invalid settings!');
	}
	var chart = new UCharts(settings);
	return chart;
};

ucharts.isObj = function(obj) {
	return Object.prototype.toString.call(obj) === '[object Object]';
};

window.ucharts = ucharts;