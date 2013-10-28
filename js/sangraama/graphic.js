function GraphicEngine() {
  var TAG = 'GraphicEngine : ';
  var canvasSize;
  var canvas;
  var canvas2;
  var ctx;
  var ctx2;
  var origin;
  var scalingFactor; // 1 unit in server => 32 pixels in canvas
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

    canvas2 = document.getElementById('layer3');
    ctx2 = canvas2.getContext("2d");
    canvas2.setAttribute('width', width);
    canvas2.setAttribute('height', height - 50);
    console.log('Init graphic engine with WIDTH:' + width + ' HEIGHT:' + height);
    scalingFactor = 32;
  }

  this.clear = function() {
    ctx.clearRect(0, 0, canvasSize.WIDTH, canvasSize.HEIGHT);
  }
  this.clear2 = function() {
    ctx2.clearRect(0, 0, canvasSize.WIDTH, canvasSize.HEIGHT);
  }

  this.drawRotatedImage = function(image, player) {
    var x = (player.dx * scalingFactor - origin.x) % canvasSize.WIDTH;
    var y = (player.dy * scalingFactor - origin.y) % canvasSize.HEIGHT;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(player.da * TO_RADIANS);
    ctx.drawImage(image, -(image.width / 2), -(image.height / 2));
    ctx.restore();
  }

  this.drawRotatedImage2 = function(image, player) {
    var x = (player.dx * scalingFactor - origin.x) % canvasSize.WIDTH;
    var y = (player.dy * scalingFactor - origin.y) % canvasSize.HEIGHT;
    ctx2.save();
    ctx2.translate(x, y);
    ctx2.rotate(player.da * TO_RADIANS);
    ctx2.drawImage(image, -(image.width / 2), -(image.height / 2));
    ctx2.restore();
  }

  this.setOriginOfCanvas = function(x, y) {
    origin.x = x;
    origin.y = y;
    console.log(TAG + 'set origin point x:' + x + ' y:' + y);
  }
  this.getOriginOfCanvas = function() {
    return origin;
  }

  this.multiplyScale = function(value) {
    return value * scalingFactor;
  }

  this.divideScale = function(value) {
    return value / scalingFactor;
  }
}