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
    p = {
      userID: userID,
      v_x: 0,
      v_y: 0,
      a: 0,
      da: 0,
      s: 0
    };
  }

  // Test purpose
  this.printPlayer = function(){
    return p;
  }
  // Get Events to send server in JSON
  this.getEventToJSON = function(){
    return {
      type: 1,
      userID: userID,
      v_x: 0,
      v_y: 0,
      a: 0,
      da: 0,
      s: 0
    };
  }

  // Get create a player (JSON)
  this.getCreatePlayerToJSON = function(){
    return {
      type: 100,
      
    };
  }

  // Get create a dummy player (JSON)
  this.getDummyPlayerToJSON = function(){

  }

  // Get passplayer (JSON)
  this.getPassPlayer = function(){

  }
}
//-->