<!--
var D = true; // debug
var playerObject;
var scanvas;
var gEngine;
//var ctx;
var dx = 5;
var rA = 3;
var dy = 5;
//var WIDTH = 1250;
//var HEIGHT = 500;
var ship = new Image();
var bullet = new Image();
var TO_RADIANS = Math.PI / 180;
var FROM_RADIANS = 180 / Math.PI;

// connection handling
var primaryCon = 0; // player only send updates to the primary server
var prevPrimarycon = 0; // previous primary connection, for recovering purpose
var nextPrimaryCon = -1; // To store next primary connection, until it's stablish
this.scale = 100; // 1 unit in server => 100 pixels in canvas

var player = {
   type : 1,
   userID : 1,
   x : 0,
   y : 0,
   angle : 0,
   v_x : 0,
   v_y : 0,
   v_a : 0,
   s : 0
 };
var passPlayer= {
  type : 2,
  userID : 0,
  info : null,
  signedInfo : null
};

// Settings and functionalities of client-side canvas
var sCanvas = function(){
  this.canvas;
  var ctx;
  this.WIDTH = 1250;
  this.HEIGHT = 500;
};

$(document).ready(function() {
  
});

// Setup client side
window.onload = function() {
  scanvas = new sCanvas();
  // Gaphic engine
  gEngine = new GraphicEngine();

  var container = document.getElementById('sangraama_container');
  canvas = document.createElement('canvas');
  canvas.id = 'sangraama_canvas';
  ctx = canvas.getContext("2d");
  // Get current screen size
  var screenSize = viewport();
  canvas.setAttribute('width', screenSize.width);
  scanvas.WIDTH = screenSize.width;

  canvas.setAttribute('height', screenSize.height - 40);
  scanvas.HEIGHT = screenSize.height;
  ctx.fillStyle = '#819FF7';
  ctx.fillRect(0, 0, screenSize.width, screenSize.height);
  container.appendChild(canvas);

  ship.src = 'img/arrow.jpg';
  bullet.src = 'img/bullet.png';
  player.id = Math.floor(Math.random() * 101);
  //player.x = Math.floor(Math.random() * 900);
  //player.x = Math.floor(Math.random() * 2 + 997);//create at edge
  player.x = 999;
  player.y = Math.floor(Math.random() * 301);
  gEngine.drawRotatedImage(ship, player);
};

var Tile = function(){
  // not supporting custome size tiles
  this.tiles;
  this.init = function(coordArr){
    this.tiles = coordArr;
  },
  this.isInsideTile = function(x,y){
    return false;
  },
  this.getSubTile = function(index){
    return this.tiles[index];
  },
  this.printTiles = function(){
    _.map(this.tiles, function(tile){ console.log(tile.x); });
  }
};

