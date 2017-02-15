
var LCL = require('lcl');

var Line = require('./charts/line/index');

var Bar = require('./charts/bar/index');

var ToolTip = require('./tooltip');

var expandShapes = require('./expandshapes');

var textColor = require('./shapes/text_color.js');

var Legend = require('./legend');

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
  expandShapes(this.world, textColor);
  this.tooltip = new ToolTip();
  this.tooltip.init();
};

uchartsPrototype.setOption = function(option) {
	this.option = option,
		world = this.world,
		stage = this.stage;
	var series = option.series,
		xAxis = option.xAxis,
		yAxis = option.yAxis,
		title = option.title,
		backgroundColor = option.backgroundColor,
		subTitle = option.subTitle,
		boundaryGap = option.boundaryGap ? option.boundaryGap : true;

 	// draw bar first
	series.sort(function(a, b) {
		return a.type > b.type;
	});

	var coord = world.coord({
		startX: 0,
		startY: 0,
		width: world.width,
		height: world.height,
		xAxis: xAxis,
		yAxis: {

		},
		series: series,
		boundaryGap: boundaryGap,
		backgroundColor: backgroundColor,
		title: title,
		subTitle: subTitle
	}).config({
		fixed: true,
		drag: false,
		changeIndex: false,
		zindex: 0
	});
	var bar = new Bar(world, stage);
	var line = new Line(world, stage);
	
	var legend = new Legend(world, stage);
	legend.init(series);

	// calculate coordinates
	if(xAxis && series) {
		var _this = this;
		stage.addChild(coord);
		series.forEach(function(item, index) {
			switch(item.type) {
				case 'bar':
					bar.init(option, index, coord, _this.tooltip);
					return;
				case 'line':
					line.init(option, index, coord, _this.tooltip);
					return;
				default:
					return;
			}
		});
		stage.show();
		// var iiiii = 0;
		// var tick = iiiii / 50;
		// var a = stage.animate(function() {
		// 	if(iiiii > 50) {
		// 		stage.stop(a);
		// 		return;
		// 	}
		// 	world.objects.filter(function(item) {
		// 		return item.type === 'rectangle';
		// 	}).forEach(function(item) {
		// 		item.startY-=2;
		// 		item.height+=2;

		// 	});
		// 	stage.redraw();
		// 	iiiii ++;
		// });
	}
};

uchartsPrototype.resize = function(width, height) {
	this.world.element.width = width;
	this.world.element.height = height;
	this.world.width = width;
	this.world.height = height;
	this.world.objects = [];
	this.world._objects = [];
	this.setOption(this.option);
	this.stage.redraw();
} 

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