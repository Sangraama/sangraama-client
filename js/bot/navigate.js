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
      }, Math.floor(Math.random() * 1000) + 500);
      sangraama.triggerEvent();
      isRanNav = true;
    }
    return isRanNav;
  }
  this.moveOn = function(dir) {
    // console.log('moveOn v_x:' + dir.v_x + ' v_y:' + dir.v_y);
    if (dir.v_x == 0)
      player.resetV_x();
    else
      player.setV_x(dir.v_x);

    if (dir.v_y == 0)
      player.resetV_y();
    else
      player.setV_y(dir.v_y);

    sangraama.triggerEvent();
  }
  this.stopMove = function() {
    player.resetV_x();
    player.resetV_y();
    isRanNav = false;
    sangraama.triggerEvent();
  }
  this.getBestRoute = function(currentX, currentY, nextX, nextY) {

  }
}
// -->