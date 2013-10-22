  var D = true;
  var TAG = 'SangraamaClient : ';

  var p; // Player Object
  var scanvas;
  var gEngine;
  var aoihandler;
  var mapLoader;
  var clickSound;
  // var ctx;
  var dx = 5;
  var rA = 3;
  var dy = 5;
  // var WIDTH = 1250;
  // var HEIGHT = 500;
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
  this.scale = 100; // 1 unit in server => 100 pixels in canvas

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
  var passPlayer = {
    type: 2,
    userID: 0,
    info: null,
    signedInfo: null
  };

  // Settings and functionalities of client-side canvas
  var sCanvas = function() {
    this.canvas;
    var ctx;
    this.WIDTH = 1250;
    this.HEIGHT = 500;
  };

  // Setup client side
  window.onload = function() {
    clickSound = new Audio('audio/shoot.mp3');
    scanvas = new sCanvas();
    // Gaphic engine

    // gEngine.init();
    // gEngine.simulate();
    mapLoader = new MapLoader();
    mapLoader.loadMap();
    canvas = document.getElementById('layer2');
    canvas2 = document.getElementById('layer1');
    ctx = canvas.getContext("2d");
    ctx2 = canvas2.getContext("2d");
    screenSize = viewport();
    canvas.setAttribute('width', screenSize.width);
    canvas2.setAttribute('width', screenSize.width);
    scanvas.WIDTH = screenSize.width;

    canvas.setAttribute('height', screenSize.height - 50);
    canvas2.setAttribute('height', screenSize.height - 50);
    scanvas.HEIGHT = screenSize.height;
    ship.src = 'img/arrow.jpg';
    bullet.src = 'img/bullet.png';
    mapImage.src = 'assert/map/mapImage.jpg';

    // Create player location (this will be given by the login server)
    player.userID = Math.floor(Math.random() * 101);
    // player.x = Math.floor(Math.random() * 900);
    player.x = Math.floor(Math.random() * 49 + 2250); //create at edge
    // player.x = 50;
    // player.y = 50;
    player.y = Math.floor(Math.random() * 100) + 300
    // drawRotatedImage(ship, player);
    pHandler = new playerhandler();
    pHandler.init(player.userID);
    
    // Initialize AIO handler
    aoihandler = new aoihandler();
    aoihandler.init();
    aoihandler.setAOI(canvas.getAttribute('width'), canvas.getAttribute('height'));
    console.log(TAG + ' initialized window onloads ... ');
    gEngine = new GraphicEngine();
  };

  function updateServer() {
    // only allow primary connection to update server
    // if (D)
    // console.log('current primary connection ' + primaryCon);
    //console.log('Send update to server ' + primaryCon + ' ' + wsList[primaryCon].getWS().getHostAddress();
    wsList[primaryCon].send(JSON.stringify(player));
  }

  function addPlayerToGraphicEngine(inPlayer) {

    var player = playerList[inPlayer.userID];
    if (typeof player !== "undefined") {
      player.x = inPlayer.dx;
      player.y = inPlayer.dy;
      player.a = inPlayer.da;
      playerList[inPlayer.userID] = player;
      // console.log('player angle'+inPlayer.da);
    } else {
      var graphicPlayer = new GraphicObject();
      graphicPlayer.x = inPlayer.dx;
      graphicPlayer.y = inPlayer.dy;
      graphicPlayer.a = inPlayer.da;
      playerList[inPlayer.userID] = graphicPlayer;
      console.log('added player');
    }

    // gEngine.simulate();
  }

  function addBulletToGraphicEngine(inBullet) {
    var screenHeight = canvas.getAttribute('height');
    var screenWidth = canvas.getAttribute('width');
    var bullet = bulletList[inBullet.id];

    if (typeof bullet !== "undefined") {
      if (inBullet.type == 2) {
        bulletList.splice(inBullet.id);
      } else {
        bullet.x = inBullet.dx % screenWidth;
        bullet.y = inBullet.dy % screenHeight;
        bullet.a = inBullet.a;
        bulletList[inBullet.id] = bullet;
      }
    } else {
      var graphicBullet = new GraphicObject();
      graphicBullet.x = inBullet.dx % screenWidth;
      graphicBullet.y = inBullet.dy % screenHeight;
      graphicBullet.a = inBullet.a;
      bulletList[inBullet.id] = graphicBullet;
      console.log('added bullet')

    }
  }

  //-->