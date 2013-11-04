function singletest() {
  var startMove;
  var stopMove;
  var startPassClient;
  var stopPassClient;
  var avgMoveResponseTime;
  var moveCnt;
  var _c;
  var isWaiting;
  var passClientUrl;

  this.init = function() {
    avgMoveResponseTime = 0;
    moveCnt = 0;
    isWaiting = false;
    _c = {
      x: 0,
      y: 0
    };
  }

  this.triggerMove = function() {
    var that = this;
    _c.x = player._getX();
    _c.y = player._getY();
    startMove = new Date();
    isWaiting = true;
  }

  this.responseMove = function() {
    if (isWaiting)
      if (_c.x != player._getX() || _c.y != player._getY()) {
        stopMove = new Date();
        console.log('Response Time : ' + (stopMove - startMove) + ' milliseconds');
        avgMoveResponseTime = (avgMoveResponseTime * moveCnt + (stopMove - startMove)) / (moveCnt + 1);
        moveCnt++;
        _c.x = player._getX();
        _c.y = player._getY();
        isWaiting = false;
        this.getMovePerformance();
      }
  }

  this.getMovePerformance = function() {
    console.log('AvgTime:' + avgMoveResponseTime + ' milliseconds, from total events:' + moveCnt);
    return {
      avgTime: avgMoveResponseTime,
      numevents: moveCnt
    };
  }


  this.triggerPassClient = function(url) {
    startPassClient = new Date();
    this.passClientUrl = url;
    console.log("$$$$$$$$$$$ Pass triger started : " + url + 'x : ' + player.getX() + ' y: ' + player.getY());
  }

  this.responsePassClient = function(url) {

    if (url == this.passClientUrl) {
      stopPassClient = new Date();
      console.log("$$$$$$$$$ Pass triger stopped : " +
        url + 'x : ' + player.getX() + ' y: ' + player.getY())
      this.getPassClientPerformance();
    }
  }

  this.getPassClientPerformance = function() {
    var timeToPassClient = stopPassClient - startPassClient;
    console.log('$$$$$$$$$$$ Time taken to pass the client :' + timeToPassClient);

  }
}