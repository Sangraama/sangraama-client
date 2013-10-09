  var D = true;
  var playerObject;
  var scanvas;
  var gEngine;
  var aoihandler;
  var mapLoader;

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
  var nextPrimaryCon = -1; // To store next primary connection, until it's
  // stablish
  this.scale = 100; // 1 unit in server => 100 pixels in canvas

  var player = {
    type: 1,
    userID: 1,
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    angle: 0,
    v_x: 0,
    v_y: 0,
    a: 0, //actual angle
    da: 0, // delta angle
    s: 0,
    aoi_w: 200,
    aoi_h: 200
  };
  var passPlayer = {
    type: 2,
    userID: 0,
    info: null,
    signedInfo: null
  };
  var playeraoi = {
    type: 3,
    userID: 0,
    aoi_w: 200,
    aoi_h: 200
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
    scanvas = new sCanvas();
    // Gaphic engine
    gEngine = new GraphicEngine();
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
    player.id = Math.floor(Math.random() * 101);
    // player.x = Math.floor(Math.random() * 900);
    player.x = Math.floor(Math.random() * 49 + 950); //create at edge
    // player.x = 50;
    // player.y = 50;
    player.y = Math.floor(Math.random() * 100) + 300;
    player.w = canvas.getAttribute('width');
    player.h = canvas.getAttribute('height');
    drawRotatedImage(ship, player);
    // Initialize AIO handler
    aoihandler = new aoihandler();
    aoihandler.init();
  };

  function updateServer() {
    // only allow primary connection to update server
    // if (D)
    console.log('current primary connection ' + primaryCon);
    //console.log('Send update to server ' + primaryCon + ' ' + wsList[primaryCon].getWS().getHostAddress();
    mapLoader.drawMap(player.x, player.y);
    wsList[primaryCon].send(JSON.stringify(player));
  }

  // Make connection to new server as primary, send event requests

  function passConnect(host, num) {
    console.log('Create new primary connection to ' + host + ' with ' + num);
    wsList[num] = new WebSocketHandler(host, num);
    wsList[num].connect();
    if (wsList[num].isReady == 1) { // if connection was created
      /*
       * Closing privious primary connection mayn't a good idea, coz player
       * doesn't quite from that location immediately
       */
      primaryCon = num; // make this primary connection
      console.log(num + ' is already & make primaryCon');
    } else {
      nextPrimaryCon = num;
      console.log('Make ' + num + 'as  next primaryCon');
    }
  }
  // Connecting to another server

  function reconnect(host, num) {
    console.log('Reconnect to ' + host + ' with ' + num);
    wsList[num] = new WebSocketHandler(host, num);
    wsList[num].connect();
  }

  function addPlayerToGraphicEngine(inPlayer) {

    var player = playerList[inPlayer.userID];
    if (typeof player !== "undefined") {
      player.x = inPlayer.dx;
      player.y = inPlayer.dy;
      player.angle = inPlayer.da;
      playerList[inPlayer.userID] = player;
      // console.log('player angle'+inPlayer.da);
    } else {
      var graphicPlayer = new GraphicObject();
      graphicPlayer.x = inPlayer.dx;
      graphicPlayer.y = inPlayer.dy;
      graphicPlayer.angle = inPlayer.da;
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
        bullet.angle = inBullet.a;
        bulletList[inBullet.id] = bullet;
      }
    } else {
      var graphicBullet = new GraphicObject();
      graphicBullet.x = inBullet.dx % screenWidth;
      graphicBullet.y = inBullet.dy % screenHeight;
      graphicBullet.angle = inBullet.a;
      bulletList[inBullet.id] = graphicBullet;
      console.log('added bullet')

    }
  }

  //-->