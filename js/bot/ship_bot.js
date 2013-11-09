<!--//

function bot() {
  var D = true;
  var TAG = "Bot : ";
  var z; // Territory ID

  var tolerance;
  var isStart = false;
  var timer;
  var c = new config();
  var t = 0;
  var nav, ai;
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

    nav = new navigate();
    nav.init(D, z);
    ai = new BotAI();
    ai.init(tolerance, z);
  }
  this.isStart = function() {
    return isStart;
  }
  // Start bot
  this.start = function() {
    isStart = true;
    window.clearInterval(timer);
    /*window.setTimeout(function() {
        console.log('Iteration : ' + t++);
        //run();
      }, 3000 / c.getUpdateRate());*/

    timer = window.setInterval(function() {
      run();
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
  run = function() {
    // console.log(TAG + ' #enemies = ' + enemies.length);
    console.log(t+++' player[' + z + '] x:' + player[z].getX() + ' y:' + player[z].getY());
    if (!nav.isRandomNavigate() && enemies.length == 0) {
      nav.randomNavigate();
    } else {
      if (_.contains(enemies, enemy.userID)) { // Enemy is still alive
        var dir = ai.getBestRoute(ship, enemy, t++);
        var w = Math.abs(enemy.x - ship.x);
        var h = Math.abs(enemy.y - ship.y);
        if (w < tolerance + 5 || h < tolerance + 5 || Math.abs(h - w) < tolerance + 70) {
          if (t % (c.getUpdateRate()) == 0) {
            player[z].shoot();
            sangraama[z].triggerEvent();
            deadLockCnt = 0;
          }
        }
        if (!_.isEqual(dir, prevDir)) {
          nav.moveOn(dir);
          deadLockCnt++;
        }
        if (deadLockCnt > 50) {
          nav.randomNavigate();
          deadLockCnt = 0;
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