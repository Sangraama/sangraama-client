  var D = true;
  var TAG = 'SangraamaClient : ';

  var p; // Player Object
  var gEngine;
  var aoihandler;
  var mapLoader;
  var clickSound;
  var dx = 5;
  var rA = 3;
  var dy = 5;
  var ship = new Image();
  var bullet = new Image();
  var mapImage = new Image();
  var TO_RADIANS = Math.PI / 180;
  var FROM_RADIANS = 180 / Math.PI;

  // connection handling
  var primaryCon = 0; // player only send updates to the primary server
  var prevPrimarycon = 0; // previous primary connection, for recovering purpose
  var nextPrimaryCon = 0; // To store next primary connection, until it's
  // stablish
  var scale = 100; // 1 unit in server => 100 pixels in canvas

  var player = {
    type: 1,
    userID: 1,
    x: 0, // have to move x,y like w & h in order to optimize. Otherwise we are sending them all the time. #gihan
    y: 0,
    v_x: 0,
    v_y: 0,
    a: 0, //actual angle
    da: 0, // delta angle
    s: 0
  };

  // Setup client side
  window.onload = function() {
    clickSound = new Audio('audio/shoot.mp3');
    mapLoader = new MapLoader();
    gEngine = new GraphicEngine();
    var screenSize = viewport();
    mapLoader.init(screenSize.width, screenSize.height);
    gEngine.init(screenSize.width, screenSize.height);
    mapLoader.loadMap();

    ship.src = 'img/arrow.jpg';
    bullet.src = 'img/bullet.png';
    mapImage.src = 'assert/map/mapImage.jpg';

    // Create player location (this will be given by the login server)
    player.userID = Math.floor(Math.random() * 101);
    // player.x = Math.floor(Math.random() * 900);
    player.x = Math.floor(Math.random() * 49 + 2250); //create at edge
    // player.x = 50;
    // player.y = 50;
    player.y = Math.floor(Math.random() * 100) + 100
    // drawRotatedImage(ship, player);
    pHandler = new playerhandler();
    pHandler.init(player.userID);

    // Initialize AIO handler
    aoihandler = new aoihandler();
    aoihandler.init();
    aoihandler.setAOI(screenSize.width, screenSize.height);
    console.log(TAG + ' initialized window onloads ... ');
  };

  function updateServer() {
    // only allow primary connection to update server
    // if (D)
    // console.log('current primary connection ' + primaryCon);
    //console.log('Send update to server ' + primaryCon + ' ' + wsList[primaryCon].getWS().getHostAddress();
    wsList[primaryCon].send(JSON.stringify(player));
  }

  //-->