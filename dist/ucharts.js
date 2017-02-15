/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	
	var LCL = __webpack_require__(2);

	var Line = __webpack_require__(3);

	var Bar = __webpack_require__(5);

	var ToolTip = __webpack_require__(6);

	var expandShapes = __webpack_require__(7);

	var textColor = __webpack_require__(8);

	var Legend = __webpack_require__(9);

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
		version: ("1.0.0")
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

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	
	// Source: src/header.js
	;(function(){

	// Source: src/core.js

	  LCL = function() {

	    this.version = '1.3.5';

	    this.objects = [];

	    this.canvas = null;

	    this.transX = 0;

	    this.transY = 0;

	    this.scale = 1;

	    this.drawUtils = {};

	    this.loader = null; // the instance of image loader

	    this.images = [];

	    this.pointerInnerArray = [];

	    this.isDragging = false;

	    this.eventTypes = ['mousedown', 'mouseup', 'mouseenter', 'mouseleave', 'mousemove', 'drag', 'dragend', 'dragin', 'dragout', 'drop'];

	    this._event = new this.event(this);

	    var _this = this;

	    this.core = function(config) {

	      if(!(config instanceof Object)) {
	        console.warn('no canvas element!');
	        return;
	      }

	      this.element = _this.element = config.element,

	      this.canvas = _this.canvas =  this.element.getContext('2d');

	      // init the width and height
	      config.element.width = this.width = _this.width = config.width;

	      config.element.height = this.height = _this.height = config.height;

	      _this.enableGlobalTranslate = config.enableGlobalTranslate;

	      _this.drawUtils.clear = this.clear;
	      _this.drawUtils.draw = this.draw;
	      _this.drawUtils.redraw = this.redraw;

	      // init images
	      if(config.images) {
	        _this.images = config.images;
	      }

	    };

	    this.core.prototype = {

	      imgReady: function() {
	        _this.loader = new _this.utils.imageLoader();
	        _this.loader.addImg(_this.images);
	      },

	      addChild: function(obj) {
	        // multi or single
	        if(Object.prototype.toString.call(obj) === '[object Array]') {
	          _this.objects = _this.objects.concat(obj);
	        } else {
	          _this.objects.push(obj);
	        }
	        _this.objects.sort(function(a, b) {
	          return a.zindex - b.zindex;
	        });
	        // copy the reverse events array
	        _this._objects = _this.utils.reverse(_this.objects);
	      },

	      show: function() {
	        this.imgReady();
	        _this.loader.ready(function() {
	          _this.drawUtils.draw();
	          _this._event.triggerEvents();
	        });
	      },

	      draw: function() {
	        _this.objects.forEach(function(item) {
	          item.draw();
	        });
	      },

	      redraw: function() {
	        _this.drawUtils.clear();
	        _this.canvas.save();
	        _this.canvas.translate(_this.transX, _this.transY);
	        _this.drawUtils.draw();
	        _this.canvas.restore();
	      },

	      clear: function() {
	        _this.canvas.clearRect(0, 0, _this.width, _this.height);
	      },

	      animate: function(func) {
	        _this._event.triggerEvents();
	        var id = new Date().getTime();
	        var _func = function() {
	          func();
	          _this[id] = requestAnimationFrame(_func);
	        };
	        _func();
	        return id;
	      },

	      stop: function(id) {
	        cancelAnimationFrame(_this[id]);
	      },

	      globalTranslate: function(bool) {
	        if(typeof bool !== 'boolean' || !bool) {
	          return;
	        }
	        _this.enableGlobalTranslate = true;
	      },

	      // scaleCanvas: function(bool) {
	      //   if(typeof bool !== 'boolean' || !bool) {
	      //     return;
	      //   }
	      //   var that = this;
	      //   LCL.bind(this.element, 'wheel', function(e) {
	      //     if(e.deltaY < 0) {
	      //       if(LCL.scale <= 3) {
	      //         LCL.scale += 0.02;
	      //         that.redraw();
	      //       }
	      //     } else {
	      //       if(LCL.scale > 0.5) {
	      //         LCL.scale -= 0.02;
	      //         that.redraw();
	      //       }
	      //     }
	      //   });
	      // }

	    };

	    this.init = function(config) {
	      return new _this.core(config);
	    };

	  };



	// Source: src/display.js

	  LCL.prototype.display = function(settings) {

	    var _this = this;

	    var settingsData = {

	      color: settings.color, // arc

	      startX: settings.startX,

	      startY: settings.startY,

	      dash: settings.dash, // line

	      offset: settings.offset ? settings.offset : 0, // line

	      fillColor: settings.fillColor, // rectangle fillcolor

	      sliceX: settings.sliceX, // image sliceX

	      sliceY: settings.sliceY, // image sliceY

	      width: settings.width, // image

	      height: settings.height, // image

	      sliceWidth: settings.sliceWidth, // image

	      sliceHeight: settings.sliceHeight, // image

	      backgroundColor: settings.backgroundColor, //text

	      text: settings.text, // text,

	      radius: settings.radius //arc

	    };

	    // bind event
	    var on = function(eventTypes, callback) {

	      if(!eventTypes) {
	        throw 'no eventTypes defined!';
	      }

	      if(!callback || typeof callback !== 'function') {
	        throw 'you need defined a callback!';
	      }

	      this.events = this.events || [];

	      var eTypes = eventTypes.split(' '), that = this;

	      eTypes.forEach(function(event) {
	        if(~_this.eventTypes.indexOf(event)) {
	          that.events.push({
	            eventType: event,
	            callback: callback
	          });
	        } else {
	          console.warn(event + ' is not in eventTypes!');
	        }
	      });

	      return this;

	    };

	    // whether pointer is inner this shape
	    var isPointInner = function(x, y) {
	      var that = this;

	      var ltx = this.fixed ? 0 : _this.transX;
	      var lty = this.fixed ? 0 : _this.transY;
	      var mx = this.moveX,
	        my = this.moveY;
	      // rotate the x and y coordinates
	      // var cX = this.startX + this.width/2 + ltx + this.moveX, cY = this.startY + this.height/2 + lty + this.moveY;
	      // var oX = (x - cX)*Math.cos((Math.PI/180)*(-this.rotate)) - (y - cY)*Math.sin((Math.PI/180)*(-this.rotate)) + cX;
	      // var oY = (x - cX)*Math.sin((Math.PI/180)*(-this.rotate)) + (y - cY)*Math.cos((Math.PI/180)*(-this.rotate)) + cY;
	      // var xRight = oX > this.startX + ltx+ this.moveX;
	      // var xLeft = oX < this.startX + this.width + ltx+ this.moveX;
	      // var yTop = oY > this.startY + lty + this.moveY;
	      // var yBottom = oY < this.startY + this.height + lty + this.moveY;
	      var xRight = x > this.startX + mx + ltx;
	      var xLeft = x < this.startX + this.width + mx + ltx;
	      var yTop = y > this.startY + my + lty;
	      var yBottom = y < this.startY + this.height + my + lty;

	      switch(this.type) {

	      case 'rectangle':
	      case 'image':
	      case 'text':
	      case 'coord':
	        return !!(xRight && xLeft && yTop && yBottom);
	      case 'arc':
	        var cx = this.x, // center x
	          cy = this.y, // center y
	          pi = Math.PI,
	          sa = this.startAngle < 0 ? 2*pi + pi/180*this.startAngle : pi/180*this.startAngle,
	          ea = this.endAngle < 0 ? 2*pi + pi/180*this.endAngle : pi/180*this.endAngle,
	          r = this.radius,
	          dx = x - cx - mx -ltx,
	          dy = y - cy - my - lty,
	          isIn, dis;
	        // Sector
	        if(!isNaN(sa) && !isNaN(ea)) {
	          var angle;
	          // 4th quadrant
	          if(dx >= 0 && dy >= 0) {
	            if(dx === 0) {
	              angle = pi/2;
	            } else {
	              angle = Math.atan( (dy / dx) );
	            }
	          }
	          // 3th quadrant
	          else if(dx <= 0 && dy >= 0) {
	            if(dx === 0) {
	              angle = pi;
	            } else {
	              angle = pi - Math.atan(dy / Math.abs(dx));
	            }
	          }
	          // secend quadrant
	          else if(dx <= 0 && dy <= 0) {
	            if(dx === 0) {
	              angle = pi;
	            } else {
	              angle = Math.atan(Math.abs(dy) / Math.abs(dx)) + pi;
	            }
	          }
	          // first quadrant
	          else if(dx >= 0 && dy<= 0) {
	            if(dx === 0) {
	              angle = pi*3/2;
	            } else {
	              angle = 2*pi - Math.atan(Math.abs(dy) / dx);
	            }
	          }
	          dis = Math.sqrt( dx * dx + dy * dy );
	          if(sa < ea) {
	            isIn = !!(angle >= sa && angle <= ea && dis <= r);
	          } else {
	            isIn = !!( ( (angle >= 0 && angle <= ea) || (angle >= sa && angle <= 2*pi) ) && dis <= r);
	          }
	        }
	        // normal arc
	        else {
	          isIn = !!( Math.sqrt( dx * dx + dy * dy ) <= r );
	        }
	        return isIn;
	      default:
	        break;
	      }

	      // expand isPointerInner
	      var arr = _this.pointerInnerArray;
	      for(var i = 0; i < arr.length; i++) {
	        if(that.type === arr[i].type) {
	          return arr[i].isPointInner(that, x, y);
	        }
	      }
	    };

	    var config = function(obj) {
	      if(Object.prototype.toString.call(obj) !== '[object Object]') {
	        return;
	      }
	      if(obj.drag) {
	        this.enableDrag = true;
	      }
	      if(obj.changeIndex) {
	        this.enableChangeIndex = true;
	      }
	      if(obj.fixed) {
	        this.fixed = true;
	      }
	      if(obj.bg) {
	        this.isBg = true;
	      }
	      this.zindex = obj.zindex ? obj.zindex : 0;
	      return this;
	    };

	    // whether this shape can be dragged
	    var drag = function(bool) {
	      if(!bool || typeof bool !== 'boolean') {
	        return;
	      }
	      this.enableDrag = true;
	    };

	    // when select this shape, whether it should be changed the index
	    var changeIndex = function(bool) {
	      if(!bool || typeof bool !== 'boolean') {
	        return;
	      }
	      this.enableChangeIndex = true;
	    };

	    return Object.assign({}, settingsData, {

	      isDragging: false,

	      hasEnter: false,

	      hasDraggedIn: false,

	      moveX: 0,

	      moveY: 0,

	      on: on,

	      isPointInner: isPointInner,

	      config: config,

	      drag: drag,

	      changeIndex: changeIndex

	    });

	  };


	// Source: src/shapes/rectangle.js

	  ;(function() {// eslint-disable-line  

	    var rectangle = function(settings) {

	      var _this = this;

	      var draw = function() {
	        var canvas = _this.canvas;

	        canvas.save();
	        // canvas.translate( startX + width/2 + this.moveX, startY + height/2 + this.moveY);
	        // canvas.rotate((Math.PI/180)*this.rotate);
	        // canvas.translate(-( startX + width/2 + this.moveX), -( startY + height/2 + this.moveY));
	        canvas.translate(this.moveX, this.moveY);
	        if(this.fixed) {
	          canvas.translate(-_this.transX, -_this.transY);
	        }
	        canvas.fillStyle = this.fillColor ? this.fillColor : '#000';
	        canvas.fillRect(this.startX, this.startY, this.width, this.height);
	        canvas.restore();
	      };

	      return Object.assign({}, _this.display(settings), {
	        type: 'rectangle',
	        draw: draw
	      });
	    };

	    LCL.prototype.rectangle = rectangle;

	  })();

	// Source: src/shapes/line.js

	  ;(function() {// eslint-disable-line

	    var line = function(settings) {

	      var _this = this;
	      var canvas = _this.canvas,
	        matrix = settings.matrix,
	        lineWidth = settings.lineWidth,
	        lineCap = settings.lineCap,
	        lineJoin = settings.lineJoin,
	        strokeColor = settings.strokeColor,
	        smooth = settings.smooth;

	      var totalLength;

	      var draw = function() {

	        canvas.save();
	        canvas.translate(-0.5, -0.5);
	        canvas.translate(this.moveX, this.moveY);
	        if(this.fixed) {
	          canvas.translate(-_this.transX, -_this.transY);
	        }
	        canvas.lineWidth = lineWidth;
	        canvas.strokeStyle = strokeColor;
	        canvas.beginPath();
	        canvas.lineDashOffset = this.offset;
	        if(this.dash && Object.prototype.toString.call(this.dash) === '[object Array]') {
	          canvas.setLineDash(this.dash);
	        }
	        if(lineCap) {
	          canvas.lineCap = lineCap;
	        }
	        if(lineJoin) {
	          canvas.lineJoin = lineJoin;
	        }
	        if(smooth) {
	          var getCtrlPoint = function(ps, i, a, b) {
	            var pAx, pAy, pBx, pBy;
	            if(!a || !b){
	              a = 0.25;
	              b = 0.25;
	            }
	            if( i < 1){
	              pAx = ps[0].x + (ps[1].x - ps[0].x)*a;
	              pAy = ps[0].y + (ps[1].y - ps[0].y)*a;
	            }else{
	              pAx = ps[i].x + (ps[i+1].x - ps[i-1].x)*a;
	              pAy = ps[i].y + (ps[i+1].y - ps[i-1].y)*a;
	            }
	            if(i > ps.length-3){
	              var last = ps.length-1;
	              pBx = ps[last].x - (ps[last].x - ps[last-1].x) * b;
	              pBy = ps[last].y - (ps[last].y - ps[last-1].y) * b;
	            }else{
	              pBx = ps[i + 1].x - (ps[i + 2].x - ps[i].x) * b;
	              pBy = ps[i + 1].y - (ps[i + 2].y - ps[i].y) * b;
	            }
	            return {
	              pA:{x: pAx, y: pAy},
	              pB:{x: pBx, y: pBy}
	            };
	          };
	          for(var i = 0; i < matrix.length; i++) {
	            if(i === 0){
	              canvas.moveTo(matrix[i].x, matrix[i].y);
	            }else{
	              var cMatrix = getCtrlPoint(matrix, i-1);
	              canvas.bezierCurveTo(cMatrix.pA.x, cMatrix.pA.y, cMatrix.pB.x, cMatrix.pB.y, matrix[i].x, matrix[i].y);
	            }
	          }
	        } else {
	          matrix.forEach(function(point, i) {
	            i === 0 ? canvas.moveTo(point.x, point.y) : canvas.lineTo(point.x, point.y);
	          });
	        }
	        canvas.stroke();
	        canvas.closePath();
	        canvas.restore();
	      };

	      return Object.assign({}, _this.display(settings), {
	        type: 'line',
	        draw: draw,
	        totalLength: totalLength
	      });
	    };

	    LCL.prototype.line = line;

	  })();

	// Source: src/shapes/image.js

	  ;(function() {// eslint-disable-line  

	    var image = function(settings) {

	      var _this = this;

	      // insert into images
	      if(settings.src) {
	        !~_this.images.indexOf(settings.src) && _this.images.push(settings.src);
	      }

	      var draw = function() {
	        var canvas = _this.canvas,
	          startX = this.startX = settings.startX,
	          startY = this.startY = settings.startY,
	          src = settings.src;

	        canvas.save();
	        canvas.translate(this.moveX, this.moveY);
	        if(this.fixed) {
	          canvas.translate(-_this.transX, -_this.transY);
	        }
	        if(this.sliceWidth && this.sliceHeight) {
	          canvas.drawImage(_this.loader.getImg(src), this.sliceX, this.sliceY, this.sliceWidth, this.sliceHeight, startX, startY, this.width, this.height);
	        } else {
	          canvas.drawImage(_this.loader.getImg(src), startX, startY, this.width, this.height);
	        }
	        canvas.restore();
	      };

	      return Object.assign({}, _this.display(settings), {
	        type: 'image',
	        draw: draw
	      });
	    };

	    LCL.prototype.image = image;

	  })();

	// Source: src/shapes/text.js

	  ;(function() {// eslint-disable-line  

	    var text = function(settings) {

	      var _this = this;

	      function text_ellipsis(ctx, str, maxWidth) {
	        var width = ctx.measureText(str).width,
	          ellipsis = '...',
	          ellipsisWidth = ctx.measureText(ellipsis).width;

	        if (width <= maxWidth || width <= ellipsisWidth) {
	          return str;
	        } else {
	          var len = str.length;
	          while (width >= maxWidth - ellipsisWidth && len-- > 0) {
	            str = str.substring(0, len);
	            width = ctx.measureText(str).width;
	          }
	          return str + ellipsis;
	        }
	      }

	      var draw = function() {
	        var canvas = _this.canvas,
	          startX = this.startX = settings.startX,
	          startY = this.startY = settings.startY,
	          width = settings.width,
	          height = settings.height,
	          pt = settings.paddingTop ? settings.paddingTop : 0,
	          center = settings.center,
	          font = settings.font,
	          type = settings.type,
	          color = settings.color,
	          t = this.text,
	          textWidth, ellipsisText;

	        if(!type) {
	          return;
	        }
	        canvas.save();
	        canvas.translate(this.moveX, this.moveY);
	        if(this.fixed) {
	          canvas.translate(-_this.transX, -_this.transY);
	        }
	        if(this.backgroundColor) {
	          canvas.save();
	          canvas.fillStyle = this.backgroundColor;
	          canvas.fillRect(startX, startY, width, height);
	          canvas.restore();
	        }
	        canvas.font = font;
	        canvas.textBaseline = 'top';

	        textWidth = canvas.measureText(t).width;
	        ellipsisText = text_ellipsis(canvas, t, width - 8);

	        if(type === 'stroke') {
	          canvas.strokeStyle = color;
	          if(center) {
	            if(textWidth < width - 8) {
	              canvas.strokeText(ellipsisText, startX + 4 + (width - textWidth - 8)/2, startY + pt);
	            }
	          } else {
	            canvas.strokeText(ellipsisText, startX + 4, startY + pt);
	          }
	        } else {
	          canvas.fillStyle = color;
	          if(center) {
	            if(textWidth < width - 8) {
	              canvas.fillText(ellipsisText, startX + 4 + (width - textWidth - 8)/2, startY + pt);
	            }
	          } else {
	            canvas.fillText(ellipsisText, startX + 4, startY + pt);
	          }
	        }
	        canvas.restore();
	      };

	      return Object.assign({}, _this.display(settings), {
	        type: 'text',
	        draw: draw
	      });
	    };

	    LCL.prototype.text = text;

	  })();

	// Source: src/shapes/arc.js

	  ;(function() {// eslint-disable-line

	    var arc = function(settings) {

	      var _this = this;

	      var draw = function() {
	        var canvas = _this.canvas,
	          x = this.x = settings.x,
	          y = this.y = settings.y,
	          style = this.style = settings.style,
	          startAngle = this.startAngle = settings.startAngle,
	          endAngle = this.endAngle = settings.endAngle;

	        canvas.save();
	        if(this.fixed) {
	          canvas.translate(-_this.transX, -_this.transY);
	        }
	        canvas.translate(this.moveX, this.moveY);
	        canvas.translate(x, y);
	        canvas.beginPath();
	        if(!isNaN(startAngle) && !isNaN(endAngle)) {
	          canvas.arc(0, 0, this.radius, Math.PI/180*startAngle, Math.PI/180*endAngle, false);
	          canvas.save();
	          canvas.rotate(Math.PI/180*endAngle);
	          canvas.moveTo(this.radius, 0);
	          canvas.lineTo(0, 0);
	          canvas.restore();
	          canvas.rotate(Math.PI/180*startAngle);
	          canvas.lineTo(this.radius, 0);
	        } else {
	          canvas.arc(0, 0, this.radius, 0, Math.PI*2);
	        }
	        if(style === 'fill') {
	          canvas.fillStyle = this.color;
	          canvas.fill();
	        } else {
	          canvas.strokeStyle = this.color;
	          canvas.stroke();
	        }
	        canvas.closePath();
	        canvas.restore();
	      };

	      return Object.assign({}, _this.display(settings), {
	        type: 'arc',
	        draw: draw
	      });
	    };

	    LCL.prototype.arc = arc;

	  })();

	// Source: src/shapes/coord.js

	  ;(function() {// eslint-disable-line  

	    var coord = function(settings) {

	      var _this = this;
	      var canvas = _this.canvas,
	        startX = this.startX = settings.startX,
	        startY = this.startY = settings.startY,
	        width = settings.width,
	        height = settings.height,
	        xAxis = settings.xAxis,
	        //yAxis = settings.yAxis,
	        series = settings.series,
	        boundaryGap = settings.boundaryGap,
	        title = settings.title,
	        subTitle = settings.subTitle;

	      var TO_TOP = 20;

	      var margin = width <= 300 ? width / 5 : width / 10;
	      var xCount, yCount, xSpace, ySpace, xLength, yLength, xGapLength, yGapLength, upCount, downCount, ygl;

	      // yAxis
	      var maxY = _this.utils.getMaxMin(false, series, xAxis).max,
	        minY = _this.utils.getMaxMin(false, series, xAxis).min,
	        gm = _this.utils.calculateCoord(maxY, minY),
	        gap = gm.gap;
	      //retMax = gm.max;

	      yLength = height - 2 * margin;
	      //count = Math.round(retMax / gap);

	      upCount = maxY > 0 ? Math.ceil(maxY / gap) : 0;
	      downCount = minY < 0 ? Math.ceil( Math.abs(minY) / gap) : 0;
	      yCount = upCount + downCount;
	      yGapLength = Math.round( yLength / yCount ),
	      ySpace = yCount,
	      ygl = yGapLength;

	      // xAxis
	      if(xAxis.data && xAxis.data.length > 0) {
	        xCount = xAxis.data.length;
	        xSpace = boundaryGap ? xCount : xCount -1;
	        xLength = width - margin * 2;
	        xGapLength = xLength / xSpace;
	      }

	      var draw = function() {

	        canvas.save();
	        canvas.translate(-0.5, -0.5);
	        canvas.translate(this.moveX, this.moveY);
	        if(this.fixed) {
	          canvas.translate(-_this.transX, -_this.transY);
	        }
	        if(this.backgroundColor) {
	          canvas.save();
	          canvas.fillStyle = this.backgroundColor;
	          canvas.fillRect(startX, startY, width, height);
	          canvas.restore();
	        }

	        // draw title
	        canvas.save();
	        canvas.font = width <= 300 ? '18px serif' : '24px serif';
	        canvas.textAlign = 'left';
	        canvas.textBaseline = 'top';
	        canvas.fillText(title, margin / 2, 10);
	        canvas.restore();
	        canvas.save();
	        canvas.fillStyle = '#666666';
	        canvas.font = width <= 300 ? '10px serif' : '14px serif';
	        canvas.textAlign = 'left';
	        canvas.textBaseline = 'top';
	        canvas.fillText(subTitle, margin / 2 + 4, 40);
	        canvas.restore();


	        // draw yAxis

	        // coordinate origin
	        canvas.translate(startX + margin, startY + margin + upCount * yGapLength + TO_TOP);

	        // yAxis
	        canvas.beginPath();
	        canvas.moveTo(0, 0 + downCount * yGapLength);
	        canvas.lineTo(0, -(height - margin*2) + downCount * yGapLength - 5);
	        canvas.stroke();
	        canvas.closePath();

	        for(var ii = 0; ii <= upCount; ii++) {
	          canvas.beginPath();
	          canvas.moveTo(0, -yGapLength * ii);
	          canvas.lineTo(-5, -yGapLength * ii);
	          canvas.stroke();
	          canvas.closePath();
	          // draw grid
	          canvas.save();
	          canvas.strokeStyle = '#ccc';
	          canvas.beginPath();
	          canvas.moveTo(0, -yGapLength * ii);
	          canvas.lineTo(width - margin*2, -yGapLength * ii);
	          canvas.stroke();
	          canvas.restore();
	          canvas.closePath();
	          // draw label
	          canvas.save();
	          canvas.font = '12px serif';
	          canvas.textAlign = 'right';
	          canvas.textBaseline = 'middle';
	          canvas.fillText( _this.utils.formatFloat(gap*ii), -10, -yGapLength * ii);
	          canvas.restore();
	        }

	        for(var iii = 0; iii <= downCount; iii++) {
	          canvas.beginPath();
	          canvas.moveTo(0, yGapLength * iii);
	          canvas.lineTo(-5, yGapLength * iii);
	          canvas.stroke();
	          canvas.closePath();
	          // draw grid
	          canvas.save();
	          canvas.strokeStyle = '#ccc';
	          canvas.beginPath();
	          canvas.moveTo(0, yGapLength * iii);
	          canvas.lineTo(width - margin*2, yGapLength * iii);
	          canvas.stroke();
	          canvas.restore();
	          canvas.closePath();
	          // draw label
	          canvas.save();
	          canvas.font = '12px serif';
	          canvas.textAlign = 'right';
	          canvas.textBaseline = 'middle';
	          if(iii !== 0) {
	            canvas.fillText( _this.utils.formatFloat(-gap*iii), -10, yGapLength * iii);
	          }
	          canvas.restore();
	        }

	        // xAxis
	        canvas.beginPath();
	        canvas.moveTo(0, 0);
	        canvas.lineTo(width - margin*2, 0);
	        canvas.stroke();
	        canvas.closePath();

	        // draw xAxis
	        if(xAxis.data && xAxis.data.length > 0) {

	          xAxis.data.forEach(function(item, index) {
	            canvas.beginPath();
	            canvas.moveTo(xGapLength * (index + 1), 0);
	            canvas.lineTo(xGapLength * (index + 1), 5);
	            canvas.save();
	            canvas.font = '15px serif';
	            canvas.textAlign = 'center';
	            canvas.textBaseline = 'top';
	            boundaryGap ? canvas.fillText(item, xGapLength * index + xGapLength / 2, 5 + downCount * ygl) : canvas.fillText(item, xGapLength * index, 5 + downCount * ygl);
	            canvas.restore();
	            canvas.stroke();
	            canvas.closePath();
	          });

	        }
	        //else {
	        //   var maxX = getMaxMin(true).max,
	        //     minX = getMaxMin(true).min;

	        // }

	        canvas.restore();
	      };

	      return Object.assign({}, _this.display(settings), {
	        type: 'coord',
	        draw: draw,
	        xLength: xLength,
	        yLength: yLength,
	        xSpace: xSpace,
	        ySpace: ySpace,
	        xGapLength: xGapLength,
	        yGapLength: yGapLength,
	        upCount: upCount,
	        downCount: downCount,
	        gap: gap,
	        margin: margin,
	        TO_TOP: TO_TOP,
	        boundaryGap: boundaryGap
	      });
	    };

	    LCL.prototype.coord = coord;

	  })();

	// Source: src/event.js

	  LCL.prototype.event = function(_this) {

	    return {

	      getPos: function(e) {
	        var ev = e || event;
	        var x = ev.pageX - _this.element.offsetLeft,
	          y = ev.pageY - _this.element.offsetTop;
	        return {
	          x: x,
	          y: y
	        };
	      },

	      triggerEvents: function() {

	        var hasEvents = _this.objects.some(function(item) {
	          return !!item.events && Object.prototype.toString.call(item.events) === '[object Array]' && !item.isBg || item.enableDrag;
	        });
	        if(!hasEvents && !_this.enableGlobalTranslate) {
	          return;
	        }

	        var hasEnterOrMove = _this.objects.some(function(item) {
	          return item.events && item.events.some(function(i) {
	            return i.eventType === 'mouseenter' || i.eventType === 'mousemove';
	          }) && !item.isBg;
	        });

	        // mouseenter mousemove
	        if(hasEnterOrMove) {
	          this.mouseEnterOrMove();
	        }

	        _this.utils.bind(_this.element, 'mousedown', this.mouseDown.bind(this));
	      },

	      mouseEnterOrMove: function() {
	        var isDragging;
	        _this.utils.bind(_this.element, 'mousemove', function(e_moveOrEnter) {
	          var mX = _this._event.getPos(e_moveOrEnter).x;
	          var mY = _this._event.getPos(e_moveOrEnter).y;

	          isDragging = _this.objects.some(function(item) {
	            return item.isDragging;
	          });

	          // trigger mouseenter and mousemove
	          var movedOn = _this._objects.filter(function(item) {
	            return item.isPointInner(mX, mY) && !item.isBg;
	          });

	          // init the cursor
	          // if(movedOn && movedOn.length > 0) {
	          //   this.element.style.cursor = 'pointer';
	          // } else {
	          //   this.element.style.cursor = 'default';
	          // }

	          if(isDragging) {

	            // interweaving the two shapes

	            if(movedOn && movedOn.length > 1) {
	              movedOn[1].events && movedOn[1].events.forEach(function(i) {
	                if(i.eventType === 'dragin' && !movedOn[1].hasDraggedIn) {
	                  movedOn[1].hasDraggedIn = true;
	                  i.callback && i.callback();
	                }
	              });
	            }

	            // dragout handler
	            var handleDragOut = function(item) {
	              item.hasDraggedIn && item.events.forEach(function(i) {
	                if(i.eventType === 'dragout') {
	                  i.callback && i.callback();
	                }
	              });
	              item.hasDraggedIn = false;
	            };

	            // Determine whether the mouse is dragged out from the shape and trigger dragout handler
	            _this._objects.some(function(item) {
	              return item.hasDraggedIn && (!item.isPointInner(mX, mY) || movedOn[1] !== item) && handleDragOut(item);
	            });

	          } else {

	            // normal mousemove
	            if(movedOn && movedOn.length > 0) {
	              movedOn[0].events && movedOn[0].events.forEach(function(i) {
	                if(i.eventType === 'mouseenter' && !movedOn[0].hasEnter) {
	                  movedOn[0].hasEnter = true;
	                  i.callback && i.callback();
	                } else if(i.eventType === 'mousemove') {
	                  i.callback && i.callback();
	                }
	              });
	            }

	            // mouseleave handler
	            var handleMoveOut = function(item) {
	              item.hasEnter && item.events.forEach(function(i) {
	                if(i.eventType === 'mouseleave') {
	                  i.callback && i.callback();
	                }
	              });
	              item.hasEnter = false;
	            };

	            // Determine whether the mouse is removed from the shape and trigger mouseleave handler
	            _this._objects.some(function(item) {
	              return item.hasEnter && (!item.isPointInner(mX, mY) || movedOn[0] !== item) && handleMoveOut(item);
	            });
	          }

	        });
	      },

	      mouseDown: function(e_down) {
	        var that = this, whichIn, hasEventDrag, hasEventDragEnd, dragCb, dragEndCb;
	        var hasDrags = _this.objects.some(function(item) {
	          return !!item.enableDrag;
	        });

	        // drag shape
	        var pX = _this._event.getPos(e_down).x;
	        var pY = _this._event.getPos(e_down).y;
	        that.cacheX = pX;
	        that.cacheY = pY;

	        // mousedown
	        var whichDown = _this._objects.filter(function(item) {
	          return item.isPointInner(pX, pY) && !item.isBg;
	        });

	        if(whichDown && whichDown.length > 0) {
	          if(whichDown[0].enableChangeIndex) {
	            that.changeOrder(whichDown[0]);
	          }
	          whichDown[0].events && whichDown[0].events.some(function(i) {
	            return i.eventType === 'mousedown' && i.callback && i.callback();
	          });
	        }

	        // mouseDrag
	        if(hasDrags) {
	          whichIn = _this._objects.filter(function(item) {
	            return item.isPointInner(pX, pY) && !item.isBg;
	          });

	          hasEventDrag = whichIn.length > 0 && whichIn[0].events && whichIn[0].events.some(function(item) {
	            if(item.eventType === 'drag') {
	              dragCb = item.callback;
	            }
	            return item.eventType === 'drag';
	          });

	          hasEventDragEnd = whichIn.length > 0 && whichIn[0].events && whichIn[0].events.some(function(item) {
	            if(item.eventType === 'dragend') {
	              dragEndCb = item.callback;
	            }
	            return item.eventType === 'dragend';
	          });

	          var move_Event = function(e_move) {
	            var mx = _this._event.getPos(e_move).x,
	              my = _this._event.getPos(e_move).y;

	            whichIn[0].moveX = whichIn[0].moveX + mx - that.cacheX;
	            whichIn[0].moveY = whichIn[0].moveY + my - that.cacheY;

	            // event drag
	            hasEventDrag && dragCb();

	            _this.drawUtils.redraw();
	            that.cacheX = mx;
	            that.cacheY = my;
	            whichIn[0].isDragging = true;
	          };

	          var up_Event = function(e_up) {
	            var uX = _this._event.getPos(e_up).x;
	            var uY = _this._event.getPos(e_up).y;

	            var upOn = _this._objects.filter(function(item) {
	              return item.isPointInner(uX, uY) && !item.isBg;
	            });

	            if(upOn && upOn.length > 1) {
	              if(upOn[1].hasDraggedIn) {
	                upOn[1].hasDraggedIn = false;
	                var dp = upOn[1].events.some(function(i) {
	                  return i.eventType === 'drop' && i.callback && i.callback(upOn[0]);
	                });

	                !dp && upOn[1].events.some(function(i) {
	                  return i.eventType === 'dragout' && i.callback && i.callback();
	                });
	              }
	            }

	            // event dragend
	            hasEventDragEnd && dragEndCb();

	            _this.utils.unbind(document, 'mousemove', move_Event);
	            _this.utils.unbind(document, 'mouseup', up_Event);
	            whichIn[0].isDragging = false;
	          };
	          if(whichIn && whichIn.length > 0 && whichIn[0].enableDrag) {
	            _this.utils.bind(document, 'mousemove', move_Event);
	            _this.utils.bind(document, 'mouseup', up_Event);
	          }
	        }

	        // global translate
	        if(_this.enableGlobalTranslate && !(whichIn && whichIn.length > 0)) {

	          var move_dragCanvas = function(e_move) {
	            var mx = _this._event.getPos(e_move).x,
	              my = _this._event.getPos(e_move).y;
	            _this.transX = _this.transX + mx - that.cacheX;
	            _this.transY = _this.transY + my - that.cacheY;
	            _this.drawUtils.redraw();
	            that.cacheX = mx;
	            that.cacheY = my;
	          };

	          var up_dragCanvas = function() {
	            _this.utils.unbind(document, 'mousemove', move_dragCanvas);
	            _this.utils.unbind(document, 'mouseup', up_dragCanvas);
	          };

	          _this.utils.bind(document, 'mousemove', move_dragCanvas);

	          _this.utils.bind(document, 'mouseup', up_dragCanvas);
	        }
	      },

	      changeOrder: function(item) {
	        var i = _this.objects.indexOf(item);
	        var cacheData = _this.objects[i];
	        _this.objects.splice(i, 1);
	        _this.objects.push(cacheData);
	        _this._objects = _this.utils.reverse(_this.objects);
	        _this.drawUtils.redraw();
	      }

	    };

	  };

	// Source: src/color.js

	  LCL.prototype.color = {

	    // converts hex to RGB
	    hexToRGB: function(hex) {
	      var rgb = [];

	      hex = hex.substr(1);

	      // converts #abc to #aabbcc
	      if (hex.length === 3) {
	        hex = hex.replace(/(.)/g, '$1$1');
	      }

	      hex.replace(/../g, function(color){
	        rgb.push(parseInt(color, 0x10));
	      });

	      return {
	        r: rgb[0],
	        g: rgb[1],
	        b: rgb[2],
	        rgb: "rgb(" + rgb.join(",") + ")"
	      };
	    },

	    // converts rgb to HSL
	    rgbToHSL: function(r, g, b) {
	      r /= 255, g /= 255, b /= 255;
	      var max = Math.max(r, g, b),
	        min = Math.min(r, g, b);
	      var h, s, l = (max + min) / 2;

	      if(max == min){
	        h = s = 0; // achromatic
	      }else{
	        var d = max - min;
	        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
	        switch(max){
	        case r:
	          h = (g - b) / d + (g < b ? 6 : 0);
	          break;
	        case g:
	          h = (b - r) / d + 2;
	          break;
	        case b:
	          h = (r - g) / d + 4;
	          break;
	        }
	        h /= 6;
	      }

	      return {
	        h: h,
	        s: s,
	        l: l,
	        hsl: "hsl(" + h * 360 + ', ' + s * 100 + '%' + ', ' + l * 100 + '%' + ")"
	      };
	    },

	    // converts hsl to RGB
	    hslToRGB: function() {
	    },

	    // color lighten
	    lighten: function(color, percent) {
	      var hsl, h, s, l;
	      if(!color || !percent || !/^[0-9]{1,2}%$/.test(percent)) {
	        return;
	      }
	      hsl = this.getHsl(color);
	      h = hsl.h;
	      s = hsl.s;
	      l = hsl.l * 100 + +percent.slice(0, -1);

	      return "hsl(" + h * 360 + ', ' + s * 100 + '%' + ', ' + l + '%' + ")";
	    },

	    // color darken
	    darken: function(color, percent) {
	      var hsl, h, s, l;
	      if(!color || !percent || !/^[0-9]{1,2}%$/.test(percent)) {
	        return;
	      }
	      hsl = this.getHsl(color);
	      h = hsl.h;
	      s = hsl.s;
	      l = hsl.l * 100 - +percent.slice(0, -1);
	      return "hsl(" + h * 360 + ', ' + s * 100 + '%' + ', ' + l + '%' + ")";
	    },

	    isHex: function(color) {
	      return /^#[a-fA-F0-9]{3}$|#[a-fA-F0-9]{6}$/.test(color);
	    },

	    isRgb: function(color) {
	      return /^rgb\((\s*[0-5]{0,3}\s*,?){3}\)$/.test(color);
	    },

	    isRgba: function(color) {
	      return /^rgba\((\s*[0-5]{0,3}\s*,?){3}[0-9.\s]*\)$/.test(color);
	    },

	    getRgb: function(color) {
	      var rgb, r, g, b;
	      if(this.isHex(color)) {
	        rgb = this.hexToRGB(color);
	        r = rgb.r;
	        g = rgb.g;
	        b = rgb.b;
	      } else if(this.isRgb(color)) {
	        rgb = color.slice(4, -1).split(',');
	        r = rgb[0],
	        g = rgb[1],
	        b = rgb[2];
	      }
	      return {
	        r: r,
	        g: g,
	        b: b
	      };
	    },

	    getHsl: function(color) {
	      var hsl, rgb, r, g, b, h, s, l;
	      rgb = this.getRgb(color);
	      r = rgb.r;
	      g = rgb.g;
	      b = rgb.b;

	      hsl = this.rgbToHSL(r, g, b);
	      h = hsl.h;
	      s = hsl.s;
	      l = hsl.l;
	      return {
	        h: h,
	        s: s,
	        l: l
	      };
	    }

	  };

	// Source: src/utils.js

	  LCL.prototype.utils = {};

	  LCL.prototype.utils.getPos = function(e) {
	    var ev = e || event;
	    var x = ev.pageX,
	      y = ev.pageY;
	    return {
	      x: x,
	      y: y
	    };
	  };

	  LCL.prototype.utils.bind = function(target, eventType, handler) {
	    try {
	      if (window.addEventListener) {
	        target.addEventListener(eventType, handler, false);
	      } else if (target.attachEvent) {
	        target.attachEvent('on' + eventType, handler);
	      } else {
	        target['on' + eventType] = handler;
	      }
	      return target;
	    } catch(e) {}
	  };

	  LCL.prototype.utils.unbind = function(target, eventType, handler) {
	    try {
	      if (window.removeEventListener) {
	        target.removeEventListener(eventType, handler, false);
	      } else if (window.detachEvent) {
	        target.detachEvent(eventType, handler);
	      } else {
	        target['on' + eventType] = '';
	      }
	    } catch(e) {}
	  };

	  // do not change the origin array
	  LCL.prototype.utils.reverse = function(array) {
	    var length = array.length;
	    var ret = [];
	    for(var i = 0; i < length; i++) {
	      ret[i] = array[length - i -1];
	    }
	    return ret;
	  };

	  LCL.prototype.utils.imageLoader = function() {
	    this.imageList = new Array();
	    this.loadNum = 0;
	  };

	  LCL.prototype.utils.imageLoader.prototype = {

	    ready: function(callback) {
	      var that = this;
	      this.imageList.forEach(function(img){
	        that.loadImg(img);
	      });
	      var timer = setInterval(function(){
	        if(that.loadNum === that.imageList.length){
	          clearInterval(timer);
	          callback && callback();
	        }
	      }, 50);
	    },

	    loadImg: function(img) {
	      var that = this;
	      var timer = setInterval(function(){
	        if(img.complete === true){
	          that.loadNum++;
	          clearInterval(timer);
	        }
	      }, 50);
	    },

	    addImg: function(imageArray) {
	      var that = this;
	      imageArray.forEach(function(src) {
	        var img = new Image();
	        img.src = src;
	        img.name = src;
	        img.loaded = false;
	        that.imageList.push(img);
	      });
	    },

	    getImg: function(name) {
	      var target;
	      this.imageList.forEach(function(img){
	        if(img.name == name){
	          target = img;
	        }
	      });
	      return target;
	    }

	  };

	  LCL.prototype.utils.calculateCoord = function(max, min) {
	    var gap, // return value -> gap
	      retMax, // return value -> max
	      absMax, // absolute value -> max
	      calcMax, // converted max
	      numLength; // max value length
	    var ma = Math.abs(max), mi = Math.abs(min);
	    absMax = ma >= mi ? ma : mi;
	    numLength = absMax < 1 ? absMax.toString().length : absMax.toString().length;
	    calcMax = absMax < 1 ? this.formatFloat( absMax * Math.pow(10, numLength - 2), 1 ) : ( absMax / Math.pow(10, numLength - 1) );
	    if(calcMax === 1 && numLength > 1) {
	      calcMax = 10;
	      numLength --;
	    } else if(calcMax > 10) {
	      var l = calcMax.toString().length;
	      calcMax = calcMax / Math.pow(10, l - 1);
	      numLength = numLength - l + 1;
	    }

	    var granularity = [
	      [1, 0.2],
	      [1.2, 0.2],
	      [1.4, 0.2],
	      [1.5, 0.3],
	      [1.8, 0.3],
	      [2, 0.4],
	      [2.5, 0.5],
	      [3, 0.5],
	      [3.5, 0.5],
	      [4, 0.5],
	      [5, 1],
	      [6, 1],
	      [7, 1],
	      [8, 1],
	      [10, 2]
	    ];

	    granularity.forEach(function(item, index) {
	      var pre = index === 0 ? 0 : granularity[index - 1][0];
	      if(pre < calcMax && calcMax <= item[0]) {
	        gap = item[1],
	        retMax = item[0];
	      }
	    });

	    return {
	      gap: absMax < 1 ? ( gap / Math.pow(10, numLength - 2) ) :  ( gap * Math.pow(10, numLength - 1) ),
	      max: absMax < 1 ? ( retMax / Math.pow(10, numLength - 2) ) : ( retMax * Math.pow(10, numLength - 1) )
	    };

	  };

	  // adjustment accuracy
	  LCL.prototype.utils.formatFloat = function(f) {
	    var m = Math.pow(10, 10);
	    return parseInt(f * m, 10) / m;
	  };

	  // get max xAxis or yAxis
	  LCL.prototype.utils.getMaxMin = function(isX, series, xAxis) {
	    var max, min, maxArray = [], minArray = [];
	    series.forEach(function(item) {
	      var ma = [];
	      item.data.forEach(function(i) {
	        if(isX) {
	          ma.push(i[0]);
	        } else {
	          xAxis.data && xAxis.data.length > 0 ? ma.push(i) : ma.push(i[1]);
	        }
	      });
	      maxArray.push(Math.max.apply(null, ma));
	      minArray.push(Math.min.apply(null, ma));
	    });
	    max = Math.max.apply(null, maxArray);
	    min = Math.min.apply(null, minArray);

	    return {
	      max: max,
	      min: min
	    };
	  };

	  // requestAnimationFrame polyfill
	  (function() {
	    var lastTime = 0;
	    var vendors = ['ms', 'moz', 'webkit', 'o'];
	    try {
	      for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
	        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
	        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
	      }
	      if (!window.requestAnimationFrame) window.requestAnimationFrame = function(callback) {
	        var currTime = new Date().getTime();
	        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
	        var id = window.setTimeout(function() {
	          callback(currTime + timeToCall);
	        }, timeToCall);
	        lastTime = currTime + timeToCall;
	        return id;
	      };
	      if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function(id) {
	        clearTimeout(id);
	      };
	    } catch(e) {}

	  }());

	// Source: src/footer.js
	  
	  //exports to multiple environments
	  if(true) {
	    module.exports = LCL;
	  } else if(typeof define === 'function' && define.amd) {
	    define(function(){
	      return LCL;
	    });
	  } else {
	    window.LCL = LCL;
	  }

	})();

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	
	var utils = __webpack_require__(4);

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

