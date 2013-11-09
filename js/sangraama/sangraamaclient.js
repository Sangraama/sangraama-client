  <!--//
      
  var player;
  var bot;
  var isBot = false;
  var gEngine;
  var aoihandler;
  var mapLoader;
  var clickSound;
  var ship1 = new Image();
  var ship2 = new Image();
  var ship3 = new Image();
  var ship4 = new Image();
  var bullet1 = new Image();
  var bullet2 = new Image();
  var bullet3 = new Image();
  var bullet4 = new Image();
  var blast = new Image();
  var mapImage = new Image();

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
    ship1.src = 'img/ship1.png';
    ship2.src = 'img/ship2.png';
    ship3.src = 'img/ship3.png';
    ship4.src = 'img/ship4.png';
    bullet1.src = 'img/bullet1.png';
    bullet2.src = 'img/bullet2.png';
    bullet3.src = 'img/bullet3.png';
    bullet4.src = 'img/bullet4.png';
    /*ship.src = 'img/ship1.png';
    bullet.src = 'img/bullet1.png';*/
    blast.src = 'img/blast.png';
    mapImage.src = 'assert/map/mapImage.jpg';

    // Create player location (this will be given by the login server) as a signed msg
    player = new Player();
    player.init(user.userId, sangraama.getScalingFactor(), user.shipType, user.bulletType);
    player.setCoordination(user.x, user.y);

    /*player.init(Math.floor(Math.random() * 99998) + 1, sangraama.getScalingFactor(), 1, 1);
    player.setCoordination(Math.floor(Math.random() * 500) + 2000, Math.floor(Math.random() * 400) + 400);*/

    // Initialize AIO handler
    aoihandler = new aoihandler();
    aoihandler.init(sangraama.getScalingFactor());
    aoihandler.setAOI(screenSize.width, screenSize.height);
    aoihandler._setVirtualPoint(player._getX(), player._getY());
    console.log(' initialized window onloads ... ');
    bot = new bot(); // Initialize bot
    bot.init(player.getUserID());
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


    this.triggerEvent = function() {
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