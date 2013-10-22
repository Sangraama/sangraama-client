function aoihandler() {
  var TAG = 'AOIHandler : '
  var tiles = new Array();
  var connectedHosts = new Array();
  var aoiCallTimeout = 30;
  var cntDown = aoiCallTimeout;

  var aoi = {
    aoi_w: 1000,
    aoi_h: 600
  };
  var origin = { // Validation need to be done via server
    x: 0,
    y: 0
  };
  var tile = {
    //tileId: '',
    wsIndex: 0, // websocket index that holds this sub-tile
    host: '', // host address
    h: 0, // height of the sub-tile
    w: 0, // width of the sub-tiles
    x: 0, // origin x coordination
    y: 0 // origin y coordination
  };

  this.init = function() {
    aoi = {
      aoi_w: 0,
      aoi_h: 0
    };
    v_point = {
      x_vp: 0,
      y_vp: 0
    };
    this.origin = {
      x: 0,
      y: 0
    };
    // this.setVBoxSize(this.aoi.aoi_w, this.aoi.aoi_h);
  }

  // Set Host address
  this.setConnectedHost = function(host, wsIndex) {
    /*console.log(_.find(connectedHosts, function(num) {
      return num.host == host;
    }));*/
    if (_.find(connectedHosts, function(num) {
      return num.host == host;
    }) == undefined) {
      connectedHosts = _.union(connectedHosts, {
        host: host,
        wsIndex: wsIndex
      });
    }
    return connectedHosts;
  }
  // Check whether client already connected to given server
  this.isAlreadyConnect = function(host) {
    if (_.find(connectedHosts, function(num) {
      return num.host == host;
    }) != undefined) {
      return true;
    } else {
      false;
    }
  }
  // Get the already connected host corresponding ws Index
  this.getAlreadyConnectWS = function(findHost) {
    return _.find(connectedHosts, function(value) {
      return value.host == findHost;
    });
  }
  // test purpose
  this.getConnectedHosts = function() {
    return connectedHosts;
  }
  // Remove Host address
  this.removeConnectedHost = function(host) {
    connectedHosts = _.reject(connectedHosts, function(h) {
      return h == host;
    });
  }

  // Check whether it is inside a subtile
  this.isSubTile = function(x, y) {
    var tile = _.find(tiles, function(val) {
      return (val.x <= x && x <= val.x + val.w && val.y <= y && y <= val.y + val.h) ? true : false;
    });
    if (tile != undefined) {
      return tile.wsIndex;
    } else {
      return -1;
    }
  }
  // Check whether current AIO is fulfill by server, otherwise send details about missing locations
  this.isFulfillAOI = function(x, y) {
    var unFil = new Array();
    // if already requested, send null output
    if (isAlreadyReq.apply(this)) {
      return unFil;
    } // else continue ...

    // check left down corner
    if (this.isSubTile(x - aoi.aoi_w / 2, y - aoi.aoi_h / 2) < 0) {
      unFil = _.union(unFil, (function() {
        return _.toArray(arguments);
      })({
        x: x - aoi.aoi_w / 2,
        y: y - aoi.aoi_h / 2
      }));
    }
    // check left upper corner
    else if (this.isSubTile(x - aoi.aoi_w / 2, y + aoi.aoi_h / 2) < 0) {
      unFil = _.union(unFil, (function() {
        return _.toArray(arguments);
      })({
        x: x - aoi.aoi_w / 2,
        y: y + aoi.aoi_h / 2
      }));
    }
    // check right lower corner
    else if (this.isSubTile(x + aoi.aoi_w / 2, y - aoi.aoi_h / 2) < 0) {
      unFil = _.union(unFil, (function() {
        return _.toArray(arguments);
      })({
        x: x + aoi.aoi_w / 2,
        y: y - aoi.aoi_h / 2
      }));
    }
    // check right upper corner
    else if (this.isSubTile(x + aoi.aoi_w / 2, y + aoi.aoi_h / 2) < 0) {
      unFil = _.union(unFil, (function() {
        return _.toArray(arguments);
      })({
        x: x + aoi.aoi_w / 2,
        y: y + aoi.aoi_h / 2
      }));
    }
    // if array is empty, reset the timer
    if (_.isEmpty(unFil)) {
      cntDown = aoiCallTimeout
    }
    return unFil;
  }
  // Add set of new tiles
  this.addTiles = function(wsIndex, host, ts) {
    var newTiles = _.map(ts, function(num, key) {
      num.host = host;
      num.wsIndex = wsIndex;
      return num;
    });
    tiles = _.union(tiles, newTiles);
  }
  // Get tile details
  this.getTiles = function() {
    return tiles;
  }

  // Remove set of tiles from the web socket
  this.removeTiles = function(wsIndex) {
    tiles = _.reject(tiles, function(val) {
      return val.wsIndex == wsIndex;
    });
  }
  // Set Timeout, if client already send request wait until process it

  function isAlreadyReq() {
    if (aoiCallTimeout == cntDown) {
      cntDown--;
      return false;
    } else if (cntDown == 0) {
      cntDown = aoiCallTimeout;
    } else {
      cntDown--;
    }
    return true;
  }

  // Get AOI details
  this.getAOI = function() {
    return aoi;
  }
  // Get the AOI which can send to server
  this.getAOIToJSON = function(userID) {
    return {
      type: 3,
      userID: userID,
      w: aoi.aoi_w,
      h: aoi.aoi_h
    }
  }
  // Set AOI details
  this.setAOI = function(w, h) {
    aoi.aoi_w = w;
    aoi.aoi_h = h;
    console.log(TAG + ' set AOI w:' + aoi.aoi_w + ' h:' + aoi.aoi_h + ' call setVBoxSize ...');
    this.setVBoxSize(w, h);
  }

  /***********************************************************************************
    === Virtual point handling operation ===
    The concept of set the player view in client side such that player can move
    inside a virtual box of the screen without changing the background envirnment.
    When player want to move out of that virtual box, whole background slides
    towards moving direction. This is method is using instead of center view. #gihan
   ***********************************************************************************/
  var v_point = {
    x_vp: 0, // x location of virtual point
    y_vp: 0 // y location of virtual point
  };

  /* The gap fraction between left side of screen edge
  and virtual box edge vise versa */
  var fraction_x = 0.2;
  /* The gap fraction between left side of screen edge
  and virtual box edge vise versa */
  var fraction_y = 0.2;

  /*width of vertual box*/
  var vbox_hw = 0; // virtual box half width
  var vbox_hh = 0; // virtual box half height

  // set virtual box size
  // parameters w : width of screen
  // h : height of screen
  this.setVBoxSize = function(w, h) {
    vbox_hw = w / 2 - w * 0.2;
    vbox_hh = h / 2 - h * 0.2;
    console.log(TAG + ' vbox w:' + vbox_hw + ' h:' + vbox_hh);
  }
  // Get virtual box size
  this.getVBoxSize = function() {
    return {
      vhw: vbox_hw,
      vhh: vbox_hh
    }
  }
  // check whether player is inside vbox
  // parameter x : player current x coordinate
  // y : player current y coordicate
  this.isInVBox = function(x, y) {
    if ((v_point.x_vp - vbox_hw) <= x && x <= (v_point.x_vp + vbox_hw) &&
      (v_point.y_vp - vbox_hh) <= y && y <= (v_point.y_vp + vbox_hh)) {
      return true;
    } else {
      return false;
    }
  }

  this.canPlayerBeCentered = function(x, y) {
    if ((x - (aoi.aoi_w / 2)) > 0 && (y - (aoi.aoi_h / 2)) > 0) {
      return true;
    }
    return false;
  }

  // Set Virtual point location
  this.setVirtualPoint = function(x_vp, y_vp) {
    v_point.x_vp = x_vp;
    v_point.y_vp = y_vp;
    console.log(TAG + 'set virtual point x_vp:' + x_vp + ' y_vp:' + y_vp);
    this.origin.x = x_vp - (aoi.aoi_w / 2);
    this.origin.y = y_vp - (aoi.aoi_h / 2);
    // console.log(TAG + 'set origin point x:' + this.origin.x + ' y:' + this.origin.y);

  }
  // Get Virtual point location
  this.getVirtualPoint = function() {
    return v_point;
  }
  // Get Virtual point which can send to server
  this.getVirtualPointToJSON = function(userID) {
    return {
      type: 5,
      userID: userID,
      x_vp: v_point.x_vp,
      y_vp: v_point.y_vp
    }
  }

};
// -->
