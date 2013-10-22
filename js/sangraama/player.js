<!--//

function playerhandler() {
  var p = {
    userID: 1,
    v_x: 0,
    v_y: 0,
    a: 0, //actual angle
    da: 0, // delta angle
    s: 0
  };
  var c = { // coordination of the player
    x: 0,
    y: 0,
  };

  this.init = function(userID) {
    // use 'this' to access this variable globally
    this.p = {
      userID: userID,
      v_x: 0,
      v_y: 0,
      a: 0,
      da: 0,
      s: 0
    };
  }

  // Test purpose
  this.printPlayer = function() {
    return p;
  }
  // Get Events to send server in JSON
  this.getEventToJSON = function() {
    return {
      type: 1,
      userID: this.p.userID,
      v_x: this.p.v_x,
      v_y: this.p.v_y,
      a: this.p.a,
      da: this.p.da,
      s: this.p.s
    };
  }

  // Get create a player (JSON) : only for testing
  this.getCreatePlayerToJSON = function() {
    return {
      type: 30,
      userID: this.p.userID,
      v_x: this.p.v_x,
      v_y: this.p.v_y,
      a: this.p.a,
      da: this.p.da,
      s: this.p.s
    };
  }

  // Get create a dummy player (JSON) : only for testing
  this.getDummyPlayerToJSON = function() {
    return {
      type: 31,
      userID: this.p.userID,
      v_x: this.p.v_x,
      v_y: this.p.v_y,
      a: this.p.a,
      da: this.p.da,
      s: this.p.s
    };
  }

  // Get passplayer (JSON) : only for testing
  this.getPassPlayerToJSON = function() {
    return {
      type: 30,
      userID: this.p.userID,
      v_x: this.p.v_x,
      v_y: this.p.v_y,
      a: this.p.a,
      da: this.p.da,
      s: this.p.s
    };
  }
}
//-->