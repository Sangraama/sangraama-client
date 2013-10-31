var wsSize = 10;
var wsList = new Array(wsSize);
/* this structure was built using 1.1 method in tutorial
http://www.phpied.com/3-ways-to-define-a-javascript-class/ */

function WebSocketHandler(hostAddress, wsIndex) {
  var D = true; // debug
  var TAG = 'WSHandler : ';
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
    if (index == wsIndex && ws.readyState <= ws.OPEN && primaryCon != index) { // if ws is connecting or opened
      ws.close();
      wsList[wsIndex] = undefined;
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
      aoihandler.setConnectedHost(hostAddress, wsIndex); // added to already connected queue

      // set if the next primaryconnection/player is this web socket
      if (nextPrimaryCon == wsIndex) {
        console.log(TAG + ' ws:' + wsIndex + ' is the primary connection. Make a player.');
        if (wsList[nextPrimaryCon].isReady() == 1) { // if next this web socket connection is ready
          wsList[nextPrimaryCon].send(JSON.stringify({ // request for create a player
            type: 30,
            userID: player.userID,
            x: sangraama.scaleDown(player.x),
            y: sangraama.scaleDown(player.y),
            w: aoihandler._getAOI().aoi_w,
            h: aoihandler._getAOI().aoi_h,
            x_vp: aoihandler._getVirtualPoint().x_vp,
            y_vp: aoihandler._getVirtualPoint().y_vp,
            v_x: player.v_x,
            v_y: player.v_y,
            a: player.a,
            s: 0
          }));
          // swap connections
          prevPrimarycon = primaryCon;
          primaryCon = nextPrimaryCon;
          nextPrimaryCon = -1;
          console.log(TAG + 'Open & Set primary as ' + prevPrimarycon + ' << primary:' + primaryCon + ' << ' + nextPrimaryCon);
        } // -- end if(isready)

      } else { // if this is not a primary connection
        console.log(TAG + ' ws:' + wsIndex + ' is the update connection. Make a dummy player.');
        if (wsList[wsIndex].isReady() == 1) {
          wsList[wsIndex].send(JSON.stringify({ // request for create a player
            type: 31,
            userID: player.userID,
            x: 0, // dummy player doesn't have a coordinate location
            y: 0,
            w: aoihandler._getAOI().aoi_w,
            h: aoihandler._getAOI().aoi_h,
            x_vp: aoihandler._getVirtualPoint().x_vp,
            y_vp: aoihandler._getVirtualPoint().y_vp
          }));
        }
      }

      console.log("Connection opened");
      // Set AOI and Virtual point in the server
      wsList[wsIndex].send(JSON.stringify(aoihandler._getAOIToJSON()));
      wsList[wsIndex].send(JSON.stringify(aoihandler._getVirtualPointToJSON()));
    };

    ws.onmessage = function(event) {
      var data = JSON.parse(event.data);
      if (wsIndex == primaryCon) {
        // console.log('p'+event.data);
        gEngine.clear();
      } else {
        // console.log('np'+event.data);
        gEngine.clear2();
      }
      // gEngine.clear();

      for (var index in data) {
        var inPlayer = data[index];

        switch (inPlayer.type) {
          case 1: // update client graphichs

            /**
             * Seperate updates wether send by "primary server - player" OR "secondary server - dummy"
             */
            if (wsIndex == primaryCon) { // Data send by Player
              gEngine.drawRotatedImage(ship, inPlayer);
              if (player.userID == inPlayer.userID) { // If this is the current player details, then proceed following
                player.x = sangraama.scaleUp(inPlayer.dx);
                player.y = sangraama.scaleUp(inPlayer.dy);
                player.a = inPlayer.da;
                var life = inPlayer.health + '%';
                var score = inPlayer.score;
                $("#life_progress").css({
                  "width": life
                })
                $("#score").text(score);

                // check whether play is inside the virual box. If not, set virtual point as user current location
                if (!aoihandler.isInVBox(player.x, player.y)) {
                  console.log(TAG + 'player is outside of the virtual box');
                  //console.log(TAG + 'case1: '); console.log(inPlayer);
                  aoihandler._setVirtualPoint(inPlayer.dx, inPlayer.dy);
                  wsList[wsIndex].send(JSON.stringify(aoihandler._getVirtualPointToJSON(player.userID)));
                }

              }

              // Idea : control the AOI in client side with "Center View". By uncommenting this, enable the "filfill the AOI" in client-side
              /*var want = aoihandler._isFulfillAOI(sangraama.scaleDown(inPlayer.dx), sangraama.scaleDown(inPlayer.dy));
                _.map(want, function(val, k) {
                  console.log(TAG + 'want area ' + val.x + ' : ' + val.y);
                  // Ask for AOI
                  wsList[wsIndex].send(JSON.stringify({
                    type: 2,
                    userID: player.userID,
                    x: val.x,
                    y: val.y
                  }));
                });*/
            } // -- end player
            else { // Data send by Dummy
              gEngine.drawRotatedImage2(ship, inPlayer);
            } // -- end dummy
            break;

          case 4:
            /* close a existing connection */
            console.log(TAG + ' Type(04):' + inPlayer.type + ' close connection in ws:' + wsIndex);
            aoihandler.removeConnectedHost(wsIndex);
            aoihandler.removeTiles(wsIndex);
            wsList[wsIndex].close(wsIndex);
            break;

          case 5:
            gEngine.drawRotatedImage(bullet, inPlayer);
            // console.log("Bullet x: " + inPlayer.dx + " y:" + inPlayer.dy);
            break;

          case 6:
            gEngine.drawBlastImage(blast, inPlayer);
            // console.log("Bullet x: " + inPlayer.dx + " y:" + inPlayer.dy);
            break;


          case 10:
            /* set virtual point absolute location of client on the map (sync data) */
            console.log(TAG + ' Type(10):' + inPlayer.type + ' in ws:' + wsIndex);
            console.log(inPlayer);
            mapLoader.drawMap(sangraama.scaleUp(inPlayer.x), sangraama.scaleUp(inPlayer.y));

            console.log(TAG + ' check id equal player:' + player.userID + ' inplayer:' + inPlayer.userID);
            if (inPlayer.userID == player.userID) {
              console.log(TAG + ' set Virtual point if this is the primary connection as x_vp:' + inPlayer.x_vp + ' y_vp' + inPlayer.y_vp);
              aoihandler._setVirtualPoint(inPlayer.x_vp, inPlayer.y_vp); // Set new virtual point
              player.x = sangraama.scaleUp(inPlayer.x);
              player.y = sangraama.scaleUp(inPlayer.y);
              // Set virtual points of dummy players same as player
              for (var i = 0; i < wsList.length; i++) {
                if (wsList[i] != undefined && i != wsIndex && wsList[i].isReady() == 1) {
                  wsList[i].send(JSON.stringify(aoihandler._getVirtualPointToJSON(player.userID)));
                }
              }

              // Idea : control the AOI in client side with "Virtual Box View". Uncommenting this, enable the "filfill the AOI" in client-side
              var want = aoihandler._isFulfillAOI(inPlayer.x_vp, inPlayer.y_vp);
              _.map(want, function(val, k) {
                console.log(TAG + 'want area ' + sangraama.scaleUp(val.x) + ' : ' + sangraama.scaleUp(val.y));
                // Ask for AOI
                wsList[wsIndex].send(JSON.stringify({
                  type: 2,
                  userID: player.userID,
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
              aoihandler._addTiles(wsIndex, hostAddress, JSON.parse(inPlayer.tiles));
            } else {
              console.log(TAG + ' tile details are not send by the server');
              // NOTE: have to identify why is it sending empty tiles
            }
            break;

          case 30:
            /* connect to another server (make it as primary connection)
             */
            console.log(TAG + ' case 30 ');
            console.log(inPlayer);
            console.log(TAG + ' Type(30):' + inPlayer.type);
            var info = JSON.parse(inPlayer.info);
            console.log(TAG + ' make new player connection to url:' + info.url + ' already connected:' + aoihandler.isAlreadyConnect(info.url));

            /*Is this necessary :: player.x = sangraama.scaleUp(info.positionX);
            player.y = sangraama.scaleUp(info.positionY);*/

            if (aoihandler.isAlreadyConnect(info.url)) { // If already connected as a dummy player
              var dIndex = aoihandler.getAlreadyConnectWS(info.url).wsIndex; // get dummy connection ws index
              console.log(TAG + ' already connected dummy connection :' + dIndex);
              console.log(TAG + wsList[dIndex].getHostAddress() + ' eq url:' + (wsList[dIndex].hostAddress == info.url) + ' is ready:' + wsList[dIndex].isReady());
              if (wsList[dIndex].getHostAddress() == info.url && wsList[dIndex].isReady() == 1) {
                /*
                 * if a websocket is opening for this address ignore connecting again
                 */
                console.log(TAG + ' if ws already created and connected ' + wsList[dIndex].getHostAddress());
                wsList[primaryCon].send(JSON.stringify({ // reset dummy settings
                  type: 4,
                  userID: player.userID,
                  x: sangraama.scaleDown(player.x),
                  y: sangraama.scaleDown(player.y),
                  //x_vp: aoihandler.getVirtualPoint().x_vp,
                  //y_vp: aoihandler.getVirtualPoint().y_vp,
                  a: 0,
                  v_x: 0,
                  v_y: 0,
                  s: 0
                }));
                // swap primary Connection
                prevPrimarycon = primaryCon;
                primaryCon = dIndex;
                nextPrimaryCon = -1;
                console.log('Set primary connections as ' + prevPrimarycon + ' << primary:' + primaryCon + ' <<' + nextPrimaryCon);

                wsList[primaryCon].send(JSON.stringify({ // request for create a player
                  type: 30,
                  userID: player.userID,
                  x: sangraama.scaleDown(player.x),
                  y: sangraama.scaleDown(player.y),
                  w: aoihandler._getAOI().aoi_w,
                  h: aoihandler._getAOI().aoi_h,
                  x_vp: aoihandler._getVirtualPoint().x_vp,
                  y_vp: aoihandler._getVirtualPoint().y_vp,
                  v_x: player.v_x,
                  v_y: player.v_y,
                  a: player.a,
                  s: 0
                }));
                wsList[primaryCon].send(JSON.stringify(aoihandler._getAOIToJSON()));
                wsList[primaryCon].send(JSON.stringify(aoihandler._getVirtualPointToJSON()));
                break;
              } else if (wsList[dIndex].isReady() == 3) { // if previous ws is closed
                console.log(dIndex + ' previous ws closed...');
                passConnect(info.url, dIndex);
                break;
              } else {
                console.log(TAG + ' error on passing connection to other server');
              }
            } else { // otherwise create a new ws and connect as player
              console.log(TAG + ' create a new player connection #$%');
              var i = 0;
              do { // search from begining of list is there any available slot
                console.log(i, wsList);
                if (wsList[i] == undefined) { // if ws isn't initialized
                  console.log(i + 'if undefined');
                  passConnect(info.url, i);
                  break;
                } else if (wsList[i].isReady() == 3) { // if previous ws is closed
                  console.log(i + ' previous ws closed');
                  passConnect(info.url, i);
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
            console.log(inPlayer);

            if (!aoihandler.isAlreadyConnect(info.url)) { // If there is not connected
              var i = 0;
              do { // search from begining of list is there any available slot
                // console.log('Times ' + i + wsList[i].hostAddress);
                if (wsList[i] == undefined) { // if ws isn't initialized
                  updateConnect(info.url, i);
                  break;
                } else if (wsList[i].getHostAddress() == info.url && wsList[i].isReady() == 1) {
                  /* 
                    if a websocket is opening for this address ignore connecting again
                 */
                  break;
                } else if (wsList[i].isReady() == 3) { // if previous ws is
                  // closed
                  updateConnect(info.url, i);
                  break;
                }
                i++;
              } while (i < wsSize);
            }
            break;

          case 33:

            console.log("## Bullet passing ##");
            var info = JSON.parse(inPlayer.info);
            var i = 0;
            do {
              if (wsList[i] != undefined && wsList[i].getHostAddress() == info.url && wsList[i].isReady() == 1) {
                wsList[i].send(JSON.stringify(inPlayer));
                break;
              }
              i++;
            } while (i < wsSize);

            break;

          default:
            console.log("Warning. Unsupported message type " + inPlayer.type);
        }
      }

    };
    ws.onclose = function() {
      console.log('Connection closed $$$$$$$$$$$$ ' + hostURL);
    };
    ws.onerror = function(event) {
      console.log('Connection error ' + hostURL);
    };
  };
}

/* Make connection to new server as primary, send event requests */

function passConnect(host, num) {
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

function updateConnect(host, num) {
  console.log('Reconnect to ' + host + ' with ' + num);
  wsList[num] = new WebSocketHandler(host, num);
  wsList[num].connect();
}

// -->