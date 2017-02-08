
var LCL = require('lcl');

var Line = require('./charts/line/index');

var Bar = require('./charts/bar/index');

var ToolTip = require('./tooltip');

var expandShapes = require('./expandshapes');

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
  expandShapes(this.world);
  this.tooltip = new ToolTip();
  this.tooltip.init();
};

uchartsPrototype.setOption = function(option) {
	this.option = option;
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

	var coord = this.world.coord({
		startX: 0,
		startY: 0,
		width: this.world.width,
		height: this.world.height,
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
	var bar = new Bar(this.world, this.stage);
	var line = new Line(this.world, this.stage);
	
	var legend = new Legend(this.world, this.stage);
	legend.init(series);

	// calculate coordinates
	if(xAxis && series) {
		var _this = this;
		this.stage.addChild(coord);
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
		this.stage.show();
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