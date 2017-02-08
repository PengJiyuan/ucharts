
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