var wsList = new Array(4);
/* this structure was built using 1.1 method in tutorial
http://www.phpied.com/3-ways-to-define-a-javascript-class/ */
function WebSocketHandler(hostAddress, wsIndex) {
  var ws = null;
  // The assigned index in the ws array
  this.wsIndex = wsIndex;
  this.hostAddress = hostAddress;
  // Store size of tile which connected with this ws
  this.tile = null;

  // Set tile size
  this.setTile = function(coordArr){
    this.tile = new Tile();
    this.tile.init(coordArr);
    this.tile.printTiles();
  }

  // Get the websocket
  this.getWS = function() {
    return ws;
  };
  // Get host address
  this.getHostAddress = function(){
    console.log('Get host address '+this.hostAddress);
    return this.hostAddress;
  }
  /* Get the state of websocket
  CONNECTING  0 The connection is not yet open.
  OPEN        1 The connection is open and ready to communicate.
  CLOSING     2 The connection is in the process of closing.
  CLOSED      3 The connection is closed or couldn't be opened.*/
  // Get the state of websocket
  this.isReadyState = function() {
    return ws.readyState;
  };
  // close the websocket
  this.close = function(index) {
    if (index == wsIndex && ws.readyState <= ws.OPEN) { // if ws is connecting or opened
      ws.close();
      return true;
    } else {
      return false;
    }
  };
  // send data to server [should only allow to primary connection]
  this.send = function(data) {
    if (ws.readyState == ws.OPEN) {
      ws.send(data);
    }else {
      console.log("ws isn't ready or open");
    }
  }
  // Connecting to server and functions for handle server messages
  this.connect = function() {
    var wsIndex = this.wsIndex;
    console.log('call connect ... ' + this.wsIndex);
    var hostProtocol;

    //if (window.location.protocol == 'http:') {
    hostProtocol = 'ws://';
    //} else {
    //	hostProtocol = 'wss://';
    //}
    var hostURL = hostProtocol + this.hostAddress;
    console.log(this.hostAddress);
    /*Open a websocket which will depend on browser*/
    if ('MozWebSocket' in window) {
      ws = new MozWebSocket(hostURL);
    } else if ('WebSocket' in window) {
      ws = new WebSocket(hostURL);
    } else {
      alert('Your browser does not support WebSockets');
    }

    ws.onopen = function() {
      console.log('Connection opened ' + hostURL);
      
      // set the primaryconnection after ws setup
      if(nextPrimaryCon >= 0){
        if (wsList[nextPrimaryCon].isReadyState() == 1) {
          // Reset player's events on current server
          wsList[primaryCon].send(JSON.stringify(
            { type : 1,
              userID : player.userID,
              x : 0,
              y : 0,
              angle : 0,
              v_x : 0,
              v_y : 0,
              v_a : 0,
              s : 0
            }));
          // swap connections
          prevPrimarycon = primaryCon;
          primaryCon = nextPrimaryCon;
          nextPrimaryCon = -1;
          console.log('Open & Set primary as '+prevPrimarycon+' << primary:'+primaryCon+' << '+nextPrimaryCon);
        }
      }
      wsList[primaryCon].send(JSON.stringify(player));
      /*if(secondryCon != null){
          wsList[secondryCon].getWS().send(JSON.stringify(passPlayer));
          swapConnecations();
      }*/
      console.log("Connection opened");
    };
    ws.onmessage = function(event) {
      var data = JSON.parse(event.data);

      //clear();
      // Can be replace by map
      for ( var index in data) {
        var inPlayer = data[index];
        //console.log(inPlayer.userID + ' type: ' + inPlayer.type);
        
        switch (inPlayer.type) {
        case 1: // update client graphichs
          //if(D) console.log('Case 1');
          gEngine.clear();
          var bullets = inPlayer.bulletDeltaList;
          gEngine.drawRotatedImage(ship, inPlayer);
          for ( var bulletIndex in bullets) {
            gEngine.drawShootImage(bullet, bullets[bulletIndex]);
            //if(D) console.log(bullets[bulletIndex]);
          }

          // only for demo 1002
          /*if (inPlayer.dx == '1002') {
            console.log('out of map');
            player.type = 2;
            player.x = inPlayer.dx;
            player.y = inPlayer.dy;
            updateServer();
            player.type = 1;
          }*/

          //} 
          break;
        case 2: /* close connection and connect to another server (make it as primary connection) */
      	  statusUpdate=false; // Y?
          var info = JSON.parse(inPlayer.info);
          console.log('Type 2 msg. ' + info.url);
          player.x=info.positionX;
          player.y=info.positionY;
          passPlayer.type=inPlayer.type;
          passPlayer.userID=inPlayer.userID;
          passPlayer.info=inPlayer.info;
          passPlayer.signedInfo = inPlayer.signedInfo;
          //alert(JSON.stringify(passPlayer));
          var i = 0;
          do { // search from begining of list is there any available slot
            console.log(i, wsList);
            if (wsList[i] == undefined) { // if ws isn't initialized
              passConnect(info.url, i);
              break;
            } else if (wsList[i].hostAddress == info.url && wsList[i].isReadyState() == 1) {/*if a websocket is opening for this address ignore connecting again*/ 
              wsList[primaryCon].send(JSON.stringify(
                { type : 1,
                  userID : player.userID,
                  x : 0,
                  y : 0,
                  angle : 0,
                  v_x : 0,
                  v_y : 0,
                  v_a : 0,
                  s : 0
                }));
              // swap primary Connection
              prevPrimarycon = primaryCon;
              primaryCon = i;
              console.log('Set primary connections as '+prevPrimarycon+' << primary:'+primaryCon+' <<'+nextPrimaryCon);
              updateServer();
              break;
            } else if (wsList[i].isReadyState() == 3) { // if previous ws is closed
              passConnect(info.url, i);
              break;
            }
            i++;
          } while (i < 10);
          break;
        case 3: /* connecting to another server and get updates */
          var info = JSON.parse(inPlayer.info);
          console.log('Type 3 msg. ' + info.url);
          var i = 0;
          do { // search from begining of list is there any available slot
            //console.log('Times ' + i + wsList[i].hostAddress);
            if (wsList[i] == undefined) { // if ws isn't initialized
              reconnect(info.url, i);
              break;
            } else if (wsList[i].getHostAddress() == info.url && wsList[i].isReadyState() == 1) {/*if a websocket is opening for this address ignore connecting again*/ 
              break;
            } else if (wsList[i].isReadyState() == 3) { // if previous ws is closed
              reconnect(info.url, i);
              break;
            }
            i++;
          } while (i < 10);
          break;
        case 4: /* close existing connection */
          break;
        case 10: /* set current absolute location of client on the map */
          break;
        case 11: /* set size of the tile */
          console.log('Type:'+inPlayer.type+' Set tile size of server');
          wsList[wsIndex].setTile(JSON.parse(inPlayer.tiles));
          break;
        default:
          console.log("Warning. Unsupported message type "
              + inPlayer.type);
        }
      }
    };
    ws.onclose = function() {
      console.log('Connection closed ' + hostURL);
    };
    ws.onerror = function(event) {
      console.log('Connection error ' + hostURL);
    };
  };
}

