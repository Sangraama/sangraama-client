<!--//
var timer;

function bot() {
  var D = true;
  var TAG = "Bot : ";

  var isStart = false;
  var c = new config();
  var t = 0;
  var nav;

  this.init = function() {
    console.log(TAG + ' create a bot ...');
    // Create navigation
    nav = new navigate();
    nav.init(D);
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
    }, 1000 / c.getUpdateRate());
  }
  // Stop bot
  this.stop = function() {
    isStart = false;
    window.clearInterval(timer);
    // clear events
    nav.stopRandomNavigate();
  }
  // Logic
  run = function() {
    if (!nav.isRandomNavigate()) {
      console.log(t+++' player x:' + player.getX() + ' y:' + player.getY());
      nav.randomNavigate();
    }
  }
}
// -->