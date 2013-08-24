var playerList = new Array();
var bulletList = new Array();

function GraphicObject() {
  this.x = 0;
  this.y = 0;
  this.angle = 0;
};
drawRotatedImage = function(image, player) {
  ctx.save();
  ctx.translate(player.x, player.y);
  ctx.rotate(player.angle * TO_RADIANS);
  ctx.drawImage(image, -(image.width / 2), -(image.height / 2));
  ctx.restore();
}

function GraphicEngine() {
  /*var world;
    this.init = function() {
        var gravity = new b2Vec2(0, -10);
        var doSleep = false;
        world = new b2World(gravity, doSleep);
    }*/
  this.clear = function() {
    ctx.clearRect(0, 0, scanvas.WIDTH, scanvas.HEIGHT);
  }


  this.drawShootImage = function(image, bullet) {
    ctx.save();
    ctx.translate(bullet.dx, bullet.dy);
    ctx.rotate(bullet.a * TO_RADIANS);
    ctx.drawImage(image, -(image.width / 2), -(image.height / 2));
    ctx.restore();
  }
  this.rect = function(x, y, w, h) {
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  this.processObjects = function() {
    var screenHeight = canvas.getAttribute('height');
    var screenWidth = canvas.getAttribute('width');
    var width = screenWidth / 2;
    var height = screenHeight / 2;
    var pp = playerList[player.userID];
    if (typeof pp !== "undefined") {
      var x = pp.x;
      var y = pp.y;
      // if(((x-width) > mapMinX) && ((x+width) < mapMaxX) && ((y-height) > mapMinY) && ((y+height) < mapMaxY)){
      pp.x = pp.x % screenWidth;
      pp.y = pp.y % screenHeight;
      // }
      playerList[player.userId] = pp;
    }
    processPlayers();
    processBullets();
  }
  processPlayers = function() {
    for (var index in playerList) {
      var gPlayer = playerList[index];
      this.drawRotatedImage(ship, gPlayer);
    }
  };
  processBullets = function() {
    for (var index in bulletList) {
      var gBullet = bulletList[index];
      this.drawRotatedImage(bullet, gBullet);
    }
  };

};