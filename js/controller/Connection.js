// script to handle websockets
var ws = null;
var server = new function(){
  userID = 0,
  URL = "",
  port = 0
};
var passServer = false;

// ========= first form =====================
$('#connect').click(function() {
  var hostProtocol;
  var hostLocation = 'localhost:8081'

  if (window.location.protocol == 'http:') {
    hostProtocol = 'ws://';
  } else {
    hostProtocol = 'wss://';
  }

   var URL = "ws://" + hostLocation + '/sangraama-server/org/sangraama/controller/playerservlet';
   
  console.log(URL);
  if ('MozWebSocket' in window) {
    ws = new MozWebSocket(URL);
  } else if ('WebSocket' in window) {
    ws = new WebSocket(URL,"NewPlayer");
    //ws = new WebSocket(URL,"PassPlayer");
  } else {
    alert('Your browser does not support WebSockets');
    return;
  }
  
  ws.onopen = function() {
    addMessage('Concected!');
  };
  ws.onmessage = function(event) {
    var delta = $.evalJSON(event.data);
    console.log('get userID:'+delta.userID+' dx:' + delta.dx + ' dy:' + delta.dy);
    if(delta.type != undefined ){
        console.log('type '+delta.type+' userID:'+delta.userID+' dx:' + delta.dx + ' dy:' + delta.dy);
    }else{
        console.log('type '+delta.type+' userID:'+delta.userID+' dx:' + delta.newServerURL + ' dy:' + delta.newServerPort);
        server.userID = delta.userID;
        server.URL = delta.newServerURL;
        server.port = delta.newServerPort;
        passServer = true;
        addMessage('New server '+server.URL+':'+server.port);
    }
  };
  ws.onclose = function() {
      isConnect= false;
    addMessage('Offline!');
  };
  ws.onerror = function(event) {
    addMessage('There was an error!');
  };
});
// ============ second form ====================
$('#passconnect').click(function() {
    console.log('Passconect pressed');
    var hostProtocol;
    var hostLocation = server.URL+':'+server.port; //'localhost:8080'
    var isConnect = false;

    if (window.location.protocol == 'http:') {
      hostProtocol = 'ws://';
    } else {
      hostProtocol = 'wss://';
    }

     var URL = "ws://" + hostLocation + '/sangraama-server/org/sangraama/controller/playerservlet';
     
    console.log(URL);
    if ('MozWebSocket' in window) {
      ws = new MozWebSocket(URL);
    } else if ('WebSocket' in window) {
      //ws = new WebSocket(URL,"NewPlayer");
      ws = new WebSocket(URL,"PassPlayer");
    } else {
      alert('Your browser does not support WebSockets');
      return;
    }
    
    ws.onopen = function() {
      addMessage(' Pass Concection !');
//      if(isConnect){
//          var delta = $.evalJSON(event.data);
//          console.log('userID:'+delta.userID+' dx:' + delta.dx + ' dy:' + delta.dy);
//      }else{
//          var delta = $.evalJSON(event.data);
//          console.log('userID:'+delta.userID+' dx:' + delta.dx + ' dy:' + delta.dy);
//      }
    };
    ws.onmessage = function(event) {
          var delta = $.evalJSON(event.data);
          console.log('userID:'+delta.userID+' dx:' + delta.dx + ' dy:' + delta.dy);
          if(delta.userID > 0){
              console.log('userID:'+delta.userID+' dx:' + delta.dx + ' dy:' + delta.dy);
          }else{
              server.userID = delta.userID;
              server.URL = delta.newServerURL;
              server.port = delta.newServerPort;
              passServer = true;
              addMessage('New server '+server.URL+':'+server.port);
          }
    };
    ws.onclose = function() {
      addMessage('Offline !');
    };
    ws.onerror = function(event) {
      addMessage('There was an error!');
    };
  });

function addMessage(message) {
  $('#msgArea').append('\n' + message);
}

$('#disconnect').click(function() {
  if (ws != null) {
    ws.close();
    ws = null;
  }
});

$('#send').click(function() {
  var message = $('#msg').val();
  console.log('send msg :' + message);
  var msg = {
    x : 1,
    y : message,
    v_x : 0.01,
    v_y : 0
  };
  if (ws != null) {
    ws.send($.toJSON(msg));
  }
});
