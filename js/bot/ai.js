<!--//

function botAI() {
  var z; // Territory ID

  var range = 150; // Radius
  var gap = 100; // Gap between inner and outer cycles
  var tolerance = 10;
  var isInRange = false; // true if currently in range and shooting

  this.init = function(tolerance, Z) {
    z = Z;
    console.log('AI is waiting tolerance:' + tolerance);
  }

  this.getBestRoute = function(p, e, t) {
    var dir = {
      v_x: 0,
      v_y: 0,
      a: -1,
      s: 0
    };
    var w = e.x - p.x;
    var h = e.y - p.y;
    var dirX = (w > 0) ? 1 : -1; // Assume: there isn't any state which w == 0
    var dirY = (h > 0) ? 1 : -1;
    // console.log('h:' + h + ' w:' + w + '  v_x:' + dirX + ' v_y:' + dirY);
    w = Math.abs(w);
    h = Math.abs(h);
    var hypotenuse = Math.sqrt((h * h) + (w * w));

    if (hypotenuse < range) { // If in the enemey range, go far away
      // console.log(t + ' => ' + 'beyond range' + ' h :' + h + ' w:' + w);
      dir.v_x = (w < range) ? (dirX * -1) : (w > 2 * range) ? dirX : 0;
      dir.v_y = (h < range) ? (dirY * -1) : (h > 2 * range) ? dirY : 0;
      return dir;
    }

    // Focus to enemy if currently in range
    if (isInRange && hypotenuse < range + 2 * gap) {
      // Not prefer to set angle here
      var angle = (dirY > 0) ? this.getAngleByCos(e.x - p.x, hypotenuse, false) : this.getAngleByCos(e.x - p.x, hypotenuse, true);
      dir.a = angle;
      dir.s = 1;
      // console.log('angle :' + angle + ' h :' + h + ' w:' + w);
      return dir;
    }

    if (hypotenuse > range + gap) {
      if (h > w) {
        dir.v_y = dirY;
        if (w > h / 2)
          dir.v_x = dirX;
      } else {
        dir.v_x = dirX;
        if (h > w / 2)
          dir.v_y = dirY;
      }
      isInRange = false;

    } else {
      isInRange = true;
    }
    return dir;
  }

  this.getAngleByCos = function(dx, hypotenuse, isYNegative) {
    if (isYNegative) {
      return 360 - Math.acos(dx / hypotenuse) * 180 / Math.PI;
    } else {
      return Math.acos(dx / hypotenuse) * 180 / Math.PI;
    }
  }
}
// -->