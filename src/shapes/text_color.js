
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

module.exports = textColor;