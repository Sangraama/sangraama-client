<!--//
var timer;

function bot() {
  var D = true;
  var TAG = "Bot : ";

  var isStart = false;
  var c = new config();
  var t = 0;
  //var timer;

  this.init = function() {

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
  }
  // Logic
  run = function() {
    console.log('Iteration : ' + t++);
  }
}
// -->