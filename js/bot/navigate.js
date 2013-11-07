<!--//

function navigate() {
  var D = false;
  var TAG = 'Bot/navigate: ';
  var evt;
  var isRanNav;
  var ranNavTimer;

  this.init = function(d) {
    D = d;
    isRanNav = false; // TRUE if random navigation on progress
    console.log(TAG + ' create anavigation object. debug:' + D);
  }
  this.isRandomNavigate = function() {
    return isRanNav;
  }
  this.randomNavigate = function() {
    if (!isRanNav) {
      var tmp = Math.floor(Math.random() * 4) % 3;
      if (tmp != 0)
        player.setV_x(tmp - 1);
      tmp = Math.floor(Math.random() * 4) % 3;
      if (tmp != 0)
        player.setV_y(tmp - 1);

      window.setTimeout(function() {
        isRanNav = false;
      }, Math.floor(Math.random() * 3000) + 1000);
      sangraama.triggerEvent();
      isRanNav = true;
    }
    return isRanNav;
  }
  this.stopRandomNavigate = function() {
    if (isRanNav) {
      player.resetV_x();
      player.resetV_y();
      isRanNav = false;
      sangraama.triggerEvent();
    }
  }
  this.getBestRoute = function(currentX, currentY, nextX, nextY) {

  }
}
// -->