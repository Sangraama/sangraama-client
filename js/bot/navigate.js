<!--//

function navigate() {
  var D = false;
  var TAG = 'Bot/navigate: ';
  var z; // Territory ID

  var evt;
  var isRanNav;
  var ranNavTimer;

  this.init = function(d, Z) {
    z = Z;
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
        player[z].setV_x(tmp - 1);
      tmp = Math.floor(Math.random() * 4) % 3;
      if (tmp != 0)
        player[z].setV_y(tmp - 1);

      window.setTimeout(function() {
        isRanNav = false;
      }, Math.floor(Math.random() * 1000) + 500);
      sangraama[z].triggerEvent();
      isRanNav = true;
    }
    return isRanNav;
  }
  this.moveOn = function(dir) {
    // console.log('moveOn v_x:' + dir.v_x + ' v_y:' + dir.v_y);
    if (dir.v_x == 0)
      player[z].resetV_x();
    else
      player[z].setV_x(dir.v_x);

    if (dir.v_y == 0)
      player[z].resetV_y();
    else
      player[z].setV_y(dir.v_y);

    sangraama[z].triggerEvent();
  }
  this.stopMove = function() {
    player[z].resetV_x();
    player[z].resetV_y();
    isRanNav = false;
    sangraama[z].triggerEvent();
  }
  this.getBestRoute = function(currentX, currentY, nextX, nextY) {

  }
}
// -->