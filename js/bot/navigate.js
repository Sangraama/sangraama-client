<!--//

function navigate() {
  var D = false;
  var TAG = 'Bot/navigate: ';
  var evt;

  this.init = function(d) {
    D = d;
    evt = {
      keyCode: 0
    };
    console.log(TAG + ' create anavigation object. debug:' + D);
  }
  this.goRight = function() {
    evt.keyCode = 39;
    doKeyDown(evt);
  }
  this.stopGoRight = function() {
    evt.keyCode = 39;
    doKeyUp(evt);
  }
  this.getBestRoute = function(currentX, currentY, nextX, nextY) {

  }
}
// -->