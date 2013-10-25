function GraphicEngine() {
  var canvasSize;
  var canvas;
  var ctx;
  var origin;

  this.init = function(width, height) {
    canvasSize = {
      WIDTH: width,
      HEIGHT: height
    };
    origin = {
      x: 0,
      y: 0
    };

    canvas = document.getElementById('layer2');
    ctx = canvas.getContext("2d");
    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height - 50);
    console.log('Init graphic engine with WIDTH:' + width + ' HEIGHT:' + height);
  }

  this.clear = function() {
    ctx.clearRect(0, 0, canvasSize.WIDTH, canvasSize.HEIGHT);
  }

  this.drawRotatedImage = function(image, player) {
    var x = (player.dx - origin.x) % canvasSize.WIDTH;
    var y = (player.dy - origin.y) % canvasSize.HEIGHT;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(player.da * TO_RADIANS);
    ctx.drawImage(image, -(image.width / 2), -(image.height / 2));
    ctx.restore();
  }

  this.setOriginOfCanvas = function(x, y) {
    origin.x = x;
    origin.y = y;
    console.log(TAG + 'set origin point x:' + x + ' y:' + y);
  }
  this.getOriginOfCanvas = function(){
    return origin;
  }
}