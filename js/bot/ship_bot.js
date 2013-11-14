<!--//

function bot() {
  var D = true;
  var TAG = "Bot : ";
  var z; // Territory ID

  var nav, ai, c;
  var
  tolerance;
  var isStart = false;
  var timer;
  var t = 0;
  var enemies = new Array();
  var enemy;
  var ship;
  var prevDir; // Previous direction of ship move. To avoid sending unnessery event to server
  var deadLockCnt = 0;

  this.init = function(id, Z) {
    z = Z;
    console.log(TAG + ' create a bot ...');
    tolerance = 4;
    // Create navigation
    ship = {
      userID: id,
      x: 0,
      y: 0
    };
    enemy = {
      userID: 0,
      x: 0,
      y: 0
    };
    prevDir = {
      v_x: 0,
      v_y: 0
    };

    c = new config();
    nav = new navigate();
    nav.init(D, z);
    ai = new botAI();
    ai.init(tolerance, z);
  }
  this.isStart = function() {
    return isStart;
  }
  // Start bot
  this.start = function() {
    isStart = true;
    window.clearInterval(timer);

    timer = window.setInterval(function() {
      bot[z].run();
    }, Math.floor(Math.random() * 200) + 900 / c.getUpdateRate());
  }

  // Stop bot
  this.stop = function() {
    isStart = false;
    window.clearInterval(timer);
    // clear events
    nav.stopMove();
  }

  // Logic
  this.run = function() {
    // console.log(t +' player[' + z + '] x:' + player[z].getX() + ' y:' + player[z].getY());
    if (!nav.isRandomNavigate() && enemies.length == 0) {
      nav.randomNavigate();
    } else {
      if (_.contains(enemies, enemy.userID)) { // Enemy is still alive
        var dir = ai.getBestRoute(ship, enemy, t++);

        if (!_.isEqual(dir, prevDir)) {
          nav.moveOn(dir);
        }
        if (dir.a != -1) {
          player[z].setAngle(dir.a);
        }
        if (dir.s) {
          player[z].shoot();
          sangraama[z].triggerEvent();
        }

        prevDir = dir;
      } else { // Choose a new enemy
        //@to_implement: Choose min manhattan distance as enemy. IDEA: low computer processing
        enemy.userID = enemies[0]; // Dumb selection, first one in the list
      }
      // Clear enemy list to remove enemies who went out form AOI
      enemies = new Array();
    }
  }

  // Set list enemies
  this.setEnemies = function(data) {
    // console.log(data.userID);
    if (ship.userID == data.userID) {
      ship.x = sangraama[z].scaleUp(data.dx);
      ship.y = sangraama[z].scaleUp(data.dy);
    } else {
      enemies = _.union(enemies, [data.userID]);
      if (enemy.userID == data.userID) {
        enemy.x = sangraama[z].scaleUp(data.dx);
        enemy.y = sangraama[z].scaleUp(data.dy);
      }
    }
  }

  this.getEnemies = function() {
    return enemies;
  }
}
// -->