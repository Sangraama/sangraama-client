// script to handle websockets
var ws = null;

$('#connect').click(function() {
  var hostProtocol;
  var hostLocation = 'localhost:8081'

  if (window.location.protocol == 'http:') {
    hostProtocol = 'ws://';
  } else {
    hostProtocol = 'wss://';
  }

   var URL = "ws://" + hostLocation + '/sangraama-server/org/sangraama/controller/playerservlet';
  //var URL = "ws://" + hostLocation + '/sangraama-server/org/sangraama/controller/EventHandler';
   
  console.log(URL);
  if ('MozWebSocket' in window) {
    ws = new MozWebSocket(URL);
  } else if ('WebSocket' in window) {
    ws = new WebSocket(URL);
  } else {
    alert('Your browser does not support WebSockets');
    return;
  }
  
  ws.onopen = function() {
    addMessage('Concected!');
  };
  ws.onmessage = function(event) {
    var delta = $.evalJSON(event.data);
    console.log('userID:'+delta.userID+' dx:' + delta.dx + ' dy:' + delta.dy);
  };
  ws.onclose = function() {
    addMessage('Offline!');
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
