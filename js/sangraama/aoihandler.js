function aoihandler() {
  var TAG = 'AOIHandler : '
  var tiles = new Array();
  var connectedHosts = new Array();
  var aoiCallTimeout = 20;
  var cntDown = aoiCallTimeout;
  var scalingFactor;

  var aoi, _aoi;
  var tile = {
    //tileId: '',
    wsIndex: 0, // websocket index that holds this sub-tile
    host: '', // host address
    h: 0, // height of the sub-tile
    w: 0, // width of the sub-tiles
    x: 0, // origin x coordination
    y: 0, // origin y coordination
    edgeX: 0, // value of origin x + width
    edgeY: 0 // value of origin y + width
  };

  this.init = function(scaling) {
    scalingFactor = scaling;
    aoi = {
      aoi_w: 0,
      aoi_h: 0
    };
    _aoi = {
      aoi_w: 0,
      aoi_h: 0
    };
    v_point = {
      x_vp: 0,
      y_vp: 0
    };
    _v_point = {
      x_vp: 0,
      y_vp: 0
    };
    vbox = {
      x_vp_l: 0, // x left limit
      x_vp_r: 0, // x right limit
      y_vp_u: 0, // y upper limit
      y_vp_d: 0 // y lower limit
    };
    // this.setVBoxSize(this.aoi.aoi_w, this.aoi.aoi_h);
  }

  /***********************************************
   * Store already connected servers
   ***********************************************/
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
  this.removeConnectedHost = function(ws) {
    connectedHosts = _.reject(connectedHosts, function(h) {
      return h.wsIndex == ws;
    });
  }

  /**********************************************
   * Handling of AOI fulfill by Servers
   **********************************************/
  // Check whether it is inside a subtile
  // NOTE : Server is passing to the other server if player is not in it's tiles
  this._isSubTile = function(x, y) {
    var tile = _.find(tiles, function(val) {
      return (val.x <= x && x <= val.edgeX && val.y <= y && y <= val.edgeY) ? true : false;
    });
    if (tile != undefined) {
      return tile.wsIndex;
    } else {
      return -1;
    }
  }
  /**
   * Check whether for a given coordinate, current AIO is fulfill by the servers,
   * otherwise send details about missing locations
   * @param  {Number}  x [x location point in server side units]
   * @param  {Number}  y [y location point in server side units]
   * @return {Object Array}   [Array of coordinations of wanted location]
   */
  this._isFulfillAOI = function(x, y) {
    var unFil = new Array();
    // if already requested, send null output
    /**
     * uncomment following when player is sending request to server more than it can response.
     * Use when "Center View" is using in client side
     */
    /*if (isAlreadyReq.apply(this)) {
      return unFil;
    }*/ // else continue ...

    // check left down corner
    if (this._isSubTile(x - _aoi.aoi_w / 2, y - _aoi.aoi_h / 2) < 0) {
      unFil = _.union(unFil, (function() {
        return _.toArray(arguments);
      })({
        x: x - _aoi.aoi_w / 2,
        y: y - _aoi.aoi_h / 2
      }));
    }
    // check left upper corner
    else if (this._isSubTile(x - _aoi.aoi_w / 2, y + _aoi.aoi_h / 2) < 0) {
      unFil = _.union(unFil, (function() {
        return _.toArray(arguments);
      })({
        x: x - _aoi.aoi_w / 2,
        y: y + _aoi.aoi_h / 2
      }));
    }
    // check right lower corner
    else if (this._isSubTile(x + _aoi.aoi_w / 2, y - _aoi.aoi_h / 2) < 0) {
      unFil = _.union(unFil, (function() {
        return _.toArray(arguments);
      })({
        x: x + _aoi.aoi_w / 2,
        y: y - _aoi.aoi_h / 2
      }));
    }
    // check right upper corner
    else if (this._isSubTile(x + _aoi.aoi_w / 2, y + _aoi.aoi_h / 2) < 0) {
      unFil = _.union(unFil, (function() {
        return _.toArray(arguments);
      })({
        x: x + _aoi.aoi_w / 2,
        y: y + _aoi.aoi_h / 2
      }));
    }
    // if array is empty, reset the timer
    if (_.isEmpty(unFil)) {
      cntDown = aoiCallTimeout
    }
    return unFil;
  }

  // check whether player is interesting in particular area anymore
  this.isInterestAOI = function(x, y) {
    var toRem = new Array(); // Server which are not interest anymore and need to remove
    // if already requested, send null output
    /*if (isAlreadyReq.apply(this)) {
      return toRem;
    }*/ // else continue ...

    // check left down corner
    if (this._isSubTile(x - aoi.aoi_w / 2, y - aoi.aoi_h / 2) < 0) {
      toRem = _.union(toRem, (function() {
        return _.toArray(arguments);
      })({
        x: x - aoi.aoi_w / 2,
        y: y - aoi.aoi_h / 2
      }));
    }
    // check left upper corner
    else if (this._isSubTile(x - aoi.aoi_w / 2, y + aoi.aoi_h / 2) < 0) {
      toRem = _.union(toRem, (function() {
        return _.toArray(arguments);
      })({
        x: x - aoi.aoi_w / 2,
        y: y + aoi.aoi_h / 2
      }));
    }
    // check right lower corner
    else if (this._isSubTile(x + aoi.aoi_w / 2, y - aoi.aoi_h / 2) < 0) {
      toRem = _.union(toRem, (function() {
        return _.toArray(arguments);
      })({
        x: x + aoi.aoi_w / 2,
        y: y - aoi.aoi_h / 2
      }));
    }
    // check right upper corner
    else if (this._isSubTile(x + aoi.aoi_w / 2, y + aoi.aoi_h / 2) < 0) {
      toRem = _.union(toRem, (function() {
        return _.toArray(arguments);
      })({
        x: x + aoi.aoi_w / 2,
        y: y + aoi.aoi_h / 2
      }));
    }
    // if array is empty, reset the timer
    if (_.isEmpty(toRem)) {
      cntDown = aoiCallTimeout
    }
    return toRem;
  }
  /**
   * Add new tiles of a server. Store them in Server units
   * IDEA : simulating server side in client (Hybrid C/S )
   * @param {[type]} wsIndex [Web Socket Index]
   * @param {[type]} host    [Host URL]
   * @param {[type]} ts      [Tiles Set]
   */
  this._addTiles = function(wsIndex, host, ts) {
    var newTiles = _.map(ts, function(num, key) {
      num.host = host;
      num.wsIndex = wsIndex;
      /*num.w = num.w * scalingFactor;
      num.h = num.h * scalingFactor;
      num.x = num.x * scalingFactor;
      num.y = num.y * scalingFactor;*/
      num.edgeX = num.x + num.w;
      num.edgeY = num.y + num.h;
      return num;
    });
    tiles = _.union(tiles, newTiles);
  }
  // Get tile details
  this._getTiles = function() {
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

  /**********************************************
   * Handling Area of Interesting
   **********************************************/
  /**
   * [Set AOI in units of client side]
   * @param {[type]} w [width of AOI in pixels]
   * @param {[type]} h [height of AOI in pixels]
   */
  this.setAOI = function(w, h) {
    aoi.aoi_w = w;
    aoi.aoi_h = h;
    console.log(TAG + ' set AOI w:' + aoi.aoi_w + ' h:' + aoi.aoi_h + ' call setVBoxSize ...');
    this._setAOI(w / scalingFactor, h / scalingFactor);
    this.setVBoxSize(w, h);
  }
  /**
   * [Set AOI in units of server side]
   * @param {[type]} w [width of AOI in server side units]
   * @param {[type]} h [height of AOI in server side units]
   */
  this._setAOI = function(w, h) {
    _aoi.aoi_w = w;
    _aoi.aoi_h = h;
  }
  // Get AOI details
  this.getAOI = function() {
    return aoi;
  }
  this._getAOI = function() {
    return _aoi;
  }
  // Get the AOI which can send to server
  this._getAOIToJSON = function(userID) {
    return {
      type: 3,
      userID: userID,
      w: _aoi.aoi_w,
      h: _aoi.aoi_h
    }
  }

  /***********************************************************************************
    === Virtual point handling operation ===
    The concept of set the player view in client side such that player can move
    inside a virtual box of the screen without changing the background envirnment.
    When player want to move out of that virtual box, whole background slides
    towards moving direction. This is method is using instead of center view. #gihan
   ***********************************************************************************/


  /**
   * x_vp : x location of virtual point
   * y_vp : y location of virtual point
   * @type {Object}
   */
  var v_point, _v_point;

  /* The gap fraction between left side of screen edge
  and virtual box edge vise versa */
  var fraction_x = 0.2;
  /* The gap fraction between left side of screen edge
  and virtual box edge vise versa */
  var fraction_y = 0.2;

  /*width of vertual box*/
  var vbox_hw = 0; // virtual box half width
  var vbox_hh = 0; // virtual box half height
  var vbox;

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
      w: vbox_hw * 2,
      h: vbox_hh * 2
    }
  }
  /**
   * Check whether player is inside vbox
   * @param  {[type]}  x [player current x coordinate]
   * @param  {[type]}  y [player current y coordicate]
   * @return {Boolean}   [true if is inside box, false otherwise]
   */
  this.isInVBox = function(x, y) {
    if (vbox.x_vp_l <= x && x <= vbox.x_vp_r && vbox.y_vp_u <= y && y <= vbox.y_vp_d) {
      return true;
    } else {
      return false;
    }
  }

  this._setVBoxRestrictions = function(vp_al) {
    // Set resctriction on x level at left
    vbox.x_vp_l = (vp_al.xl == 1) ? (v_point.x_vp - aoi.aoi_w / 2) : (v_point.x_vp - vbox_hw);
    // Set resctriction on x level at right
    vbox.x_vp_r = (vp_al.xl == 2) ? (v_point.x_vp + aoi.aoi_w / 2) : (v_point.x_vp + vbox_hw);
    // Set resctriction on y level at upper
    vbox.y_vp_u = (vp_al.yl == 1) ? (v_point.y_vp - aoi.aoi_h / 2) : (v_point.y_vp - vbox_hh);
    // Set resctriction on y level at lower
    vbox.y_vp_d = (vp_al.yl == 2) ? (v_point.y_vp + aoi.aoi_h / 2) : (v_point.y_vp + vbox_hh);
  }

  /**
   * Set Virtual point location of client side
   * @param {[type]} x_vp [x coordinates in pixels]
   * @param {[type]} y_vp [y coordinates in pixels]
   * @param {[type]} call [if ture call _setVirtualPoint() inside]
   */
  this.setVirtualPoint = function(x_vp, y_vp) {
    v_point.x_vp = x_vp;
    v_point.y_vp = y_vp;
    console.log(TAG + 'set virtual point x_vp:' + x_vp + ' y_vp:' + y_vp);
    gEngine.setOriginOfCanvas(x_vp - (aoi.aoi_w / 2), y_vp - (aoi.aoi_h / 2));
  }
  /**
   * Set Virtual point location of server side
   * @param {[type]} x_vp [x coordinates in server side units]
   * @param {[type]} y_vp [x coordinates in server side units]
   * @param {[type]} call [if ture call setVirtualPoint() inside]
   */
  this._setVirtualPoint = function(x_vp, y_vp) {
    _v_point.x_vp = x_vp;
    _v_point.y_vp = y_vp;
    // console.log(TAG + 'set VP [server side units] x_vp:' + x_vp + ' y_vp:' + y_vp);
    this.setVirtualPoint(x_vp * scalingFactor, y_vp * scalingFactor);
  }

  /**
   * Get Virtual point location
   * @return {[type]} [Return Coordination Object]
   */
  this.getVirtualPoint = function() {
    return v_point;
  }
  /**
   * Get Virtual point location in server side units
   * @return {[type]} [Return Coordination Object]
   */
  this._getVirtualPoint = function() {
    return _v_point;
  }
  /**
   * Get Virtual point which can send to server
   * @param  {[type]} userID [Player ID]
   * @return {[type]}        [Coordination Object in JSON format]
   */
  this._getVirtualPointToJSON = function(userID) {
    return {
      type: 5,
      userID: userID,
      x_vp: _v_point.x_vp,
      y_vp: _v_point.y_vp
    }
  }
  /**
   * Create Virtual point which can send to server
   * @param  {[type]} userID [Player ID]
   * @param  {[type]} x_vp [Virtual point x coordination]
   * @param  {[type]} y_vp [Virtual point y coordination]
   * @return {[type]}        [Coordination Object in JSON format]
   */
  this._createVirtualPointToJSON = function(userID, x_vp, y_vp) {
    return {
      type: 5,
      userID: userID,
      x_vp: x_vp,
      y_vp: y_vp
    }
  }

};
// -->