<!--//

function BotAI() {
  var z; // Territory ID

  var range = 200; // Radius
  var gap = 30; // Gap between inner and outer cycles
  var tolerance = 4;
  this.init = function(tolerance, Z) {
    z = Z;
    console.log('AI is waiting tolerance:' + tolerance);
  }

  this.getBestRoute = function(p, e, t) {
    var dir = {
      v_x: 0,
      v_y: 0
    };
    var w = e.x - p.x;
    var h = e.y - p.y;
    var dirX = (w > 0) ? 1 : -1; // Assume: there isn't any state which w == 0
    var dirY = (h > 0) ? 1 : -1;
    // console.log('h:' + h + ' w:' + w + '  v_x:' + dirX + ' v_y:' + dirY);
    w = Math.abs(w);
    h = Math.abs(h);

    if (Math.sqrt((h * h) + (w * w)) < range) { // If in the enemey range, go far
      // console.log(t + ' => ' + 'beyond range' + ' h :' + h + ' w:' + w);
      dir.v_x = (w < range) ? (dirX * -1) : (w > 2 * range) ? dirX : 0;
      dir.v_y = (h < range) ? (dirY * -1) : (h > 2 * range) ? dirY : 0;
      return dir;
    } else if (h < tolerance) { // Get closer to enemy to better shot
      if (w > range + gap)
        dir.v_x = dirX; // move along x direction
      // console.log(t + ' => ' + 'tolerance 1' + ' h :' + h + ' w:' + w);
      return dir;
    } else if (w < tolerance) {
      if (h > range + gap)
        dir.v_y = dirY; // move along y direction
      // console.log(t + ' => ' + 'tolerance 2' + ' h :' + h + ' w:' + w);
      return dir;
    } else if (Math.sqrt((h * h) + (w * w)) < range + gap) {
      // Not prefer to set angle here
      var angle = ((dirX > 0) ? ((dirY > 0) ? 45 : 315) : ((dirY > 0) ? 135 : 225));
      player[z].setAngle(angle);
      // console.log('angle :' + angle + ' h :' + h + ' w:' + w);
      return dir;
    }

    if (Math.sqrt((h * h) + (w * w)) > range + gap) {
      if (h > w + tolerance) {
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
      }
      // console.log(dir);
    }
    return dir;
  }
}
// -->