function updateServer() {
  // only allow primary connection to update server
  // if (D)
    //console.log('Send update to server '+primaryCon);
    wsList[primaryCon].send(JSON.stringify(player));
  
}

// Make connection to new server as primary, send event requests
function passConnect(host, num) {
  console.log('Create new primary connection to ' + host + ' with ' + num);
  wsList[num] = new WebSocketHandler(host, num);
  wsList[num].connect();
  if (wsList[num].isReadyState == 1) { // if connection was created
    /* Closing privious primary connection mayn't a good idea, coz player
       doesn't quite from that location immediately */
    primaryCon = num; // make this primary connection
    console.log(num + ' is already & make primaryCon');
  }else {
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

var prevKey = 0;
function doKeyDown(evt) {

  switch (evt.keyCode) {
  case 38: /* Up arrow was pressed */
    player.v_y = -1;
    player.v_a = 270;
    if (D)
      console.log('up pressed');
    break;
  case 40: /* Down arrow was pressed */
    player.v_y = 1;
    player.v_a = 90;
    if (D)
      console.log('down pressed');
    break;
  case 37: /* Left arrow was pressed */
    player.v_x = -1;
    player.v_a = 180;
    //if (D)
      //console.log('left pressed');
    break;
  case 39: /* Right arrow was pressed */
    player.v_x = 1;
    player.v_a = 0;
    //if (D)
      //console.log('right pressed');
    break;
  case 82: /* R was pressed */
    player.v_a += 1;
    break;
  case 76: /* L was pressed */
    player.v_a += (360 - 1);
    break;
  case 32: /* Space was pressed */
    if (D)
      console.log('Player shoot');
    player.s = 1;
    break;
  default:
    console.log(evt.keyCode);
  }
  if(prevKey != evt.keyCode){
    prevKey = evt.keyCode;
    updateServer();
  }
}

function doKeyUp(evt) {

  switch (evt.keyCode) {
  case 38: /* Up arrow was released */
    player.v_y = 0;
    //player.v_a = 0;
    break;
  case 40: /* Down arrow was released */
    player.v_y = 0;
    //player.v_a = 0;
    break;
  case 37: /* Left arrow was released */
    player.v_x = 0;
    //player.v_a = 0;
    break;
  case 39: /* Right arrow was released */
    player.v_x = 0;
    //player.v_a = 0;
    break;
  case 82: /* R was released */
    player.v_a = player.v_a;
    break;
  case 32: /* Space was released */
    player.s = 0;
    break;
  case 76: /* L was released */
    player.v_a = player.v_a;
    break;
  default:
    console.log(evt.keyCode);
  }
  updateServer();
  prevKey = 0;
}

function doMouseDown(evt) {
  switch (evt.which) {
  case 1:
    if (D)
      console.log('Left mouse button pressed');
    break;
  case 2:          player.v_y = 1;

    if (D)
      console.log('Middle mouse button pressed');
    break;
  case 3:
    if (D)
      console.log('Right mouse button pressed');
    break;
  default:
    if (D)
      console.log('You have a strange mouse');
  }
}

function doMouseUp(evt) {
  switch (evt.which) {
  case 1:
    if (D)
      console.log('Left mouse button released');
    break;
  case 2:
    if (D)
      console.log('Middle mouse button released');
    break;
  case 3:
    if (D)
      console.log('Right mouse button released');
    break;
  default:
    if (D)
      console.log('You have a strange mouse');
  }
}

window.addEventListener('keydown', doKeyDown, true);
window.addEventListener('keyup', doKeyUp, true);
window.addEventListener('mousedown', doMouseDown, true);
window.addEventListener('mouseup', doMouseUp, true);
//-->
