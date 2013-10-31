  var D = true;

  var player;
  var gEngine;
  var aoihandler;
  var mapLoader;
  var clickSound;
  var ship = new Image();
  var bullet = new Image();
  var blast = new Image();
  var mapImage = new Image();

  // stablish
  /*  var player = {
    type: 1,
    userID: 1,
    x: 0, // have to move x,y like w & h in order to optimize. Otherwise we are sending them all the time. #gihan
    y: 0,
    v_x: 0,
    v_y: 0,
    a: 0, //actual angle
    da: 0, // delta angle
    s: 0
  };*/

  // Setup client side
  window.onload = function() {
    var stringValue = window.localStorage.getItem("user");
    var user = JSON.parse(stringValue);
    console.log(stringValue);
    sangraama = new SangraamaClient();
    sangraama.init();
    mapLoader = new MapLoader();
    gEngine = new GraphicEngine();
    var screenSize = viewport();
    mapLoader.init(screenSize.width, screenSize.height);
    gEngine.init(screenSize.width, screenSize.height);
    mapLoader.loadMap();

    clickSound = new Audio('audio/shoot.mp3');
    ship.src = 'img/ship' + user.shipType + '.png';
    bullet.src = 'img/bullet' + user.bulletType + '.png';
    /*ship.src = 'img/ship1.png';
    bullet.src = 'img/bullet1.png';*/
    blast.src = 'img/blast.png';
    mapImage.src = 'assert/map/mapImage.jpg';

    // Create player location (this will be given by the login server) as a signed msg
    player = new Player();
    player.init(user.userId);
    player.setCoordination(user.x, user.y);

    player.init(Math.floor(Math.random() * 99998) + 1, sangraama.getScalingFactor());
    player.setCoordination(Math.floor(Math.random() * 200) + 2000, Math.floor(Math.random() * 500) + 400);

    // Initialize AIO handler
    aoihandler = new aoihandler();
    aoihandler.init(sangraama.getScalingFactor());
    aoihandler.setAOI(screenSize.width, screenSize.height);
    aoihandler._setVirtualPoint(player._getX(), player._getY());
    console.log(' initialized window onloads ... ');
  };

  function SangraamaClient() {
    var TAG = 'SangraamaClient : ';
    /**
     * This is the main configuration for client-side. Others values set equal to this.
     * 1 unit in server => 32 pixels in canvas
     * @type {Number}
     */
    var scalingFactor = 32;
    var primaryCon; // player only send updates to the primary server
    var nextPrimaryCon; // previous primary connection, for recovering purpose
    var prevPrimarycon; // To store next primary connection, until it's

    this.init = function() {
      primaryCon = 0;
      nextPrimaryCon = 0;
      prevPrimarycon = 0;
    }
    /**
     * Get Scaling factor. The ratio of client-side displaying pixels : server side JBox2D physics world units
     * @return {[type]} [description]
     */
    this.getScalingFactor = function() {
      return scalingFactor;
    }
    this.scaleUp = function(value) {
      return value * scalingFactor;
    }
    this.scaleDown = function(value) {
      return value / scalingFactor;
    }
    this.setPrimaryCon = function(index) {
      prevPrimarycon = primaryCon;
      primaryCon = index;
    }
    this.getPrimaryCon = function() {
      return primaryCon;
    }
    this.setNextPrimaryCon = function(index) {
      nextPrimaryCon = index;
    }
    this.getNextPrimaryCon = function() {
      return nextPrimaryCon;
    }
    this.getPrevPrimaryCon = function() {
      return prevPrimarycon;
    }


    this.updateServer = function() {
      wsList[primaryCon].send(JSON.stringify(player._getEventToJSON()));
      //console.log('Send update to server ' + primaryCon + ' ' + wsList[primaryCon].getWS().getHostAddress();
    }

    /* Make connection to new server as primary, send event requests */
    this.passConnect = function(host, num) {
      console.log('Create new primary connection to ' + host + ' with ' + num);
      wsList[num] = new WebSocketHandler(host, num);
      wsList[num].connect();
      nextPrimaryCon = num;
      console.log('Make ' + num + 'as  next primaryCon');
      /*
       * Closing privious primary connection mayn't a good idea, coz player
       * doesn't quite from that location immediately
       */
    }

    /* Connecting to another server in order to get updates */
    this.updateConnect = function(host, num) {
      console.log('Reconnect to ' + host + ' with ' + num);
      wsList[num] = new WebSocketHandler(host, num);
      wsList[num].connect();
    }
  }

  //-->