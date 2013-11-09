var wsSize = 10;
var wsList; // new Array(wsSize);
/* this structure was built using 1.1 method in tutorial
http://www.phpied.com/3-ways-to-define-a-javascript-class/ */

function WebSocketHandler(hostAddress, wsIndex, z) {
  var D = true; // debug
  var TAG = 'WSHandler : ';
  var z = z; // Territory ID

  var ws = null;
  // The assigned index in the ws array
  var wsIndex = wsIndex;
  var hostAddress = hostAddress;

  // Get the websocket
  this.getWS = function() {
    return ws;
  };
  // Get host address | Data Encapsulation
  this.getHostAddress = function() {
    console.log(TAG + 'web socket:' + wsIndex + ' get host address ' + hostAddress);
    return hostAddress;
  }
  // Get the ws Index | Data encapsulation
  this.getWSIndex = function() {
    return wsIndex;
  }
  /*
   * Get the state of websocket CONNECTING 0 The connection is not yet open.
   * OPEN 1 The connection is open and ready to communicate. CLOSING 2 The
   * connection is in the process of closing. CLOSED 3 The connection is
   * closed or couldn't be opened.
   */
  // Get the state of websocket
  this.isReady = function() {
    return ws.readyState;
  };
  // close the websocket
  this.close = function(index) {
    if (index == wsIndex && ws.readyState <= ws.OPEN && sangraama[z].getPrimaryCon() != index) { // if ws is connecting or opened
      ws.close();
      wsList[z][wsIndex] = undefined;
      return true;
    } else {
      return false;
    }
  };
  // send data to server [should only allow to primary connection]
  this.send = function(data) {
    if (ws.readyState == ws.OPEN) {
      ws.send(data);
    } else {
      console.log(TAG + "ws:" + wsIndex + " isn't ready or open " + hostAddress);
    }
  }
  // Connecting to server and functions for handle server messages
  this.connect = function() {
    console.log(TAG + 'call connect ... ' + wsIndex + ' ' + hostAddress);
    var hostProtocol;

    // if (window.location.protocol == 'http:') {
    hostProtocol = 'ws://';
    // } else {
    // hostProtocol = 'wss://';
    // }
    var hostURL = hostProtocol + hostAddress;
    console.log(hostAddress);
    /* Open a websocket which will depend on browser */
    if ('MozWebSocket' in window) {
      ws = new MozWebSocket(hostURL);
    } else if ('WebSocket' in window) {
      ws = new WebSocket(hostURL);
    } else {
      alert('Your browser does not support WebSockets');
    }

    ws.onopen = function() {
      console.log(TAG + 'Connection opened ws:' + wsIndex + ' url:' + hostURL);
      aoihandler[z].setConnectedHost(hostAddress, wsIndex); // added to already connected queue

      // set if the next primaryconnection/player is this web socket
      if (sangraama[z].getNextPrimaryCon() == wsIndex) {
        console.log(TAG + ' ws:' + wsIndex + ' is the primary connection. Make a player.');
        if (wsList[z][sangraama[z].getNextPrimaryCon()].isReady() == 1) { // if next this web socket connection is ready
          wsList[z][sangraama[z].getNextPrimaryCon()].send(JSON.stringify(player[z]._getCreatePlayerToJSON()));
          // swap connections
          sangraama[z].setPrimaryCon(sangraama[z].getNextPrimaryCon());
          sangraama[z].setNextPrimaryCon(-1);
          console.log(TAG + 'Open & Set primary as ' + sangraama[z].getPrimaryCon() + ' << primary:' + sangraama[z].getPrimaryCon() + ' << ' + sangraama[z].getNextPrimaryCon());
        } // -- end if(isready)

      } else { // if this is not a primary connection
        console.log(TAG + ' ws:' + wsIndex + ' is the update connection. Make a dummy player.');
        if (wsList[z][wsIndex].isReady() == 1) {
          wsList[z][wsIndex].send(JSON.stringify(player[z]._getDummyPlayerToJSON()));
        }
      }

      console.log("Connection opened");
      // Set AOI and Virtual point in the server
      wsList[z][wsIndex].send(JSON.stringify(aoihandler[z]._getAOIToJSON()));
      wsList[z][wsIndex].send(JSON.stringify(aoihandler[z]._getVirtualPointToJSON()));
    };

    ws.onmessage = function(event) {
      var data = JSON.parse(event.data);
      if (wsIndex == sangraama[z].getPrimaryCon()) {
        /*gEngine.clear();*/
      } else {
        /*gEngine.clear2();*/
      }

      for (var index in data) {
        var inPlayer = data[index];

        switch (inPlayer.type) {
          case 1: // update client graphichs

            /**
             * Seperate updates wether send by "primary server - player" OR "secondary server - dummy"
             */
            if (wsIndex == sangraama[z].getPrimaryCon()) { // Data send by Player
              /*gEngine.drawShip(inPlayer);*/
              if (isBot)
                bot[z].setEnemies(inPlayer);

              if (player[z].getUserID() == inPlayer.userID) { // If this is the current player details, then proceed following
                /*      player.x = sangraama.scaleUp(inPlayer.dx);
                player[z].y = sangraama.scaleUp(inPlayer.dy);*/
                player[z]._setCoordination(inPlayer.dx, inPlayer.dy);
                player[z].setAngle(inPlayer.da);
                var life = inPlayer.health + '%';
                var score = inPlayer.score;
                $("#life_progress").css({
                  "width": life
                })
                $("#score").text(score);

                // check whether play is inside the virual box. If not, set virtual point as user current location
                if (!aoihandler[z].isInVBox(player[z].getX(), player[z].getY())) {
                  console.log(TAG + 'player is outside of the virtual box');
                  aoihandler[z]._setVirtualPoint(inPlayer.dx, inPlayer.dy);
                  wsList[z][wsIndex].send(JSON.stringify(aoihandler[z]._getVirtualPointToJSON(player[z].getUserID())));
                }

              }

              // Idea : control the AOI in client side with "Center View". By uncommenting this, enable the "filfill the AOI" in client-side
              /*var want = aoihandler[z]._isFulfillAOI(sangraama.scaleDown(inPlayer.dx), sangraama.scaleDown(inPlayer.dy));
                _.map(want, function(val, k) {
                  console.log(TAG + 'want area ' + val.x + ' : ' + val.y);
                  // Ask for AOI
                  wsList[z][wsIndex].send(JSON.stringify({
                    type: 2,
                    userID: player.getUserID(),
                    x: val.x,
                    y: val.y
                  }));
                });*/
            } // -- end player
            else { // Data send by Dummy
              /*gEngine.drawShip2(inPlayer);*/
              if (isBot)
                bot[z].setEnemies(inPlayer);
            } // -- end dummy
            break;

          case 4:
            /* close a existing connection */
            console.log(TAG + ' Type(04):' + inPlayer.type + ' close connection in ws:' + wsIndex);
            aoihandler[z].removeConnectedHost(wsIndex);
            aoihandler[z].removeTiles(wsIndex);
            wsList[z][wsIndex].close(wsIndex);
            break;

          case 5:
            if (wsIndex == sangraama[z].getPrimaryCon()) {
              /*gEngine.drawBullet(inPlayer);*/
            } else {
              /*gEngine.drawBullet2(inPlayer);*/
            }
            break;

          case 6:
            /*gEngine.drawBlastImage(blast, inPlayer);*/
            break;


          case 10:
            /* set virtual point absolute location of client on the map (sync data) */
            console.log(TAG + ' Type(10):' + inPlayer.type + ' in ws:' + wsIndex);
            /*mapLoader.drawMap(sangraama[z].scaleUp(inPlayer.x), sangraama[z].scaleUp(inPlayer.y));*/

            if (inPlayer.userID == player[z].getUserID()) {
              console.log(TAG + ' set Virtual point if this is the primary connection as x_vp:' + inPlayer.x_vp + ' y_vp' + inPlayer.y_vp);
              aoihandler[z]._setVirtualPoint(inPlayer.x_vp, inPlayer.y_vp); // Set new virtual point
              /*player[z].x = sangraama.scaleUp(inPlayer.x);
                player[z].y = sangraama.scaleUp(inPlayer.y);*/
              player[z]._setCoordination(inPlayer.x, inPlayer.y);
              // Set virtual points of dummy players same as player
              for (var i = 0; i < wsList[z].length; i++) {
                if (wsList[z][i] != undefined && i != wsIndex && wsList[z][i].isReady() == 1) {
                  wsList[z][i].send(JSON.stringify(aoihandler[z]._getVirtualPointToJSON(player[z].getUserID())));
                }
              }

              // Idea : control the AOI in client side with "Virtual Box View". Uncommenting this, enable the "filfill the AOI" in client-side
              var want = aoihandler[z]._isFulfillAOI(inPlayer.x_vp, inPlayer.y_vp);
              _.map(want, function(val, k) {
                console.log(TAG + 'want area ' + sangraama[z].scaleUp(val.x) + ' : ' + sangraama[z].scaleUp(val.y));
                // Ask for AOI
                wsList[z][wsIndex].send(JSON.stringify({
                  type: 2,
                  userID: player[z].getUserID(),
                  x: val.x,
                  y: val.y
                }));
              });
            } else {
              // check whether dummy virtual point coinside with player virtual point
            }
            break;

          case 11:
            /* set size of the tiles */
            console.log(TAG + 'Type(11):' + inPlayer.type + ' ws:' + wsIndex + ' Set tile size of server : ' + inPlayer.tiles);
            if (inPlayer.tiles != undefined) {
              aoihandler[z]._addTiles(wsIndex, hostAddress, JSON.parse(inPlayer.tiles));
            } else {
              console.log(TAG + ' tile details are not send by the server');
              // NOTE: have to identify why is it sending empty tiles
            }
            break;

          case 20:
            console.log("## Bullet passing ##");
            var info = JSON.parse(inPlayer.info);
            wsList[z][aoihandler[z].getAlreadyConnectWS(info.url).wsIndex].send(JSON.stringify(inPlayer));
            break;

          case 21:
            console.log("## Score Change Passing ##");
            wsList[z][sangraama[z].getPrimaryCon()].send(JSON.stringify(inPlayer));
            break;

          case 30:
            /* connect to another server (make it as primary connection)
             */
            console.log(TAG + ' Type(30):' + inPlayer.type);
            var info = JSON.parse(inPlayer.info);
            console.log(TAG + ' make new player connection to url:' + info.url + ' already connected:' + aoihandler[z].isAlreadyConnect(info.url));

            /*Is this necessary :: player.x = sangraama.scaleUp(info.positionX);
            player.y = sangraama.scaleUp(info.positionY);*/

            if (aoihandler[z].isAlreadyConnect(info.url)) { // If already connected as a dummy player
              var dIndex = aoihandler[z].getAlreadyConnectWS(info.url).wsIndex; // get dummy connection ws index
              console.log(TAG + ' already connected dummy connection :' + dIndex);
              console.log(TAG + wsList[z][dIndex].getHostAddress() + ' eq url:' + (wsList[z][dIndex].hostAddress == info.url) + ' is ready:' + wsList[z][dIndex].isReady());
              if (wsList[z][dIndex].getHostAddress() == info.url && wsList[z][dIndex].isReady() == 1) {
                /*
                 * if a websocket is opening for this address ignore connecting again
                 */
                console.log(TAG + ' if ws already created and connected ' + wsList[z][dIndex].getHostAddress());
                wsList[z][sangraama[z].getPrimaryCon()].send(JSON.stringify({ // reset dummy settings
                  type: 4,
                  userID: player[z].getUserID(),
                }));
                // swap primary Connection
                sangraama[z].setPrimaryCon(dIndex);
                sangraama[z].setNextPrimaryCon(-1);
                console.log('Set primary connections as ' + sangraama[z].getPrevPrimaryCon() + ' << primary:' + sangraama[z].getPrimaryCon() + ' <<' + sangraama[z].getNextPrimaryCon());

                wsList[z][sangraama[z].getPrimaryCon()].send(JSON.stringify(player[z]._getCreatePlayerToJSON()));
                wsList[z][sangraama[z].getPrimaryCon()].send(JSON.stringify(aoihandler[z]._getAOIToJSON()));
                wsList[z][sangraama[z].getPrimaryCon()].send(JSON.stringify(aoihandler[z]._getVirtualPointToJSON()));
                break;
              } else if (wsList[z][dIndex].isReady() == 3) { // if previous ws is closed
                console.log(dIndex + ' previous ws closed...');
                sangraama[z].passConnect(info.url, dIndex);
                break;
              } else {
                console.log(TAG + ' error on passing connection to other server');
              }
            } else { // otherwise create a new ws and connect as player
              console.log(TAG + ' create a new player connection #$%');
              var i = 0;
              do { // search from begining of list is there any available slot
                console.log(i, wsList[z]);
                if (wsList[z][i] == undefined) { // if ws isn't initialized
                  console.log(i + 'if undefined');
                  sangraama[z].passConnect(info.url, i);
                  break;
                } else if (wsList[z][i].isReady() == 3) { // if previous ws is closed
                  console.log(i + ' previous ws closed');
                  sangraama[z].passConnect(info.url, i);
                  break;
                }
                i++;
              } while (i < wsSize);
            }
            break;

          case 31:
            /* connecting to another server and get updates in order to fulfill AOI */
            var info = JSON.parse(inPlayer.info);
            console.log('Type(31):' + inPlayer.type + ' url:' + info.url + ' details of the server which need to get updates to fulfill AOI');

            if (!aoihandler[z].isAlreadyConnect(info.url)) { // If there is not connected
              var i = 0;
              do { // search from begining of list is there any available slot
                // console.log('Times ' + i + wsList[z][i].hostAddress);
                if (wsList[z][i] == undefined) { // if ws isn't initialized
                  sangraama[z].updateConnect(info.url, i);
                  break;
                } else if (wsList[z][i].getHostAddress() == info.url && wsList[z][i].isReady() == 1) {
                  /* 
                    if a websocket is opening for this address ignore connecting again
                 */
                  break;
                } else if (wsList[z][i].isReady() == 3) { // if previous ws is
                  // closed
                  sangraama[z].updateConnect(info.url, i);
                  break;
                }
                i++;
              } while (i < wsSize);
            }
            break;

          default:
            console.log("Warning. Unsupported message type " + inPlayer.type);
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

// -->