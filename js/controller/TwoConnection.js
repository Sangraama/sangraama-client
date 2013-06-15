var wsTwo = null;
function connectTwo(host) {
    console.log(host);
    if ('MozWebSocket' in window) {
        wsTwo = new MozWebSocket(host);
    } else if ('WebSocket' in window) {
        wsTwo = new WebSocket(host);
    } else {
        alert('Your browser does not support WebSockets');
    }
    wsTwo.onopen = function() {
        console.log('Connection Two opened ' + host);
    };
    wsTwo.onmessage = function(event) {
        var players = JSON.parse(event.data);
        console.log(event.data);
        clear();
        for ( var index in players) {
            var inPlayer = players[index];
            if (inPlayer.type == 1) {
                drawRotatedImage(ship, inPlayer);
            }
        }
    };
    wsTwo.onclose = function() {
        console.log('Connection Two closed');
    };
    wsTwo.onerror = function(event) {
        console.log('Connection Two error');
    };
}

function updateServerTwo() {
    if (wsTwo != null) {
        wsTwo.send(JSON.stringify(player));
    }
}