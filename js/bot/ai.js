<!--//

function botAI() {
  var range = 100; // Radius
  var gap = 100; // Gap between inner and outer cycles
  var tolerance = 10;
  var isInRange = false; // true if currently in range and shooting

  this.init = function(tolerance) {
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
    /* else if (h < tolerance) { // Get closer to enemy to better shot
      if (w > range + gap)
        dir.v_x = dirX; // move along x direction
      // console.log(t + ' => ' + 'tolerance 1' + ' h :' + h + ' w:' + w);
      return dir;
    } else if (w < tolerance) {
      if (h > range + gap)
        dir.v_y = dirY; // move along y direction
      // console.log(t + ' => ' + 'tolerance 2' + ' h :' + h + ' w:' + w);
      return dir;
    }*/

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
      /*if (h > w + tolerance) {
        if (Math.abs(h - w) > w) { // move to make w == 0 in x direction
          // console.log('######################1 : ' + Math.abs(h - w));
          dir.v_x = dirX;
        } else { // move to make x == y in y direction
          // console.log('######################2');
          dir.v_y = dirY;
        }
        // console.log(t + ' => ' + 'h > w' + ' h :' + h + ' w:' + w);
      } else if (h < w - tolerance) {
        if (Math.abs(h - w) > h) { // move to make h == 0 in y direction
          dir.v_y = dirY;
          // console.log('********1');
        } else { // move to make x == y in x direction
          dir.v_x = dirX;
          // console.log('********2');
        }
        // console.log(t + ' => ' + 'h < w' + ' h :' + h + ' w:' + w);
      } else {
        dir.v_x = dirX;
        dir.v_y = dirY;
        // console.log(t + ' => ' + 'h = w' + ' h :' + h + ' w:' + w);
      }*/

      // console.log(dir);
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