/***/ },
/* 4 */
/***/ function(module, exports) {

	
	var utils = {

		getPos: function(e) {
	    var e = e || event;
	    var x = e.pageX,
	      y = e.pageY;
	    return {
	      x: x, 
	      y: y
	    };
	  }

	};

	module.exports = utils;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	
	var utils = __webpack_require__(4);

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

/***/ },
/* 6 */
/***/ function(module, exports) {

	
	function ToolTip() {
		this.dom = null;
	}

	ToolTip.prototype = {

		init: function() {
			this.initDom();
		},

		initDom: function() {
			var style = 'position: absolute; display: none; border-style: solid; white-space: nowrap; z-index: 9999999; transition: left 0.4s cubic-bezier(0.23, 1, 0.32, 1), top 0.4s cubic-bezier(0.23, 1, 0.32, 1); background-color: rgba(50, 50, 50, 0.701961); border-width: 0px; border-color: rgb(51, 51, 51); border-radius: 4px; color: rgb(255, 255, 255); font-style: normal; font-variant: normal; font-weight: normal; font-stretch: normal; font-size: 14px; font-family: sans-serif; line-height: 21px; padding: 5px;';
			this.dom = document.createElement('div');
			this.dom.style = style;

			this.dom.innerHTML = '';

			document.body.appendChild(this.dom);
		},

		setValue: function(value) {
			var innerhtml = value.title + '<br><span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + value.color + '"></span>' + value.name + ' : ' + value.value + '';
			this.dom.innerHTML = innerhtml;
		},

		getDom: function() {
			return this.dom;
		}

	};

	module.exports = ToolTip;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	
	var LCL = __webpack_require__(2);

	function expand(world, expand) {
		LCL.prototype[expand.name] = expand.shape.bind(world);
		var isPointInner = expand.isPointInner.bind(world);
		world.pointerInnerArray.push({
			type: expand.name,
			isPointInner: isPointInner
		})
	}

	module.exports = expand;

/***/ },
/* 8 */
/***/ function(module, exports) {

	
	var textColor = function(settings) {

	  var _this = this;

	  var draw = function() {
	    var canvas = _this.canvas,
	      type = settings.type,
	      startX = this.startX = settings.startX,
	      startY = this.startY = settings.startY,
	      height = this.height = 14,
	      WIDTH = 24,
	      radius = 4;
	      color = settings.color,
	      label = settings.label;

	    canvas.save();
	    canvas.translate(this.moveX, this.moveY);
	    if(this.fixed) {
	      canvas.translate(-_this.transX, -_this.transY);
	    }
	    if(type === 'bar') {
	      // draw rect width radius
	      canvas.fillStyle = color;
	      canvas.beginPath();
	      canvas.moveTo(startX + radius, startY);
	      canvas.lineTo(startX + WIDTH - radius, startY);
	      canvas.quadraticCurveTo(startX + WIDTH, startY, startX + WIDTH, startY + radius);
	      canvas.lineTo(startX + WIDTH, startY + height - radius);
	      canvas.quadraticCurveTo(startX + WIDTH, startY + height, startX + WIDTH - radius, startY + height);
	      canvas.lineTo(startX + radius, startY + height);
	      canvas.quadraticCurveTo(startX, startY + height, startX, startY + height - radius);
	      canvas.lineTo(startX, startY + radius);
	      canvas.quadraticCurveTo(startX, startY, startX + radius, startY);
	      canvas.fill();
	      canvas.closePath();
	      canvas.fillStyle = '#6c6c6c';
	      canvas.font = '12px serif';
	      canvas.textAlign = 'left';
	      canvas.textBaseline = 'top';
	      canvas.fillText(label, startX + WIDTH + 4, startY);
	    } else if(type === 'line') {
	      canvas.beginPath();
	      canvas.strokeStyle = color;
	      canvas.lineWidth = 2;
	      canvas.moveTo(startX, startY + 8);
	      canvas.lineTo(startX + WIDTH, startY + 8);
	      canvas.stroke();
	      canvas.closePath();
	      canvas.save();
	      canvas.fillStyle = color;
	      canvas.translate(startX + WIDTH/2, startY + 8);
	      canvas.arc(0, 0, 5, 0, Math.PI*2);
	      canvas.fill();
	      canvas.restore();
	      canvas.fillStyle = '#6c6c6c';
	      canvas.font = '12px serif';
	      canvas.textAlign = 'left';
	      canvas.textBaseline = 'top';
	      canvas.fillText(label, startX + WIDTH + 4, startY);
	    }
	    this.width = canvas.measureText(label).width + WIDTH + 4;
	    
	    canvas.restore();
	  };

	  return Object.assign({}, _this.display(settings), {
	    type: 'textColor',
	    draw: draw
	  });
	};

	module.exports = {
	  name: 'textColor',
	  shape: textColor,
	  isPointInner: function(_this, x, y) {
	    var ltx = _this.fixed ? 0 : this.transX;
	    var lty = _this.fixed ? 0 : this.transY;
	    var mx = _this.moveX,
	      my = _this.moveY;
	    var xRight = x > _this.startX + mx + ltx;
	    var xLeft = x < _this.startX + _this.width + mx + ltx;
	    var yTop = y > _this.startY + my + lty;
	    var yBottom = y < _this.startY + _this.height + my + lty;
	    return !!(xRight && xLeft && yTop && yBottom);
	  }
	};

/***/ },
/* 9 */
/***/ function(module, exports) {

	
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
						label: item.name,
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

/***/ }
/******/ ]);